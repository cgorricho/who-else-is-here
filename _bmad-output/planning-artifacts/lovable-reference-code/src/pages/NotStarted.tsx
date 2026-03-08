const NotStarted = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-card shadow-sm px-4 py-3">
        <div className="lg:max-w-[640px] lg:mx-auto">
          <div className="flex justify-between items-baseline">
            <h1 className="text-base font-semibold text-gray-900">Resume Review</h1>
            <span className="text-sm text-gray-600">Room 103</span>
          </div>
          <p className="text-sm text-gray-600 mt-0.5">RUMC Job Networking</p>
        </div>
      </header>

      {/* Centered Message */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="bg-gray-50 rounded-lg p-6 text-center max-w-md w-full">
          <p className="text-base text-gray-700">This session hasn't started yet.</p>
          <p className="text-base font-semibold text-gray-900 mt-2">Come back at 7:00 PM.</p>
          <p className="text-sm text-gray-500 mt-4">
            We'll show you who else is here when it begins.
          </p>
        </div>
      </main>
    </div>
  );
};

export default NotStarted;
