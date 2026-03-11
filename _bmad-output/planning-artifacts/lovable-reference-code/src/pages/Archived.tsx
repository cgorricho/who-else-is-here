const Archived = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-card shadow-sm px-4 py-3">
        <div className="lg:max-w-[640px] lg:mx-auto">
          <div className="flex justify-between items-baseline">
            <h1 className="text-base font-semibold text-gray-900">Career Quest Workshop</h1>
            <span className="text-sm text-gray-600">Room 101</span>
          </div>
          <p className="text-sm text-gray-600 mt-0.5">RUMC Job Networking</p>
        </div>
      </header>

      {/* Centered Message */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="bg-gray-50 rounded-lg p-6 text-center max-w-md w-full">
          <p className="text-base text-gray-700">This session has ended and been archived.</p>
          <p className="text-sm text-gray-500 mt-2">The attendee list is no longer available.</p>
          <p className="text-sm text-gray-500 mt-6">
            Thanks for joining Career Quest Workshop at RUMC Job Networking.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Archived;
