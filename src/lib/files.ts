import { FileUpload } from '../types/Story';
import { uploadStoryFile, deleteStoryFile } from './supabase';

export async function uploadFiles(files: FileUpload[], storyId: string): Promise<string[]> {
  const uploadPromises = files.map(async ({ file }) => {
    return await uploadStoryFile(file, storyId);
  });

  return await Promise.all(uploadPromises);
}

export function cleanupFilePreviews(files: FileUpload[]): void {
  files.forEach(file => {
    if (file.preview) {
      URL.revokeObjectURL(file.preview);
    }
  });
}

export async function deleteFiles(filePaths: string[]): Promise<void> {
  const deletePromises = filePaths.map(path => deleteStoryFile(path));
  await Promise.all(deletePromises);
}