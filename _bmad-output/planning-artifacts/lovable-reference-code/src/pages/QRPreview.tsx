const QRPreview = () => {
  return (
    <div className="min-h-screen bg-card flex items-start justify-center">
      <div className="w-full max-w-[480px] p-8 text-center">
        {/* Headline */}
        <h1 className="text-[32px] font-bold text-gray-900">Who Else Is Here?</h1>

        {/* QR Code */}
        <div className="mt-6 flex flex-col items-center">
          <div className="w-[240px] h-[240px] border-2 border-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-xl text-gray-400">QR CODE</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">whoelseishere.com/event/rumc/session/career-quest</p>
        </div>

        {/* Session Context */}
        <div className="mt-6">
          <p className="text-xl font-semibold text-gray-900">Career Quest Workshop</p>
          <p className="text-base text-gray-600 mt-1">Room 101</p>
        </div>

        {/* CTA */}
        <p className="text-sm text-gray-600 mt-4">Scan to see everyone at this session</p>

        {/* Event Branding */}
        <div className="mt-8">
          <div className="w-16 border-t border-gray-200 mx-auto" />
          <p className="text-xs text-gray-400 mt-4">RUMC Job Networking</p>
          <p className="text-xs text-gray-400">March 8, 2026</p>
        </div>
      </div>
    </div>
  );
};

export default QRPreview;
