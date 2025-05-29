import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause, Rewind, FastForward } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
  onTimeUpdate?: (time: number) => void;
  onEnded?: () => void;
}

const AudioPlayer = ({ src, onTimeUpdate, onEnded }: AudioPlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000;

  useEffect(() => {
    if (!src) {
      setError('No audio source provided');
      return;
    }

    let isDestroyed = false;

    const loadAudioWithRetry = async (wavesurfer: WaveSurfer, retryAttempt: number = 0): Promise<void> => {
      try {
        // First check if audio is accessible
        const response = await fetch(src);
        if (!response.ok) {
          throw new Error(`Failed to load audio file (HTTP ${response.status})`);
        }

        if (isDestroyed) return;

        // Then load into WaveSurfer
        await wavesurfer.load(src);
        
        if (!isDestroyed) {
          setError(null);
          setIsLoading(false);
          setRetryCount(0);
        }
      } catch (err) {
        console.error('Error loading audio:', err);
        
        if (isDestroyed) return;

        if (retryAttempt < MAX_RETRIES) {
          setRetryCount(retryAttempt + 1);
          setTimeout(() => {
            if (!isDestroyed) {
              loadAudioWithRetry(wavesurfer, retryAttempt + 1);
            }
          }, RETRY_DELAY * Math.pow(2, retryAttempt));
        } else {
          setError('Failed to load audio file. Please check your connection and try again.');
          setIsLoading(false);
        }
      }
    };

    const initializeWaveSurfer = async () => {
      if (!containerRef.current) return;

      try {
        setIsLoading(true);
        setError(null);

        if (wavesurferRef.current) {
          wavesurferRef.current.destroy();
          wavesurferRef.current = null;
        }

        const wavesurfer = WaveSurfer.create({
          container: containerRef.current,
          waveColor: '#E2E8F0',
          progressColor: '#00afaf',
          cursorColor: '#00afaf',
          barWidth: 2,
          barGap: 3,
          height: 48,
          normalize: true,
          backend: 'WebAudio',
          mediaControls: false,
          minPxPerSec: 50,
          fillParent: true,
          responsive: true,
          hideScrollbar: true,
          partialRender: true
        });

        if (isDestroyed) {
          wavesurfer.destroy();
          return;
        }

        wavesurferRef.current = wavesurfer;

        wavesurfer.on('ready', () => {
          if (!isDestroyed) {
            setDuration(wavesurfer.getDuration());
            setIsLoading(false);
            setError(null);
          }
        });

        wavesurfer.on('error', (err) => {
          console.error('WaveSurfer error:', err);
          if (!isDestroyed) {
            setError('Failed to load audio file. Please try again later.');
            setIsLoading(false);
          }
        });

        wavesurfer.on('audioprocess', (time) => {
          if (!isDestroyed) {
            setCurrentTime(time);
            onTimeUpdate?.(time);
          }
        });

        wavesurfer.on('finish', () => {
          if (!isDestroyed) {
            setIsPlaying(false);
            onEnded?.();
          }
        });

        await loadAudioWithRetry(wavesurfer);

      } catch (err) {
        console.error('Error initializing WaveSurfer:', err);
        if (!isDestroyed) {
          setError('Failed to initialize audio player. Please refresh the page.');
          setIsLoading(false);
        }
      }
    };

    initializeWaveSurfer();

    return () => {
      isDestroyed = true;
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }
    };
  }, [src, onTimeUpdate, onEnded]);

  const togglePlayback = () => {
    if (wavesurferRef.current) {
      if (isPlaying) {
        wavesurferRef.current.pause();
      } else {
        wavesurferRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const seek = (seconds: number) => {
    if (wavesurferRef.current) {
      const newTime = Math.max(0, Math.min(currentTime + seconds, duration));
      wavesurferRef.current.seekTo(newTime / duration);
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 rounded-lg p-4 flex items-center gap-2">
        <svg className="w-5 h-5\" viewBox="0 0 24 24\" fill="none\" stroke="currentColor\" strokeWidth="2">
          <circle cx="12\" cy="12\" r="10" />
          <line x1="12\" y1="8\" x2="12\" y2="12" />
          <line x1="12\" y1="16\" x2="12\" y2="16" />
        </svg>
        {error}
      </div>
    );
  }

  return (
    <div className="bg-neutral-100 rounded-lg p-4">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => seek(-10)}
          className="p-2 hover:bg-neutral-200 rounded-full transition-colors"
          disabled={isLoading || !wavesurferRef.current}
        >
          <Rewind size={24} className="text-neutral-600" />
        </button>

        <button
          onClick={togglePlayback}
          className="w-12 h-12 bg-primary-500 hover:bg-primary-600 rounded-full flex items-center justify-center text-white shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || !wavesurferRef.current}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
        </button>

        <button
          onClick={() => seek(10)}
          className="p-2 hover:bg-neutral-200 rounded-full transition-colors"
          disabled={isLoading || !wavesurferRef.current}
        >
          <FastForward size={24} className="text-neutral-600" />
        </button>

        <div className="text-sm text-neutral-600">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-4 gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent" />
          {retryCount > 0 && (
            <div className="text-sm text-neutral-600">
              Retrying... (Attempt {retryCount} of {MAX_RETRIES})
            </div>
          )}
        </div>
      )}

      <div ref={containerRef} className={isLoading ? 'opacity-0' : 'opacity-100'} />
    </div>
  );
};

export default AudioPlayer;