import { useState } from "react";
import { Search, SlidersHorizontal, ChevronRight, ChevronDown } from "lucide-react";

interface SessionGroup {
  id: string;
  name: string;
  room: string;
  count: number;
  attendees: {
    id: string;
    initials: string;
    firstName: string;
    lastName: string;
    title: string;
    company: string;
    alsoIn?: string[];
  }[];
}

const sessions: SessionGroup[] = [
  {
    id: "1",
    name: "Career Quest Workshop",
    room: "Room 101",
    count: 38,
    attendees: [
      { id: "1", initials: "AO", firstName: "Aisha", lastName: "Okafor", title: "VP Partnerships", company: "Microsoft" },
      { id: "2", initials: "CM", firstName: "Carlos", lastName: "Mendoza", title: "Founder", company: "NexGen AI" },
      { id: "3", initials: "DK", firstName: "David", lastName: "Kim", title: "Sr. Manager BD", company: "Salesforce", alsoIn: ["Recruiters Panel", "Resume Review"] },
      { id: "10", initials: "SC", firstName: "Sarah", lastName: "Chen", title: "VP Engineering", company: "Google", alsoIn: ["LinkedIn Optimization"] },
    ],
  },
  { id: "2", name: "Recruiters Panel", room: "Room 102", count: 24, attendees: [] },
  { id: "3", name: "Resume Review", room: "Room 103", count: 31, attendees: [] },
  { id: "4", name: "LinkedIn Optimization", room: "Room 104", count: 19, attendees: [] },
  { id: "5", name: "Interview Prep", room: "Room 105", count: 12, attendees: [] },
];

const filterPills = [
  { id: "all", label: "All Sessions" },
  { id: "1", label: "Career Quest" },
  { id: "2", label: "Recruiters Panel" },
  { id: "3", label: "Resume Review" },
  { id: "4", label: "LinkedIn Optimization" },
  { id: "5", label: "Interview Prep" },
];

const EventAggregate = () => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(["1"]));
  const [activeFilter, setActiveFilter] = useState("all");
  const [filterBarOpen, setFilterBarOpen] = useState(false);

  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filteredSessions = activeFilter === "all" ? sessions : sessions.filter((s) => s.id === activeFilter);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-card shadow-sm px-4 py-3">
        <div className="lg:max-w-[768px] lg:mx-auto">
          <div className="flex justify-between items-baseline">
            <h1 className="text-base font-semibold text-gray-900">RUMC Job Networking</h1>
            <span className="text-sm text-gray-600">Today</span>
          </div>
          <div className="flex justify-between items-center mt-0.5">
            <p className="text-sm text-gray-600">87 professionals across 5 sessions</p>
            <div className="flex items-center gap-2">
              <button className="p-2 -mr-1" aria-label="Search attendees">
                <Search className="w-5 h-5 text-gray-400" />
              </button>
              <button
                className="p-2 -mr-2"
                aria-label="Filter sessions"
                onClick={() => setFilterBarOpen((v) => !v)}
              >
                <SlidersHorizontal className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Filter Bar */}
      {filterBarOpen && (
        <div className="sticky top-[60px] z-10 bg-card border-b border-gray-200 px-4 py-3">
          <div className="lg:max-w-[768px] lg:mx-auto flex flex-wrap lg:flex-wrap gap-2 overflow-x-auto lg:overflow-visible">
            {filterPills.map((pill) => (
              <button
                key={pill.id}
                onClick={() => setActiveFilter(pill.id)}
                className={`whitespace-nowrap text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                  activeFilter === pill.id
                    ? "bg-primary-600 text-primary-foreground"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Session Groups */}
      <main className="lg:max-w-[768px] lg:mx-auto pb-6">
        {filteredSessions.map((session) => {
          const isExpanded = expandedGroups.has(session.id);
          const moreCount = session.count - session.attendees.length;

          return (
            <div key={session.id}>
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(session.id)}
                className="w-full flex items-center bg-gray-50 px-4 py-2 sticky top-[60px] z-[5] text-left"
                style={filterBarOpen ? { top: "108px" } : undefined}
              >
                <span className="text-sm font-semibold text-gray-700 flex-1">
                  {session.name} · {session.room}
                </span>
                <span className="text-sm text-gray-400 ml-2">({session.count})</span>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-400 ml-2" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400 ml-2" />
                )}
              </button>

              {/* Group Content */}
              {isExpanded && (
                <div className="flex flex-col gap-2 pt-2">
                  {session.attendees.map((attendee) => (
                    <a
                      key={attendee.id}
                      href="#"
                      className="flex items-center gap-3 bg-card px-4 py-3 min-h-[72px] transition-colors hover:bg-gray-50 active:bg-gray-100"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-semibold">
                        {attendee.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold text-gray-900 truncate">
                          {attendee.firstName} {attendee.lastName}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {attendee.title} · {attendee.company}
                        </p>
                        {attendee.alsoIn && (
                          <p className="text-xs text-primary-600">
                            Also in: {attendee.alsoIn.join(", ")}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="flex-shrink-0 w-4 h-4 text-gray-400" />
                    </a>
                  ))}
                  {moreCount > 0 && (
                    <button className="px-4 py-2 text-sm font-medium text-primary-600 text-left hover:underline">
                      {moreCount} more
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </main>
    </div>
  );
};

export default EventAggregate;
