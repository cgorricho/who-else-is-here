# auto_story.py — Phase 1 Architecture

> **Status:** Design sketch — not yet approved for implementation
> **Scope:** Single-story automation (`--story 1-1`)
> **Author:** BMad Master + Carlos Gorricho
> **Date:** 2026-03-05

---

## 1. Overview

`auto_story.py` automates the BMAD story cycle by spawning fresh Claude Code
sessions via `claude --print --dangerously-skip-permissions`. Each workflow
runs in isolation — no session handoffs, no context compression. State lives
in files (sprint-status.yaml, story files), not in AI memory.

### Story Cycle (per story)

```
create-story ──► dev-story ──► code-review ──┬──► trace (optional) ──► DONE
                     ▲                       │
                     └── review failed ◄─────┘
                         (max 2 retries)
```

### Key Principles

1. **One workflow = one Claude session** — fresh context every time
2. **File-based state** — sprint-status.yaml is the single source of truth
3. **Different model for code review** — adversarial by design
4. **Detect success/failure by reading file state** — not by parsing Claude output
5. **Fail fast, log everything** — append-only log for debugging

---

## 2. File Structure

```
who-else-is-here/
├── automation/
│   ├── auto_story.py          # Main entry point (~300 lines)
│   ├── config.py              # Model names, paths, retry limits (~40 lines)
│   ├── state.py               # Read/write sprint-status.yaml + story files (~80 lines)
│   ├── runner.py              # Invoke Claude sessions (~100 lines)
│   ├── prompts.py             # Prompt templates for each workflow (~60 lines)
│   └── log.py                 # Structured logging to automation/runs/ (~30 lines)
├── automation/runs/           # Per-run logs (gitignored)
│   └── 2026-03-05T14-30-00_1-1/
│       ├── run.log            # Human-readable execution log
│       ├── 01-create-story.stdout.md
│       ├── 02-dev-story.stdout.md
│       ├── 03-code-review.stdout.md
│       └── 04-trace.stdout.md
```

---

## 3. Configuration (`config.py`)

```python
from pathlib import Path

# Paths (relative to project root)
PROJECT_ROOT = Path(__file__).parent.parent
SPRINT_STATUS = PROJECT_ROOT / "_bmad-output/implementation-artifacts/sprint-status.yaml"
IMPL_ARTIFACTS = PROJECT_ROOT / "_bmad-output/implementation-artifacts"
RUNS_DIR = Path(__file__).parent / "runs"

# Claude invocation
DEV_MODEL = "opus"                      # For create-story, dev-story, trace
REVIEW_MODEL = "sonnet"                 # Different model for adversarial review
CLAUDE_BIN = "claude"                   # Assumes claude is on PATH

# Retry limits
MAX_REVIEW_RETRIES = 2                  # code-review → dev-story → code-review loop
CLAUDE_TIMEOUT_SECONDS = 1800           # 30 min per workflow invocation

# Workflow skill commands (the /command that each workflow maps to)
WORKFLOWS = {
    "create-story":  "/bmad-bmm-create-story",
    "dev-story":     "/bmad-bmm-dev-story",
    "code-review":   "/bmad-bmm-code-review",
    "trace":         "/bmad-tea-testarch-trace",
}
```

### Model Selection Rationale

The `REVIEW_MODEL` MUST differ from `DEV_MODEL`. This is not optional — it's
a core BMAD principle. The reviewer should not share the same biases as the
implementer. If both are Claude, at minimum use a different model tier. For
even stronger adversarial review, this could be swapped to a non-Claude
model via a different CLI tool (e.g., `aider` with GPT-4, Gemini CLI, etc.).

---

## 4. State Management (`state.py`)

### Reading Sprint Status

```python
import yaml
from pathlib import Path

def read_sprint_status(path: Path) -> dict:
    """Parse sprint-status.yaml, return the development_status dict."""
    with open(path) as f:
        data = yaml.safe_load(f)
    return data.get("development_status", {})

def get_story_status(status: dict, story_key: str) -> str | None:
    """Get status for a story key like '1-1' by matching the prefix.

    Story keys in sprint-status.yaml look like:
      1-1-project-scaffold-database-foundation: review
    We match on the '1-1' prefix.
    """
    for key, value in status.items():
        if key.startswith(f"{story_key}-") and not key.startswith("epic-"):
            return value
    return None

def get_story_full_key(status: dict, story_key: str) -> str | None:
    """Return the full key (e.g., '1-1-project-scaffold-database-foundation')
    for a short story key like '1-1'."""
    for key in status:
        if key.startswith(f"{story_key}-") and not key.startswith("epic-"):
            return key
    return None
```

### Reading Story File Status

```python
import re

def read_story_status(story_path: Path) -> str | None:
    """Read the Status field from a story .md file.

    Looks for a line like: Status: review
    """
    text = story_path.read_text()
    match = re.search(r"^Status:\s*(.+)$", text, re.MULTILINE)
    return match.group(1).strip() if match else None

def story_has_review_followups(story_path: Path) -> bool:
    """Check if story has unchecked [AI-Review] items (code-review failures)."""
    text = story_path.read_text()
    return bool(re.search(r"- \[ \] \[AI-Review\]", text))
```

### Why File-Based State Works

After each Claude session exits, we read the files it modified. We never
parse Claude's stdout to determine success — stdout is saved for debugging
only. The file state is authoritative:

| Check | How |
|-------|-----|
| create-story succeeded? | Story file exists AND sprint-status shows `ready-for-dev` |
| dev-story succeeded? | Sprint-status shows `review` AND all tasks marked `[x]` |
| code-review passed? | Sprint-status shows `done` |
| code-review failed? | Sprint-status shows `in-progress` AND story has `[AI-Review]` items |

---

## 5. Claude Session Runner (`runner.py`)

### Core Invocation

```python
import subprocess
import sys
from pathlib import Path
from config import CLAUDE_BIN, CLAUDE_TIMEOUT_SECONDS

def run_workflow(
    workflow_name: str,
    prompt: str,
    model: str,
    log_path: Path,
    cwd: Path,
) -> tuple[int, str]:
    """Run a single Claude session and capture output.

    Returns (exit_code, stdout_text).
    """
    cmd = [
        CLAUDE_BIN,
        "--print",
        "--dangerously-skip-permissions",
        "--model", model,
    ]

    result = subprocess.run(
        cmd,
        input=prompt,
        capture_output=True,
        text=True,
        timeout=CLAUDE_TIMEOUT_SECONDS,
        cwd=cwd,
    )

    # Save full output for debugging
    log_path.write_text(result.stdout)

    if result.returncode != 0:
        error_log = log_path.with_suffix(".stderr.md")
        error_log.write_text(result.stderr)

    return result.returncode, result.stdout
```

### Prompt Construction

Each workflow gets a carefully constructed prompt that:
1. Sets the agent persona (but NOT the BMAD Master — see §7)
2. Issues the skill command
3. Provides any needed parameters (story key, file path)

```python
# prompts.py

def create_story_prompt(story_key: str) -> str:
    return f"""\
You are a BMAD Scrum Master agent. Execute the following workflow command:

/bmad-bmm-create-story

When prompted for which story, use story key: {story_key}

Complete the entire workflow without asking questions. If you encounter
ambiguity, make reasonable decisions and document them in the story file.
"""

def dev_story_prompt(story_file_path: str) -> str:
    return f"""\
You are a BMAD Developer agent. Execute the following workflow command:

/bmad-bmm-dev-story

The story file is at: {story_file_path}

Implement ALL tasks and subtasks. Run tests after each task. Do not stop
to ask questions — if blocked, document the blocker in the Dev Agent Record
and continue with the next task. Mark the story as "review" when all tasks
are complete.
"""

def code_review_prompt(story_file_path: str) -> str:
    return f"""\
You are a Senior Developer performing an adversarial code review.
Execute the following workflow command:

/bmad-bmm-code-review

The story file is at: {story_file_path}

Be thorough and critical. Find at minimum 3 issues. For any HIGH or MEDIUM
findings, fix them directly in the code (option 1 when prompted). Update
the story status accordingly.
"""

def trace_prompt(story_key: str) -> str:
    return f"""\
You are a BMAD Test Architect. Execute the following workflow command:

/bmad-tea-testarch-trace

Trace story: {story_key}

Complete the full traceability analysis. Save the output artifact.
"""
```

---

## 6. Orchestration (`auto_story.py`)

### Main Flow

```python
#!/usr/bin/env python3
"""
auto_story.py — Automate the BMAD story cycle for a single story.

Usage:
    python automation/auto_story.py --story 1-1
    python automation/auto_story.py --story 1-1 --skip-create  # story already exists
    python automation/auto_story.py --story 1-1 --skip-trace   # skip optional trace
"""

import argparse
import sys
from datetime import datetime
from pathlib import Path

from config import (
    PROJECT_ROOT, SPRINT_STATUS, IMPL_ARTIFACTS, RUNS_DIR,
    DEV_MODEL, REVIEW_MODEL, MAX_REVIEW_RETRIES,
)
from state import (
    read_sprint_status, get_story_status, get_story_full_key,
    read_story_status,
)
from runner import run_workflow
from prompts import (
    create_story_prompt, dev_story_prompt,
    code_review_prompt, trace_prompt,
)
from log import RunLogger


def find_story_file(story_key: str) -> Path | None:
    """Find the story .md file by matching the key prefix."""
    for f in IMPL_ARTIFACTS.glob(f"{story_key}-*.md"):
        return f
    return None


def main():
    parser = argparse.ArgumentParser(description="Automate BMAD story cycle")
    parser.add_argument("--story", required=True, help="Story key, e.g. '1-1'")
    parser.add_argument("--skip-create", action="store_true",
                       help="Skip create-story (story file already exists)")
    parser.add_argument("--skip-trace", action="store_true",
                       help="Skip optional trace workflow")
    parser.add_argument("--dry-run", action="store_true",
                       help="Print what would run without executing")
    args = parser.parse_args()

    story_key = args.story
    timestamp = datetime.now().strftime("%Y-%m-%dT%H-%M-%S")
    run_dir = RUNS_DIR / f"{timestamp}_{story_key}"
    run_dir.mkdir(parents=True, exist_ok=True)
    log = RunLogger(run_dir / "run.log")

    log.info(f"=== auto_story.py — Story {story_key} ===")
    log.info(f"Dev model: {DEV_MODEL} | Review model: {REVIEW_MODEL}")
    log.info(f"Run directory: {run_dir}")

    # ── STEP 1: Create Story ──────────────────────────────────────────
    if not args.skip_create:
        status = read_sprint_status(SPRINT_STATUS)
        current = get_story_status(status, story_key)

        if current != "backlog":
            log.info(f"Story {story_key} is '{current}', not 'backlog' — skipping create-story")
        else:
            log.info("Step 1/4: Running create-story...")
            if not args.dry_run:
                exit_code, _ = run_workflow(
                    "create-story",
                    create_story_prompt(story_key),
                    DEV_MODEL,
                    run_dir / "01-create-story.stdout.md",
                    PROJECT_ROOT,
                )

                # Verify
                status = read_sprint_status(SPRINT_STATUS)
                if get_story_status(status, story_key) != "ready-for-dev":
                    log.error("create-story FAILED — story not moved to ready-for-dev")
                    sys.exit(1)
                log.info("create-story completed ✓")

    # ── STEP 2: Dev Story ─────────────────────────────────────────────
    story_file = find_story_file(story_key)
    if not story_file:
        log.error(f"No story file found matching {story_key}-*.md")
        sys.exit(1)

    log.info(f"Step 2/4: Running dev-story on {story_file.name}...")
    if not args.dry_run:
        exit_code, _ = run_workflow(
            "dev-story",
            dev_story_prompt(str(story_file)),
            DEV_MODEL,
            run_dir / "02-dev-story.stdout.md",
            PROJECT_ROOT,
        )

        # Verify
        status = read_sprint_status(SPRINT_STATUS)
        if get_story_status(status, story_key) != "review":
            log.error("dev-story FAILED — story not moved to review")
            sys.exit(1)
        log.info("dev-story completed ✓")

    # ── STEP 3: Code Review (with retry loop) ─────────────────────────
    for attempt in range(1, MAX_REVIEW_RETRIES + 2):  # +2 because range is exclusive
        log.info(f"Step 3/4: Running code-review (attempt {attempt})...")
        if not args.dry_run:
            suffix = f".attempt{attempt}" if attempt > 1 else ""
            exit_code, _ = run_workflow(
                "code-review",
                code_review_prompt(str(story_file)),
                REVIEW_MODEL,                          # ← Different model!
                run_dir / f"03-code-review{suffix}.stdout.md",
                PROJECT_ROOT,
            )

            # Check outcome
            status = read_sprint_status(SPRINT_STATUS)
            story_stat = get_story_status(status, story_key)

            if story_stat == "done":
                log.info("code-review PASSED ✓ — story is done")
                break

            if story_stat == "in-progress":
                if attempt > MAX_REVIEW_RETRIES:
                    log.error(
                        f"code-review FAILED after {MAX_REVIEW_RETRIES} retries. "
                        "Manual intervention required. Consider running Party Mode "
                        "to analyze recurring issues:\n"
                        "  claude> /bmad-agent-bmad-master → Party Mode"
                    )
                    sys.exit(2)

                log.warning(
                    f"code-review returned issues — re-running dev-story "
                    f"(retry {attempt}/{MAX_REVIEW_RETRIES})"
                )
                # Re-run dev-story to fix review items
                exit_code, _ = run_workflow(
                    "dev-story",
                    dev_story_prompt(str(story_file)),
                    DEV_MODEL,
                    run_dir / f"02-dev-story.retry{attempt}.stdout.md",
                    PROJECT_ROOT,
                )
                status = read_sprint_status(SPRINT_STATUS)
                if get_story_status(status, story_key) != "review":
                    log.error("dev-story retry FAILED")
                    sys.exit(1)
                continue

            # Unexpected status
            log.error(f"Unexpected status after code-review: {story_stat}")
            sys.exit(1)

    # ── STEP 4: Trace (optional) ──────────────────────────────────────
    if not args.skip_trace:
        log.info("Step 4/4: Running trace...")
        if not args.dry_run:
            exit_code, _ = run_workflow(
                "trace",
                trace_prompt(story_key),
                DEV_MODEL,
                run_dir / "04-trace.stdout.md",
                PROJECT_ROOT,
            )
            log.info("trace completed ✓")
    else:
        log.info("Step 4/4: Skipping trace (--skip-trace)")

    # ── DONE ──────────────────────────────────────────────────────────
    log.info(f"=== Story {story_key} COMPLETE ===")
    print(f"\n✅ Story {story_key} completed successfully!")
    print(f"   Logs: {run_dir}")


if __name__ == "__main__":
    main()
```

---

## 7. Architecture Decisions

### AD-1: No BMAD Master as the invoked agent

**Decision:** The prompts do NOT invoke the BMAD Master. They invoke skill
commands directly.

**Rationale:** The BMAD Master is an interactive menu-driven persona. In
`--print` mode there is no interactive loop. The Master's value is
*orchestration* — deciding which workflow to run next. In automation, the
Python script replaces that orchestration role. Each workflow runs standalone
via its `/bmad-bmm-*` skill command, which loads the workflow engine
(`workflow.xml`) directly.

### AD-2: Detect success by reading files, not parsing output

**Decision:** After each Claude session exits, read `sprint-status.yaml` and
the story file to determine success or failure.

**Rationale:** Claude's stdout is verbose, unpredictable, and may include
warnings, tool output, or formatting artifacts. File state is deterministic:
a story is either `review` or it isn't.

### AD-3: Code review uses a different model

**Decision:** `REVIEW_MODEL` defaults to `sonnet` when `DEV_MODEL` is `opus`.
Configurable.

**Rationale:** Same-model review has confirmation bias. The reviewer should
bring different reasoning patterns. In Phase 1, we use two Claude tiers. In
a future phase, this could be a completely different LLM (Gemini, GPT).

### AD-4: Review failure loops are bounded

**Decision:** Maximum 2 retries (dev-story → code-review cycle). After that,
exit with code 2 and suggest manual Party Mode.

**Rationale:** Unbounded loops risk infinite cycling. 2 retries gives 3 total
review attempts, which is sufficient for fixable issues. Systemic problems
need human judgment (Party Mode).

### AD-5: Party Mode stays manual in Phase 1

**Decision:** When review fails after max retries, the script exits with a
message suggesting the user run Party Mode interactively.

**Rationale:** Party Mode is a multi-expert interactive discussion. Automating
it in `--print` mode would strip it of its interactive value. The user should
invoke it manually via `/bmad-agent-bmad-master` in the Claude TUI when they
want expert panel analysis.

### AD-6: Each workflow gets a fresh Claude session

**Decision:** Every workflow invocation is a separate `subprocess.run()` call
to `claude --print`. No session reuse.

**Rationale:** This is the ralph pattern that works. Fresh context = no
compression artifacts, no persona drift, no hallucinated state. The workflow
instructions and story files provide all needed context.

### AD-7: Git operations are NOT automated

**Decision:** The script does not run `git add`, `git commit`, or `git push`.
Code changes are left unstaged.

**Rationale:** Carlos should review and commit at natural milestones. Automated
commits without human review defeats the purpose of the quality gates. Carlos
can add `--auto-commit` in a future phase if desired.

---

## 8. Logging (`log.py`)

```python
import sys
from datetime import datetime
from pathlib import Path


class RunLogger:
    def __init__(self, log_path: Path):
        self.log_path = log_path
        self.log_path.touch()

    def _write(self, level: str, msg: str):
        timestamp = datetime.now().strftime("%H:%M:%S")
        line = f"[{timestamp}] {level}: {msg}"
        print(line, file=sys.stderr)
        with open(self.log_path, "a") as f:
            f.write(line + "\n")

    def info(self, msg: str):
        self._write("INFO", msg)

    def warning(self, msg: str):
        self._write("WARN", msg)

    def error(self, msg: str):
        self._write("ERROR", msg)
```

---

## 9. Usage Examples

```bash
# Full story cycle for story 1-1
python automation/auto_story.py --story 1-1

# Story already exists (skip create-story)
python automation/auto_story.py --story 1-1 --skip-create

# Skip optional trace
python automation/auto_story.py --story 1-1 --skip-trace

# Dry run — show what would execute
python automation/auto_story.py --story 1-1 --dry-run

# Story 1-2 (next story after 1-1 is done)
python automation/auto_story.py --story 1-2
```

---

## 10. Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Story completed successfully |
| 1 | Workflow failed (create-story or dev-story didn't produce expected state) |
| 2 | Code review failed after max retries — manual intervention needed |

---

## 11. What Phase 1 Does NOT Include

- **Batch stories** (`--stories 1-1,1-2`) — Phase 2
- **Epic automation** (`--epic 1`) — Phase 2
- **Automated Party Mode** — Phase 3 (may stay manual permanently)
- **Non-Claude review models** — Phase 2+ (requires different CLI tool)
- **Auto-commit/push** — Future phase, only if Carlos wants it
- **ATDD workflow** — The TEA ATDD workflow runs *before* dev-story in the
  full 10-workflow cycle. Phase 1 assumes ATDD tests already exist.
- **Retrospective automation** — Phase 2 (part of epic automation)

---

## 12. Open Questions for Carlos

1. **Model pairing:** `opus` for dev + `sonnet` for review, or do you want
   the reverse? (Opus is more thorough but slower/costlier for review.)

2. **Timeout:** 30 minutes per workflow — is that enough for a large story's
   dev-story phase? Should it be configurable per workflow?

3. **ATDD integration:** Should Phase 1 include the ATDD workflow as Step 0
   (before dev-story), or keep it separate since you've been running it
   manually as part of the planning phase?

4. **Auto-commit:** Should the script commit after a successful story
   completion, or leave that to you?

5. **Claude `--print` availability:** Have you verified that `claude --print`
   and `--dangerously-skip-permissions` work on your system? (These are
   Claude Code CLI flags, not API flags.)

6. **Python environment:** Should this use a venv inside `automation/`, or
   are you fine with system Python + `pyyaml` as the only dependency?
