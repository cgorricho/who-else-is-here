import { useState } from "react";
import { Search, X, ChevronRight } from "lucide-react";
import { attendees as allAttendees, sessionInfo } from "@/data/attendees";

const SearchFilter = () => {
  const [query, setQuery] = useState("Google");

  const filtered = allAttendees.filter((a) => {
    const q = query.toLowerCase();
    return (
      a.firstName.toLowerCase().includes(q) ||
      a.lastName.toLowerCase().includes(q) ||
      a.title.toLowerCase().includes(q) ||
      a.company.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card shadow-sm px-4 py-3">
        <div className="lg:max-w-[640px] lg:mx-auto">
          <div className="flex justify-between items-baseline">
            <h1 className="text-base font-semibold text-gray-900">
              <span className="lg:hidden">{sessionInfo.sessionName}</span>
              <span className="hidden lg:inline">
                {sessionInfo.sessionName} · {sessionInfo.timeRange}
              </span>
            </h1>
            <span className="text-sm text-gray-600">
              <span className="lg:hidden">{sessionInfo.timeRangeShort}</span>
            </span>
          </div>
          <div className="flex justify-between items-center mt-0.5">
            <p className="text-sm text-gray-600">
              <span className="hidden lg:inline">{sessionInfo.eventName} · </span>
              {query
                ? `${filtered.length} of ${sessionInfo.attendeeCount} professionals`
                : `${sessionInfo.attendeeCount} professionals here`}
            </p>
            <button className="p-2 -mr-2" aria-label="Search attendees">
              <Search className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
        <div className="lg:max-w-[640px] lg:mx-auto relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, title, or company"
            className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 focus:border-primary-600 focus:ring-1 focus:ring-primary-600 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <main className="lg:max-w-[640px] lg:mx-auto">
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-500">
              No one matches '{query}'. Try a different name, title, or company.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 pt-2">
            {filtered
              .sort((a, b) => a.firstName.localeCompare(b.firstName))
              .map((attendee) => (
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
                  </div>
                  <ChevronRight className="flex-shrink-0 w-4 h-4 text-gray-400" />
                </a>
              ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchFilter;
