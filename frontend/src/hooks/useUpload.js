import { useState, useCallback } from 'react';
import { uploadFile } from '../api/client';
import { validateFile, validateEmail } from '../utils/validators';

/**
 * Custom hook for managing the upload flow.
 */
export function useUpload() {
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = useCallback(async () => {
    setError(null);

    // Validate file
    const fileValidation = validateFile(file);
    if (!fileValidation.valid) {
      setError(fileValidation.error);
      return null;
    }

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setError(emailValidation.error);
      return null;
    }

    setLoading(true);
    try {
      const data = await uploadFile(file, email);
      setResult(data);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.detail || 'Upload failed. Please try again.';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [file, email]);

  const reset = useCallback(() => {
    setFile(null);
    setEmail('');
    setError(null);
    setResult(null);
    setLoading(false);
  }, []);

  return {
    file,
    setFile,
    email,
    setEmail,
    loading,
    error,
    result,
    handleUpload,
    reset,
  };
}
