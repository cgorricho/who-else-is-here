import { ChevronRight } from "lucide-react";

const sessions = [
  { id: "1", name: "Career Quest Workshop", room: "Room 101", time: "1:00 PM – 3:00 PM", count: 38, live: true },
  { id: "2", name: "Recruiters Panel", room: "Room 102", time: "1:00 PM – 3:00 PM", count: 24, live: true },
  { id: "3", name: "Resume Review", room: "Room 103", time: "1:00 PM – 3:00 PM", count: 31, live: true },
  { id: "4", name: "LinkedIn Optimization", room: "Room 104", time: "1:30 PM – 3:00 PM", count: 19, live: true },
  { id: "5", name: "Interview Prep", room: "Room 105", time: "2:00 PM – 3:30 PM", count: 12, live: true },
];

const Lobby = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="sticky top-0 z-10 bg-card shadow-sm px-4 py-3">
        <div className="lg:max-w-[640px] lg:mx-auto">
          <h1 className="text-base font-semibold text-gray-900">RUMC Job Networking</h1>
          <p className="text-sm text-gray-600">Choose a session to join</p>
        </div>
      </header>

      <main className="lg:max-w-[640px] lg:mx-auto">
        <div className="flex flex-col gap-2 pt-2">
          {sessions.map((s) => (
            <a
              key={s.id}
              href="#"
              className="flex items-center bg-card px-4 py-4 min-h-[80px] transition-colors hover:bg-gray-50 active:bg-gray-100"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {s.live && (
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-success-500" />
                  )}
                  <p className="text-base font-semibold text-gray-900 truncate">{s.name}</p>
                </div>
                <p className="text-sm text-gray-600 mt-1">{s.room} · {s.time}</p>
                <p className="text-sm text-gray-400 mt-1">{s.count} professionals here</p>
              </div>
              <ChevronRight className="flex-shrink-0 w-4 h-4 text-gray-400" />
            </a>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Lobby;
