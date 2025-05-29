import { useState, useEffect } from 'react';
import { FileUpload } from '../types/Story';
import { uploadFiles, cleanupFilePreviews, deleteFiles } from '../lib/files';

export function useFileUpload() {
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      cleanupFilePreviews(files);
    };
  }, [files]);

  const addFiles = (newFiles: File[]) => {
    const uploads = newFiles.map(file => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      progress: 0
    }));
    setFiles(prev => [...prev, ...uploads]);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const uploadToStory = async (storyId: string) => {
    try {
      setIsUploading(true);
      setError(null);
      const urls = await uploadFiles(files, storyId);
      setUploadedUrls(urls);
      return urls;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload files');
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const cleanup = async () => {
    try {
      if (uploadedUrls.length > 0) {
        await deleteFiles(uploadedUrls);
        setUploadedUrls([]);
      }
      cleanupFilePreviews(files);
      setFiles([]);
    } catch (err) {
      console.error('Failed to cleanup files:', err);
    }
  };

  return {
    files,
    isUploading,
    error,
    uploadedUrls,
    addFiles,
    removeFile,
    uploadToStory,
    cleanup
  };
}