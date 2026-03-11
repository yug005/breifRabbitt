import { useNavigate } from 'react-router-dom';
import { useUpload } from '../hooks/useUpload';
import FileUpload from '../components/FileUpload';
import EmailForm from '../components/EmailForm';

export default function Upload() {
  const navigate = useNavigate();
  const { file, setFile, email, setEmail, loading, error, handleUpload } = useUpload();

  const onSubmit = async (e) => {
    e.preventDefault();
    const result = await handleUpload();
    if (result?.jobId || result?.job_id) {
      navigate(`/status/${result.jobId || result.job_id}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-16 px-6">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-primary-600/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-accent-500/10 rounded-full blur-[80px]" />
      </div>

      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Upload Your <span className="glow-text">Sales Data</span>
          </h1>
          <p className="text-white/50">
            We'll analyze it and send an executive summary to your email.
          </p>
        </div>

        <form onSubmit={onSubmit} className="glass-card p-8 space-y-6">
          <FileUpload file={file} onFileSelect={setFile} />
          <EmailForm email={email} onEmailChange={setEmail} />

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <p className="text-red-400 text-sm">⚠️ {error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !file || !email}
            className={`btn-primary w-full text-center ${
              loading || !file || !email ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Uploading...
              </span>
            ) : (
              'Generate Summary →'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
