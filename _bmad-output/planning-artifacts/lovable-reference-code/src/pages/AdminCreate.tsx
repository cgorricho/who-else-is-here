import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface Session {
  id: string;
  name: string;
  room: string;
  date: string;
  startTime: string;
  endTime: string;
}

const defaultSessions: Session[] = [
  { id: "1", name: "Career Quest Workshop", room: "Room 101", date: "2026-03-08", startTime: "13:00", endTime: "15:00" },
  { id: "2", name: "", room: "", date: "", startTime: "", endTime: "" },
];

const labelClass = "block text-xs font-medium text-gray-700 mb-1";
const inputClass = "w-full border border-gray-200 rounded-md px-3 py-2 text-base focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors";

const AdminCreate = () => {
  const [eventName, setEventName] = useState("RUMC Job Networking");
  const [venue, setVenue] = useState("Roswell United Methodist Church");
  const [slug, setSlug] = useState("rumc-job-networking");
  const [sessions, setSessions] = useState<Session[]>(defaultSessions);

  const addSession = () => {
    setSessions((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: "", room: "", date: "", startTime: "", endTime: "" },
    ]);
  };

  const updateSession = (id: string, field: keyof Session, value: string) => {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const removeSession = (id: string) => {
    if (sessions.length <= 1) return;
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-card">
      <div className="max-w-[640px] mx-auto px-8 py-6">
        {/* Header */}
        <p className="text-sm font-medium text-gray-400">Who Else Is Here · Admin</p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">Create New Event</h1>
        <a href="/admin" className="text-sm text-primary-600 hover:underline mt-1 inline-block">
          ← Back to events
        </a>

        {/* Event Details */}
        <section className="mt-8">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Event Details</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Event Name</label>
              <input className={inputClass} value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="e.g., RUMC Job Networking" />
            </div>
            <div>
              <label className={labelClass}>Venue</label>
              <input className={inputClass} value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="e.g., Roswell United Methodist Church" />
            </div>
            <div>
              <label className={labelClass}>Event URL Slug</label>
              <input className={`${inputClass} bg-gray-50`} value={slug} onChange={(e) => setSlug(e.target.value)} />
              <p className="text-xs text-gray-400 mt-1">URL: whoelseishere.com/event/{slug}</p>
            </div>
          </div>
        </section>

        {/* Sessions */}
        <section className="mt-8">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Sessions</h2>
          <p className="text-sm text-gray-500 mb-4">Add one or more sessions. Each session gets its own QR code.</p>

          <div className="flex flex-col gap-4">
            {sessions.map((session, i) => (
              <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-medium text-gray-400">Session {i + 1}</span>
                  {sessions.length > 1 && (
                    <button onClick={() => removeSession(session.id)} className="p-1 text-gray-400 hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className={labelClass}>Session Name</label>
                    <input className={inputClass} value={session.name} onChange={(e) => updateSession(session.id, "name", e.target.value)} placeholder="e.g., Career Quest Workshop" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Room</label>
                      <input className={inputClass} value={session.room} onChange={(e) => updateSession(session.id, "room", e.target.value)} placeholder="e.g., Room 101" />
                    </div>
                    <div>
                      <label className={labelClass}>Date</label>
                      <input type="date" className={inputClass} value={session.date} onChange={(e) => updateSession(session.id, "date", e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Start Time</label>
                      <input type="time" className={inputClass} value={session.startTime} onChange={(e) => updateSession(session.id, "startTime", e.target.value)} />
                    </div>
                    <div>
                      <label className={labelClass}>End Time</label>
                      <input type="time" className={inputClass} value={session.endTime} onChange={(e) => updateSession(session.id, "endTime", e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={addSession} className="mt-2 text-sm font-medium text-primary-600 hover:underline flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add Another Session
          </button>
        </section>

        {/* Submit */}
        <div className="mt-8 flex flex-col gap-2">
          <button className="w-full bg-primary-600 hover:bg-primary-700 text-primary-foreground font-semibold py-3 rounded-lg transition-colors">
            Create Event & Generate QR Codes
          </button>
          <button className="w-full bg-card border border-gray-200 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCreate;
