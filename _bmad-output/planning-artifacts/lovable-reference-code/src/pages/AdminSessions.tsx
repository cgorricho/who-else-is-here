import { Link } from "react-router-dom";
import { sessionInfo } from "@/data/attendees";

interface SessionData {
  name: string;
  room: string;
  status: "live" | "upcoming";
  attendees: number;
  taps: number;
  activation: string;
}

const sessions: SessionData[] = [
  { name: "Career Quest Workshop", room: "Room 101", status: "live", attendees: 38, taps: 127, activation: "69%" },
  { name: "Recruiters Panel", room: "Room 102", status: "live", attendees: 24, taps: 89, activation: "71%" },
  { name: "Resume Review", room: "Room 103", status: "live", attendees: 31, taps: 104, activation: "65%" },
  { name: "LinkedIn Optimization", room: "Room 104", status: "live", attendees: 19, taps: 52, activation: "58%" },
  { name: "Interview Prep", room: "Room 105", status: "upcoming", attendees: 0, taps: 0, activation: "—" },
];

const StatusBadge = ({ status }: { status: "live" | "upcoming" }) => (
  <span
    className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-md whitespace-nowrap ${
      status === "live"
        ? "bg-success-50 text-success-500"
        : "bg-warning-50 text-warning-500"
    }`}
  >
    {status === "live" ? "Live" : "Upcoming"}
  </span>
);

const SessionCard = ({ session }: { session: SessionData }) => (
  <div className="bg-card border border-gray-200 rounded-lg p-4 hover:border-primary-100 transition-colors duration-150">
    <div className="flex justify-between items-start">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-base font-semibold text-gray-900">
            {session.name} · {session.room}
          </h3>
          <span className="md:hidden"><StatusBadge status={session.status} /></span>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {session.attendees} attendees · {session.taps} taps · {session.activation} activation
        </p>
        <div className="flex items-center gap-4 mt-2 flex-wrap">
          <Link to="/admin" className="text-sm text-primary-600 hover:underline">View</Link>
          <button className="text-sm text-primary-600 hover:underline">QR Code</button>
          <button className="text-sm text-primary-600 hover:underline">Export Report</button>
        </div>
      </div>
      <div className="hidden md:block ml-4 flex-shrink-0">
        <StatusBadge status={session.status} />
      </div>
    </div>
  </div>
);

const AdminSessions = () => {
  const liveCount = sessions.filter(s => s.status === "live").length;

  return (
    <div className="min-h-screen bg-card">
      <div className="max-w-[1024px] mx-auto px-4 md:px-8 py-6">
        {/* Header */}
        <p className="text-sm font-medium text-gray-400">Who Else Is Here · Admin</p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">{sessionInfo.eventName}</h1>
        <p className="text-base text-gray-600 mt-1">Sessions ({liveCount} active)</p>

        {/* Session Cards */}
        <div className="space-y-3 mt-6">
          {sessions.map((session) => (
            <SessionCard key={session.room} session={session} />
          ))}
        </div>

        {/* Cross-session summary */}
        <p className="text-sm text-gray-600 mt-4">
          Cross-session: 42 attendees scanned 2+ sessions
        </p>

        {/* Create button */}
        <button className="mt-6 bg-primary-600 hover:bg-primary-700 text-primary-foreground font-semibold py-2.5 px-4 rounded-lg transition-colors duration-150">
          Create Session
        </button>
      </div>
    </div>
  );
};

export default AdminSessions;
