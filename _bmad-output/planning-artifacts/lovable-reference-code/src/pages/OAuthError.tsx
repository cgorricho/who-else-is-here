const OAuthError = () => {
  return (
    <div className="min-h-screen bg-card flex items-center justify-center px-6">
      <div className="w-full max-w-[400px] text-center">
        {/* App name */}
        <h1 className="text-2xl font-bold text-gray-900">Who Else Is Here?</h1>

        {/* Session context */}
        <div className="mt-2">
          <p className="text-base font-semibold text-gray-900">Career Quest Workshop</p>
          <p className="text-sm text-gray-600">RUMC Job Networking</p>
        </div>

        {/* Error message */}
        <div className="mt-6">
          <p className="text-base text-gray-700">
            Something went wrong connecting to LinkedIn.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This happens sometimes. Give it another try.
          </p>
        </div>

        {/* Retry button */}
        <button className="mt-6 w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold text-base py-3 px-6 rounded-lg min-h-[48px] transition-colors duration-150 ease-in-out">
          Try Again
        </button>

        {/* Reassurance */}
        <p className="mt-4 text-xs text-gray-400">
          No worries — your data wasn't shared.
        </p>
      </div>
    </div>
  );
};

export default OAuthError;
