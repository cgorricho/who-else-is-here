import { Search, ChevronRight } from "lucide-react";
import { attendees as allAttendees, sessionInfo, type Attendee } from "@/data/attendees";

const coldStartAttendees: Attendee[] = [
  { ...allAttendees.find(a => a.initials === "CM")!, joinedMinAgo: 3 },
  { ...allAttendees.find(a => a.initials === "DK")!, joinedMinAgo: 2 },
  { ...allAttendees.find(a => a.initials === "JW")!, joinedMinAgo: 1 },
  { ...allAttendees.find(a => a.initials === "SC")!, joinedMinAgo: 0 },
];

const isColdStart = true; // Toggle for mockup purposes
const displayAttendees = isColdStart ? coldStartAttendees : allAttendees;
const attendeeCount = isColdStart ? 4 : sessionInfo.attendeeCount;

const AttendeeCard = ({
  initials,
  name,
  titleCompany,
  joinedMinAgo,
}: {
  initials: string;
  name: string;
  titleCompany: string;
  joinedMinAgo?: number;
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
      {joinedMinAgo !== undefined && (
        <p className="text-xs text-gray-400">
          {joinedMinAgo === 0 ? "joined just now" : `joined ${joinedMinAgo} min ago`}
        </p>
      )}
    </div>
    <ChevronRight className="flex-shrink-0 w-4 h-4 text-gray-400" />
  </a>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
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
              <span className="hidden lg:inline">
                {sessionInfo.eventName} ·{" "}
              </span>
              {attendeeCount} professionals here
            </p>
            {!isColdStart && (
              <button
                className="p-2 -mr-2 transition-colors duration-150 ease-in-out"
                aria-label="Search attendees"
              >
                <Search className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Attendee List */}
      <main className="lg:max-w-[640px] lg:mx-auto">
        <div className="flex flex-col gap-2 pt-2">
          {displayAttendees.map((attendee) => (
            <AttendeeCard
              key={attendee.id}
              initials={attendee.initials}
              name={`${attendee.firstName} ${attendee.lastName}`}
              titleCompany={`${attendee.title} · ${attendee.company}`}
              joinedMinAgo={attendee.joinedMinAgo}
            />
          ))}
        </div>

        {/* Cold-start banner */}
        {isColdStart && (
          <div className="mx-4 mt-4 mb-6 p-4 bg-primary-50 rounded-lg">
            <p className="text-sm text-primary-700">
              You're among the first! The list is growing live. New connections
              appear automatically.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
