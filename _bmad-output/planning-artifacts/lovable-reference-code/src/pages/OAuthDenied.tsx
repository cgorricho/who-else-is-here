const OAuthDenied = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-card px-6">
      <div className="w-full max-w-[400px] text-center">
        {/* App Name */}
        <h1 className="text-2xl font-bold text-gray-900">Who Else Is Here?</h1>

        {/* Session Context */}
        <div className="mt-2">
          <p className="text-base font-semibold text-gray-900">Career Quest Workshop</p>
          <p className="text-sm text-gray-600">RUMC Job Networking</p>
        </div>

        {/* Message */}
        <div className="mt-6">
          <p className="text-xl font-semibold text-gray-900">No problem!</p>
          <p className="text-sm text-gray-500 mt-2">
            You can scan the QR code again anytime you change your mind.
          </p>
        </div>

        {/* Button */}
        <button className="mt-6 w-full bg-primary-600 hover:bg-primary-700 text-primary-foreground font-semibold text-base py-3 px-6 rounded-lg min-h-[48px] transition-colors">
          Scan Again
        </button>

        {/* Reassurance */}
        <p className="mt-4 text-xs text-gray-400">Nothing was shared with us.</p>
      </div>
    </div>
  );
};

export default OAuthDenied;
