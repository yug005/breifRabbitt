import { useCallback, useState } from 'react';
import { validateFile } from '../utils/validators';

export default function FileUpload({ file, onFileSelect }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = useCallback((selectedFile) => {
    setError(null);
    const validation = validateFile(selectedFile);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }
    onFileSelect(selectedFile);
  }, [onFileSelect]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  }, [handleFile]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer
          transition-all duration-300 group
          ${dragActive 
            ? 'border-primary-400 bg-primary-500/10 scale-[1.02]' 
            : 'border-white/20 hover:border-primary-500/50 hover:bg-white/5'}
          ${file ? 'border-green-400/50 bg-green-500/5' : ''}
        `}
        onClick={() => document.getElementById('file-input').click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".csv,.xlsx"
          className="hidden"
          onChange={(e) => {
            const selectedFile = e.target.files[0];
            if (selectedFile) handleFile(selectedFile);
          }}
        />

        {file ? (
          <div className="space-y-2">
            <div className="text-4xl mb-2">📄</div>
            <p className="text-white font-semibold">{file.name}</p>
            <p className="text-white/40 text-sm">
              {(file.size / 1024).toFixed(1)} KB • Click to change
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-5xl mb-2 group-hover:scale-110 transition-transform duration-300">
              📊
            </div>
            <p className="text-white font-medium text-lg">
              Drop your sales dataset here
            </p>
            <p className="text-white/40 text-sm">
              or click to browse • CSV, XLSX up to 10MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-3 text-red-400 text-sm flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}
    </div>
  );
}
