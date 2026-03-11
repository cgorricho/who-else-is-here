import { ArrowLeft, Download, QrCode } from "lucide-react";
import { Link } from "react-router-dom";
import { sessionInfo } from "@/data/attendees";

const timeSlots = [
  { label: "1:00", height: 20 },
  { label: "1:15", height: 45 },
  { label: "1:30", height: 70 },
  { label: "1:45", height: 55 },
  { label: "2:00", height: 85 },
  { label: "2:15", height: 100 },
  { label: "2:30", height: 60 },
  { label: "2:45", height: 30 },
];

const MetricCard = ({ value, label, highlight = false }: { value: string; label: string; highlight?: boolean }) => (
  <div className="bg-card rounded-lg shadow-md p-6 text-center flex-1">
    <p className={`text-4xl font-extrabold ${highlight ? "text-primary-600" : "text-gray-900"}`}>{value}</p>
    <p className="text-sm text-gray-600 mt-1">{label}</p>
  </div>
);

const Admin = () => {
  const peakIndex = timeSlots.findIndex(s => s.height === 100);

  return (
    <div className="min-h-screen bg-card">
      <div className="max-w-[1024px] mx-auto px-4 md:px-8 py-6">
        {/* Header */}
        <div>
          <p className="text-sm font-medium text-gray-400">Who Else Is Here · Admin</p>
          <h1 className="text-xl font-semibold text-gray-900 mt-1">{sessionInfo.eventName}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-base font-semibold text-gray-900">
              {sessionInfo.sessionName} · {sessionInfo.room}
            </span>
            <span className="inline-flex items-center bg-success-50 text-success-500 text-xs font-medium px-2 py-0.5 rounded-md">
              Live
            </span>
          </div>
          <Link
            to="/admin/sessions"
            className="inline-flex items-center gap-1 text-sm text-primary-600 hover:underline mt-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to sessions
          </Link>
        </div>

        {/* Metrics */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-6">
          <MetricCard value="38" label="Attendees" />
          <MetricCard value="127" label="LinkedIn Taps" />
          <MetricCard value="69%" label="Activation Rate" highlight />
        </div>

        {/* Timeline */}
        <div className="bg-card rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Activity Timeline</h2>
          <div className="flex items-end gap-2 md:gap-3 h-40">
            {timeSlots.map((slot, i) => (
              <div key={slot.label} className="flex-1 flex flex-col items-center gap-1">
                {i === peakIndex && (
                  <span className="text-xs text-gray-400 whitespace-nowrap">peak: 2:15 PM</span>
                )}
                <div
                  className="w-full bg-primary-600 rounded-sm transition-all duration-150"
                  style={{ height: `${slot.height}%` }}
                />
                <span className="text-xs text-gray-400">{slot.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-3 mt-6">
          <button className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-primary-foreground font-semibold py-2.5 px-4 rounded-lg transition-colors duration-150">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button className="inline-flex items-center justify-center gap-2 bg-card border border-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-150">
            <QrCode className="w-4 h-4" />
            Download QR Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
