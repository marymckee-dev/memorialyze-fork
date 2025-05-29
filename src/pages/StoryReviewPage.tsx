import { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Pause, Rewind, FastForward, Save, ArrowLeft, Tag, User, Heart, Upload, X, Check, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { sampleStories } from '../data/sampleData';
import { useAI } from '../hooks/useAI';
import { useDropzone } from 'react-dropzone';
import AIFeedback from '../components/ai/AIFeedback';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
}

const StoryReviewPage = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const transcriptTimeoutRef = useRef<NodeJS.Timeout>();
  const { analyze } = useAI();
  
  const story = sampleStories.find(s => s.id === storyId);
  
  const emotions = [
    'Joy', 'Nostalgia', 'Love', 'Pride', 'Gratitude',
    'Reflection', 'Hope', 'Sadness', 'Excitement'
  ];
  
  const people = [
    'Mom', 'Dad', 'Grandma', 'Grandpa', 'Sister',
    'Brother', 'Aunt', 'Uncle', 'Cousin'
  ];

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf']
    },
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map(file => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file)
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  });
  
  useEffect(() => {
    if (story) {
      setTranscript(story.excerpt);
      setDuration(parseFloat(story.duration.split(':').reduce((acc, time) => (60 * acc) + +time, 0).toString()));
    }
  }, [story]);

  // Cleanup previews when component unmounts
  useEffect(() => {
    return () => {
      uploadedFiles.forEach(file => {
        URL.revokeObjectURL(file.preview);
      });
    };
  }, []);

  // Auto-save transcript changes
  useEffect(() => {
    if (transcriptTimeoutRef.current) {
      clearTimeout(transcriptTimeoutRef.current);
    }

    transcriptTimeoutRef.current = setTimeout(async () => {
      if (transcript.trim()) {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          setLastSaved(new Date());
          
          // Analyze updated content
          setIsAnalyzing(true);
          const result = await analyze(transcript);
          if (result) {
            setAnalysis(result);
            setSelectedEmotions(result.emotions);
            setSelectedPeople(result.peopleMentioned);
          }
        } catch (error) {
          console.error('Error auto-saving:', error);
        } finally {
          setIsAnalyzing(false);
        }
      }
    }, 1000);

    return () => {
      if (transcriptTimeoutRef.current) {
        clearTimeout(transcriptTimeoutRef.current);
      }
    };
  }, [transcript, analyze]);
  
  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };
      
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, []);
  
  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const seek = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.currentTime + seconds, duration));
    }
  };
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    
    try {
      // Validate required fields
      if (!transcript.trim()) {
        throw new Error('Transcript is required');
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('transcript', transcript);
      uploadedFiles.forEach(({ file }) => {
        formData.append('files', file);
      });
      selectedEmotions.forEach(emotion => {
        formData.append('emotions[]', emotion);
      });
      selectedPeople.forEach(person => {
        formData.append('people[]', person);
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Navigate back to story detail
      navigate(`/stories/${storyId}`);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (!story) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-serif font-bold mb-4">Story Not Found</h1>
          <p className="mb-6">The story you're looking for doesn't exist or has been removed.</p>
          <Button as={Link} to="/stories" variant="primary">
            <ArrowLeft size={18} />
            Back to Stories
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <Button as={Link} to={`/stories/${storyId}`} variant="ghost" className="text-neutral-600">
            <ArrowLeft size={18} />
            Back to Story
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </Button>
        </div>

        {saveError && (
          <div className="mb-6 p-4 bg-error-50 text-error-700 rounded-lg flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{saveError}</span>
          </div>
        )}
        
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8">
          <h1 className="text-2xl font-serif font-bold mb-6">{story.title}</h1>
          
          {/* Audio Player */}
          <div className="mb-8">
            <audio
              ref={audioRef}
              src="/path/to/audio.mp3"
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            />
            
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => seek(-10)}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <Rewind size={24} className="text-neutral-600" />
              </button>
              
              <button
                onClick={togglePlayback}
                className="w-12 h-12 bg-primary-500 hover:bg-primary-600 rounded-full flex items-center justify-center text-white shadow-md transition-colors"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
              </button>
              
              <button
                onClick={() => seek(10)}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <FastForward size={24} className="text-neutral-600" />
              </button>
              
              <div className="flex-1">
                <div className="relative h-2 bg-neutral-200 rounded-full">
                  <div
                    className="absolute h-full bg-primary-500 rounded-full transition-all"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={(e) => {
                      const time = parseFloat(e.target.value);
                      setCurrentTime(time);
                      if (audioRef.current) {
                        audioRef.current.currentTime = time;
                      }
                    }}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer"
                  />
                </div>
                <div className="flex justify-between text-sm text-neutral-500 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Transcript Editor */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Transcript</h2>
              {lastSaved && (
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <Check size={16} className="text-success-500" />
                  <span>Last saved {lastSaved.toLocaleTimeString()}</span>
                </div>
              )}
            </div>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="w-full h-64 p-4 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
              placeholder="Enter the transcript here..."
            />
          </div>

          {/* File Uploads */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Photos & Documents</h2>
            <div {...getRootProps()} className="border-2 border-dashed border-neutral-200 rounded-lg p-4 text-center hover:border-primary-500 transition-colors cursor-pointer mb-4">
              <input {...getInputProps()} />
              <Upload className="mx-auto mb-2 text-neutral-400" size={24} />
              <p className="text-sm text-neutral-600">Drop files here or click to upload</p>
              <p className="text-xs text-neutral-400 mt-1">Supports images and PDFs</p>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="relative group">
                    {file.file.type.startsWith('image/') ? (
                      <img
                        src={file.preview}
                        alt={file.file.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-32 bg-neutral-100 rounded-lg flex items-center justify-center">
                        <p className="text-sm text-neutral-600">{file.file.name}</p>
                      </div>
                    )}
                    <button
                      onClick={() => handleRemoveFile(file.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center text-neutral-400 hover:text-neutral-600 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Smart Tags */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Emotions */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart size={20} className="text-primary-500" />
                <h2 className="text-lg font-semibold">Emotions</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {emotions.map((emotion) => (
                  <button
                    key={emotion}
                    onClick={() => {
                      setSelectedEmotions(prev =>
                        prev.includes(emotion)
                          ? prev.filter(e => e !== emotion)
                          : [...prev, emotion]
                      );
                    }}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedEmotions.includes(emotion)
                        ? 'bg-primary-500 text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {emotion}
                  </button>
                ))}
              </div>
            </div>
            
            {/* People */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <User size={20} className="text-primary-500" />
                <h2 className="text-lg font-semibold">People</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {people.map((person) => (
                  <button
                    key={person}
                    onClick={() => {
                      setSelectedPeople(prev =>
                        prev.includes(person)
                          ? prev.filter(p => p !== person)
                          : [...prev, person]
                      );
                    }}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedPeople.includes(person)
                        ? 'bg-primary-500 text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {person}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Analysis */}
          {analysis && (
            <div className="mt-8 p-4 bg-white rounded-lg border border-neutral-200">
              <h3 className="text-lg font-semibold mb-4">AI Analysis</h3>
              <AIFeedback
                analysis={analysis}
                loading={isAnalyzing}
                error={null}
              />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default StoryReviewPage;