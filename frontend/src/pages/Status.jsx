import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJobStatus } from '../api/client';
import StatusTracker from '../components/StatusTracker';
import ReactMarkdown from 'react-markdown';
import { POLL_INTERVAL_MS } from '../utils/constants';

export default function Status() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!jobId) return;

    const fetchStatus = async () => {
      try {
        const data = await getJobStatus(jobId);
        setJob(data);

        // Stop polling if done
        if (data.status === 'completed' || data.status === 'failed' || data.currentStep === 'email_sent') {
          return false; // Signal to stop
        }
        return true; // Continue polling
      } catch (err) {
        setError(err.response?.data?.message || err.response?.data?.detail || 'Failed to fetch status.');
        return false;
      }
    };

    // Initial fetch
    fetchStatus();

    // Polling
    const interval = setInterval(async () => {
      const shouldContinue = await fetchStatus();
      if (!shouldContinue) clearInterval(interval);
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [jobId]);

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-16 px-6">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 w-72 h-72 bg-primary-600/15 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-3">
            Processing Your <span className="glow-text">Data</span>
          </h1>
          <p className="text-white/50 text-sm">
            Job ID: <code className="text-white/30 bg-white/5 px-2 py-0.5 rounded">{jobId}</code>
          </p>
        </div>

        <div className="glass-card p-8">
          {error ? (
            <div className="text-center space-y-4">
              <p className="text-red-400">⚠️ {error}</p>
              <Link to="/upload" className="btn-primary inline-block">
                Try Again
              </Link>
            </div>
          ) : job ? (
            <StatusTracker
              status={job.status}
              currentStep={job.currentStep}
              progress={job.progressPercent}
            />
          ) : (
            <div className="flex items-center justify-center py-8">
              <svg className="animate-spin h-8 w-8 text-primary-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          )}

          {(job?.status === 'completed' || job?.currentStep === 'email_sent') && (
            <div className="mt-6 text-center">
              <Link to="/upload" className="btn-secondary inline-block">
                Upload Another File
              </Link>
            </div>
          )}
        </div>

        {/* --- Render Summary on the Web --- */}
        {job?.summary && (
          <div className="glass-card mt-8 p-8 max-h-[60vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Executive Summary Panel</h2>
            <div className="prose prose-invert prose-primary max-w-none prose-h3:text-primary-400 prose-a:text-accent-400 prose-strong:text-white prose-ol:text-white/80 prose-ul:text-white/80">
              <ReactMarkdown>{job.summary}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
