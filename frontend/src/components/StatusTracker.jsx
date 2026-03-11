const STEPS = [
  { key: 'parsing', label: 'Parsing file', icon: '📄' },
  { key: 'analyzing', label: 'Analyzing data', icon: '🔍' },
  { key: 'summarizing', label: 'Generating summary', icon: '🤖' },
  { key: 'emailing', label: 'Sending email', icon: '📧' },
  { key: 'email_sent', label: 'Delivered!', icon: '✅' },
];

export default function StatusTracker({ status, currentStep, progress }) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="w-full space-y-6">
      {/* Progress bar */}
      <div className="relative">
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-right text-xs text-white/40 mt-1">{progress}%</p>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {STEPS.map((step, index) => {
          const isActive = step.key === currentStep;
          const isDone = index < currentIndex || status === 'completed';
          const isPending = index > currentIndex && status !== 'completed';

          return (
            <div
              key={step.key}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                ${isActive ? 'glass-card bg-primary-500/10 border-primary-500/30' : ''}
                ${isDone ? 'opacity-60' : ''}
                ${isPending ? 'opacity-30' : ''}
              `}
            >
              <span className={`text-xl ${isActive ? 'animate-pulse' : ''}`}>
                {isDone ? '✅' : step.icon}
              </span>
              <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-white/60'}`}>
                {step.label}
              </span>
              {isActive && status === 'processing' && (
                <div className="ml-auto flex gap-1">
                  <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Status message */}
      {status === 'failed' && (
        <div className="glass-card border-red-500/30 bg-red-500/10 p-4 rounded-xl">
          <p className="text-red-400 text-sm">
            ⚠️ Processing failed. Please try uploading again.
          </p>
        </div>
      )}

      {status === 'completed' && (
        <div className="glass-card border-green-500/30 bg-green-500/10 p-4 rounded-xl">
          <p className="text-green-400 text-sm">
            ✅ Executive summary has been sent to your email!
          </p>
        </div>
      )}
    </div>
  );
}
