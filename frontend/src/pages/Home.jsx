import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500/15 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary-400/10 rounded-full blur-[80px] animate-float" />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Hero badge */}
        <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8 animate-float">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
          </span>
          <span className="text-xs text-white/60 font-medium">AI-Powered Analysis</span>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
          <span className="text-white">Turn Sales Data Into</span>
          <br />
          <span className="glow-text">Executive Insights</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
          Upload your CSV or XLSX sales dataset and receive a 
          professionally crafted AI executive summary — delivered straight to your inbox.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link to="/upload" className="btn-primary text-lg">
            Upload Dataset →
          </Link>
          <a href="#how-it-works" className="btn-secondary text-lg">
            How It Works
          </a>
        </div>

        {/* How it works */}
        <div id="how-it-works" className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          {[
            { icon: '📊', title: 'Upload', desc: 'Drop your CSV or XLSX file' },
            { icon: '🔍', title: 'Analyze', desc: 'AI extracts key metrics' },
            { icon: '🤖', title: 'Summarize', desc: 'LLM crafts executive brief' },
            { icon: '📧', title: 'Deliver', desc: 'Summary sent to your email' },
          ].map((step, i) => (
            <div
              key={step.title}
              className="glass-card p-6 text-center group hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {step.icon}
              </div>
              <h3 className="text-white font-semibold mb-1">{step.title}</h3>
              <p className="text-white/40 text-sm">{step.desc}</p>
              {i < 3 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 text-white/20 text-lg">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
