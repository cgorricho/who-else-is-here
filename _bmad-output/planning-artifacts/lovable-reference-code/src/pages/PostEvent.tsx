import { Search, ChevronRight } from "lucide-react";
import { attendees as allAttendees, sessionInfo } from "@/data/attendees";

const AttendeeCard = ({
  initials,
  name,
  titleCompany,
}: {
  initials: string;
  name: string;
  titleCompany: string;
}) => (
  <a
    href="#"
    className="flex items-center gap-3 bg-card px-4 py-3 min-h-[72px] transition-colors duration-150 ease-in-out hover:bg-gray-50 active:bg-gray-100"
  >
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-semibold">
      {initials}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-base font-semibold text-gray-900 truncate">{name}</p>
      <p className="text-sm text-gray-600 truncate lg:line-clamp-2 lg:whitespace-normal">
        {titleCompany}
      </p>
    </div>
    <ChevronRight className="flex-shrink-0 w-4 h-4 text-gray-400" />
  </a>
);

const PostEvent = () => {
  const sorted = [...allAttendees].sort((a, b) =>
    a.firstName.localeCompare(b.firstName)
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-card shadow-sm px-4 py-3">
        <div className="lg:max-w-[640px] lg:mx-auto">
          <div className="flex justify-between items-baseline">
            <h1 className="text-base font-semibold text-gray-900">
              <span className="lg:hidden">{sessionInfo.sessionName}</span>
              <span className="hidden lg:inline">
                {sessionInfo.sessionName} · {sessionInfo.timeRange} · <span className="text-gray-400">Ended</span>
              </span>
            </h1>
            <span className="text-sm text-gray-600">
              <span className="lg:hidden">{sessionInfo.timeRangeShort} · <span className="text-gray-400">Ended</span></span>
            </span>
          </div>
          <div className="flex justify-between items-center mt-0.5">
            <p className="text-sm text-gray-600">
              <span className="hidden lg:inline">
                {sessionInfo.eventName} ·{" "}
              </span>
              {sessionInfo.attendeeCount} professionals attended
            </p>
            <button
              className="p-2 -mr-2 transition-colors duration-150 ease-in-out"
              aria-label="Search attendees"
            >
              <Search className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Post-event banner */}
      <div className="bg-primary-50 text-primary-700 px-4 py-3">
        <div className="lg:max-w-[640px] lg:mx-auto">
          <p className="text-sm">
            This session has ended. Browse the attendee list until March 13, 2026.
          </p>
        </div>
      </div>

      {/* Attendee List */}
      <main className="lg:max-w-[640px] lg:mx-auto">
        <div className="flex flex-col gap-2 pt-2">
          {sorted.map((attendee) => (
            <AttendeeCard
              key={attendee.id}
              initials={attendee.initials}
              name={`${attendee.firstName} ${attendee.lastName}`}
              titleCompany={`${attendee.title} · ${attendee.company}`}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default PostEvent;
