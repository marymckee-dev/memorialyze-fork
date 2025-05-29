import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, X, Loader2 } from 'lucide-react';
import Button from '../ui/Button';
import { useProfile } from '../../hooks/useProfile';

interface ProfileEditorProps {
  onClose: () => void;
  onSave: () => void;
}

export default function ProfileEditor({ onClose, onSave }: ProfileEditorProps) {
  const { getProfile, updateProfile, uploadAvatar, loading, error } = useProfile();
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    noClick: true,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setPreview(URL.createObjectURL(file));
        const url = await uploadAvatar(file);
        if (url) setAvatarUrl(url);
      }
    }
  });

  useEffect(() => {
    const loadProfile = async () => {
      const profile = await getProfile();
      if (profile) {
        setDisplayName(profile.display_name || '');
        setAvatarUrl(profile.avatar_url);
      }
    };
    loadProfile();
  }, []);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleSave = async () => {
    const updates = {
      display_name: displayName,
      ...(avatarUrl && { avatar_url: avatarUrl })
    };

    const result = await updateProfile(updates);
    if (result) {
      onSave();
      onClose();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Edit Profile</h2>
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-neutral-600"
        >
          <X size={24} />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-error-50 text-error-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Profile Photo
          </label>
          <div {...getRootProps()} className="flex items-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-neutral-100">
                {(preview || avatarUrl) ? (
                  <img
                    src={preview || avatarUrl || ''}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400">
                    <Camera size={32} />
                  </div>
                )}
              </div>
              <input {...getInputProps()} />
            </div>
            <Button variant="ghost" onClick={open}>
              Change Photo
            </Button>
          </div>
        </div>

        <div>
          <label
            htmlFor="displayName"
            className="block text-sm font-medium text-neutral-700 mb-2"
          >
            Display Name
          </label>
          <input
            type="text"
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full p-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter your display name"
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}