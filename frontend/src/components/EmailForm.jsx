import { useState } from 'react';
import { validateEmail } from '../utils/validators';

export default function EmailForm({ email, onEmailChange }) {
  const [error, setError] = useState(null);

  const handleBlur = () => {
    if (email) {
      const validation = validateEmail(email);
      setError(validation.valid ? null : validation.error);
    }
  };

  return (
    <div className="w-full">
      <label htmlFor="email-input" className="block text-sm font-medium text-white/60 mb-2">
        Recipient Email
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">📧</span>
        <input
          id="email-input"
          type="email"
          placeholder="executive@company.com"
          value={email}
          onChange={(e) => {
            onEmailChange(e.target.value);
            if (error) setError(null);
          }}
          onBlur={handleBlur}
          className="input-field w-full pl-10"
        />
      </div>
      {error && (
        <p className="mt-2 text-red-400 text-sm flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}
    </div>
  );
}
