export default function SummaryPreview({ summary }) {
  if (!summary) return null;

  return (
    <div className="glass-card p-6 space-y-4">
      <h3 className="text-lg font-semibold glow-text">Summary Preview</h3>
      <div className="prose prose-invert prose-sm max-w-none text-white/80 leading-relaxed">
        <pre className="whitespace-pre-wrap font-sans text-sm">{summary}</pre>
      </div>
    </div>
  );
}
