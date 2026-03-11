export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🐇</span>
          <span className="text-sm text-white/40">
            BriefRabbit © {new Date().getFullYear()}
          </span>
        </div>
        <p className="text-xs text-white/30">
          AI-powered sales analysis. Upload. Analyze. Summarize. Deliver.
        </p>
      </div>
    </footer>
  );
}
