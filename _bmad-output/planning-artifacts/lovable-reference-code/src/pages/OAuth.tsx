import { Linkedin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { sessionInfo } from "@/data/attendees";

const OAuth = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-card px-6">
      <div className="w-full max-w-[400px] text-center">
        {/* App name */}
        <h1 className="text-2xl font-bold text-gray-900">Who Else Is Here?</h1>

        {/* Session context */}
        <div className="mt-2">
          <p className="text-base font-semibold text-gray-900">{sessionInfo.sessionName}</p>
          <p className="text-sm text-gray-600">{sessionInfo.eventName}</p>
        </div>

        {/* Value proposition */}
        <div className="mt-6">
          <p className="text-base text-gray-700">
            Sign in with LinkedIn so others can find you too
          </p>
          <p className="mt-2 text-sm text-gray-400">
            We only access your name, photo, title, and company. Nothing else.
          </p>
        </div>

        {/* LinkedIn button */}
        <button
          onClick={() => navigate("/loading")}
          className="mt-8 w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-primary-foreground font-semibold text-base py-3 px-6 rounded-lg min-h-[48px] transition-colors duration-150 ease-in-out"
        >
          <Linkedin className="w-5 h-5" />
          Continue with LinkedIn
        </button>

        {/* Trust footer */}
        <p className="mt-6 text-xs text-gray-400">
          No messages. No connections. Just your professional profile.
        </p>
      </div>
    </div>
  );
};

export default OAuth;
