import { sessionInfo } from "@/data/attendees";

const LoadingDot = ({ delay, className }: { delay: string; className: string }) => (
  <span
    className={`inline-block w-2 h-2 rounded-full ${className}`}
    style={{
      animation: "dot-pulse 1.4s ease-in-out infinite",
      animationDelay: delay,
    }}
  />
);

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col bg-card px-6">
      <div className="text-center">
        {/* App name */}
        <h1 className="text-2xl font-bold text-gray-900">Who Else Is Here?</h1>

        {/* Session context */}
        <div className="mt-4">
          <p className="text-base font-semibold text-gray-900">{sessionInfo.sessionName}</p>
          <p className="text-sm text-gray-600">at {sessionInfo.eventName}</p>
        </div>

        {/* Loading message */}
        <p className="mt-6 text-sm text-gray-400">Connecting your profile...</p>

        {/* Dots */}
        <div className="mt-3 flex items-center justify-center gap-1.5">
          <LoadingDot delay="0s" className="bg-primary-600" />
          <LoadingDot delay="0.2s" className="bg-primary" />
          <LoadingDot delay="0.4s" className="bg-primary-100" />
        </div>
      </div>

      <style>{`
        @keyframes dot-pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Loading;
