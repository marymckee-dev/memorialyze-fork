import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Pause, Play, Save, Trash2, Edit, Upload, Image as ImageIcon, X, Tag, User, Heart, FileText, RefreshCw, Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useAI } from '../hooks/useAI';
import AIFeedback from '../components/ai/AIFeedback';
import TipsSection from '../components/ui/TipsSection';
import { useFileUpload } from '../hooks/useFileUpload';
import { saveMemory } from '../lib/supabase';

enum RecordingState {
  IDLE,
  RECORDING,
  PAUSED,
  SAVED
}

type EntryType = 'voice' | 'memory';

interface AIMessage {
  text: string;
  type: 'suggestion' | 'encouragement' | 'question';
}

const RecordPage = () => {
  const navigate = useNavigate();
  const { analyze, getPrompt, analyzing, error: aiError } = useAI();
  const [analysis, setAnalysis] = useState(null);
  const [entryType, setEntryType] = useState<EntryType>('voice');
  const [recordingState, setRecordingState] = useState<RecordingState>(RecordingState.IDLE);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [currentMessage, setCurrentMessage] = useState<AIMessage | null>(null);
  const [memoryText, setMemoryText] = useState<string>('');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [transcript, setTranscript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>(
    "What was your favorite family vacation and why was it memorable?"
  );
  const [isRefreshingPrompt, setIsRefreshingPrompt] = useState(false);
  const [customEmotion, setCustomEmotion] = useState('');
  const [customPerson, setCustomPerson] = useState('');

  const emotions = [
    'Joy', 'Nostalgia', 'Love', 'Pride', 'Gratitude',
    'Reflection', 'Hope', 'Sadness', 'Excitement'
  ];

  const people = [
    'Mom', 'Dad', 'Grandma', 'Grandpa', 'Sister',
    'Brother', 'Aunt', 'Uncle', 'Cousin'
  ];

  const messages: AIMessage[] = [
    { text: "That's a great start! Can you tell me more about the people who were there?", type: 'question' },
    { text: "Try to describe the sounds and smells you remember from that day.", type: 'suggestion' },
    { text: "You're doing great! These details will mean so much to your family.", type: 'encouragement' },
    { text: "What emotions do you associate with this memory?", type: 'question' },
    { text: "Consider sharing a funny moment that happened during this time.", type: 'suggestion' }
  ];

  const { 
    files: uploadedFiles,
    isUploading,
    error: uploadError,
    addFiles,
    removeFile,
    cleanup: cleanupFiles
  } = useFileUpload();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf']
    },
    onDrop: (acceptedFiles) => {
      addFiles(acceptedFiles);
    }
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (recordingState === RecordingState.RECORDING) {
      timer = setInterval(() => {
        setRecordingTime(prev => {
          if (prev % 30 === 0) {
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            setCurrentMessage(randomMessage);
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [recordingState]);

  useEffect(() => {
    const getNewPrompt = async () => {
      const newPrompt = await getPrompt();
      if (newPrompt) setPrompt(newPrompt);
    };
    
    getNewPrompt();
  }, []);

  useEffect(() => {
    return () => {
      cleanupFiles();
    };
  }, []);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = () => {
    setRecordingState(RecordingState.RECORDING);
    setCurrentMessage({
      text: "Great! Just speak naturally and take your time. I'm here to help guide you through your story.",
      type: 'encouragement'
    });
  };

  const handlePauseRecording = () => {
    setRecordingState(RecordingState.PAUSED);
    setCurrentMessage({
      text: "Taking a break? That's perfectly fine. Press play when you're ready to continue.",
      type: 'encouragement'
    });
  };

  const handleResumeRecording = () => {
    setRecordingState(RecordingState.RECORDING);
    setCurrentMessage({
      text: "Welcome back! Let's continue with your story.",
      type: 'encouragement'
    });
  };

  const handleSaveRecording = async () => {
    setRecordingState(RecordingState.SAVED);
    const result = await analyze(transcript);
    if (result) setAnalysis(result);
    setCurrentMessage({
      text: "Wonderful job! You've captured a precious memory that your family will treasure.",
      type: 'encouragement'
    });
  };

  const handleDiscardRecording = () => {
    setRecordingState(RecordingState.IDLE);
    setRecordingTime(0);
    setCurrentMessage(null);
  };

  const handleNewRecording = () => {
    setRecordingState(RecordingState.IDLE);
    setRecordingTime(0);
    setCurrentMessage(null);
    setPrompt("What's a family tradition that has been passed down through generations?");
  };

  const handleReviewRecording = () => {
    navigate('/stories/1/review');
  };

  const handleRefreshPrompt = async () => {
    try {
      setIsRefreshingPrompt(true);
      const newPrompt = await getPrompt();
      if (newPrompt) setPrompt(newPrompt);
    } catch (err) {
      console.error('Error refreshing prompt:', err);
      setError('Failed to get new prompt');
    } finally {
      setIsRefreshingPrompt(false);
    }
  };

  const handleSaveMemory = async () => {
    try {
      if (!memoryText.trim() && uploadedFiles.length === 0) {
        throw new Error('Please add some content or files to save');
      }

      const entry = await saveMemory({
        groupId: 'default',
        title: 'Memory from ' + new Date().toLocaleDateString(),
        content: memoryText,
        files: uploadedFiles,
        emotions: selectedEmotions,
        people: selectedPeople
      });

      navigate(`/stories/${entry.id}`);
    } catch (err) {
      console.error('Error saving memory:', err);
      setError(err instanceof Error ? err.message : 'Failed to save memory');
    }
  };

  const handleAddCustomEmotion = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && customEmotion.trim()) {
      if (!selectedEmotions.includes(customEmotion.trim())) {
        setSelectedEmotions(prev => [...prev, customEmotion.trim()]);
      }
      setCustomEmotion('');
    }
  };

  const handleAddCustomPerson = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && customPerson.trim()) {
      if (!selectedPeople.includes(customPerson.trim())) {
        setSelectedPeople(prev => [...prev, customPerson.trim()]);
      }
      setCustomPerson('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl md:text-4xl font-serif font-bold">Record Your Story</h1>
          <div className="flex gap-2">
            <Button
              variant={entryType === 'voice' ? 'primary' : 'ghost'}
              onClick={() => setEntryType('voice')}
            >
              <Mic size={18} />
              Voice
            </Button>
            <Button
              variant={entryType === 'memory' ? 'primary' : 'ghost'}
              onClick={() => setEntryType('memory')}
            >
              <ImageIcon size={18} />
              Memory
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Today's Prompt:</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefreshPrompt}
              disabled={isRefreshingPrompt}
            >
              <RefreshCw
                size={16}
                className={isRefreshingPrompt ? 'animate-spin' : ''}
              />
              {isRefreshingPrompt ? 'Getting new prompt...' : 'Get new prompt'}
            </Button>
          </div>
          <div className="bg-primary-50 border border-primary-100 rounded-lg p-4 mb-6">
            <p className="text-lg italic text-primary-800">{prompt}</p>
          </div>
          
          <AnimatePresence mode="wait">
            {currentMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mb-6 p-4 rounded-lg ${
                  currentMessage.type === 'encouragement' ? 'bg-secondary-50 text-secondary-800' :
                  currentMessage.type === 'suggestion' ? 'bg-primary-50 text-primary-800' :
                  'bg-accent-50 text-accent-800'
                }`}
              >
                <p className="text-sm">{currentMessage.text}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {entryType === 'voice' ? (
            <div className="flex flex-col items-center">
              <div className="w-full h-32 bg-neutral-100 rounded-lg mb-6 flex items-center justify-center">
                {recordingState === RecordingState.RECORDING ? (
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 bg-primary-500"
                        animate={{
                          height: [15, 40, 15],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                ) : recordingState === RecordingState.SAVED ? (
                  <div className="text-primary-600 font-medium">Recording saved!</div>
                ) : (
                  <div className="text-neutral-400">
                    {recordingState === RecordingState.PAUSED 
                      ? "Recording paused" 
                      : "Click the microphone to start recording"}
                  </div>
                )}
              </div>
              
              <div className="text-2xl font-mono mb-6">
                {formatTime(recordingTime)}
              </div>
              
              <div className="flex items-center justify-center gap-4 mb-6">
                {recordingState === RecordingState.IDLE && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStartRecording}
                    className="w-16 h-16 bg-primary-500 hover:bg-primary-600 rounded-full flex items-center justify-center text-white shadow-lg"
                  >
                    <Mic size={32} />
                  </motion.button>
                )}
                
                {recordingState === RecordingState.RECORDING && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePauseRecording}
                    className="w-16 h-16 bg-primary-500 hover:bg-primary-600 rounded-full flex items-center justify-center text-white shadow-lg"
                  >
                    <Pause size={32} />
                  </motion.button>
                )}
                
                {recordingState === RecordingState.PAUSED && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleResumeRecording}
                      className="w-16 h-16 bg-primary-500 hover:bg-primary-600 rounded-full flex items-center justify-center text-white shadow-lg"
                    >
                      <Play size={32} />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDiscardRecording}
                      className="w-12 h-12 bg-error-500 hover:bg-error-600 rounded-full flex items-center justify-center text-white shadow-lg"
                    >
                      <Trash2 size={24} />
                    </motion.button>
                  </>
                )}
                
                {(recordingState === RecordingState.RECORDING || recordingState === RecordingState.PAUSED) && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveRecording}
                    className="w-12 h-12 bg-success-500 hover:bg-success-600 rounded-full flex items-center justify-center text-white shadow-lg"
                  >
                    <Save size={24} />
                  </motion.button>
                )}
              </div>
              
              {recordingState === RecordingState.SAVED && (
                <div className="flex gap-4">
                  <Button
                    variant="primary"
                    onClick={handleReviewRecording}
                  >
                    <Edit size={18} />
                    Review & Edit
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleDiscardRecording}
                    className="text-error-600"
                  >
                    <Trash2 size={18} />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Your Story
                </label>
                <textarea
                  value={memoryText}
                  onChange={(e) => setMemoryText(e.target.value)}
                  className="w-full h-40 p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Write your memory here..."
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Photos & Documents
                </label>
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
                            <FileText size={32} className="text-neutral-400" />
                          </div>
                        )}
                        <button
                          onClick={() => removeFile(file.id)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center text-neutral-400 hover:text-neutral-600"
                        >
                          <X size={14} />
                        </button>
                        {file.progress !== undefined && file.progress < 100 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                            <div className="w-16 h-16 rounded-full border-4 border-white border-t-transparent animate-spin" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {uploadError && (
                  <div className="mt-2 text-sm text-error-600">
                    {uploadError}
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Heart size={20} className="text-primary-500" />
                    <h2 className="text-lg font-semibold">Emotions</h2>
                  </div>
                  <div className="space-y-3">
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
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={customEmotion}
                          onChange={(e) => setCustomEmotion(e.target.value)}
                          onKeyDown={handleAddCustomEmotion}
                          placeholder="Add custom emotion..."
                          className="w-full px-3 py-1 border border-neutral-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        {customEmotion && (
                          <button
                            onClick={() => {
                              if (!selectedEmotions.includes(customEmotion.trim())) {
                                setSelectedEmotions(prev => [...prev, customEmotion.trim()]);
                              }
                              setCustomEmotion('');
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-primary-500 hover:text-primary-600"
                          >
                            <Plus size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <User size={20} className="text-primary-500" />
                    <h2 className="text-lg font-semibold">People</h2>
                  </div>
                  <div className="space-y-3">
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
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={customPerson}
                          onChange={(e) => setCustomPerson(e.target.value)}
                          onKeyDown={handleAddCustomPerson}
                          placeholder="Add person's name..."
                          className="w-full px-3 py-1 border border-neutral-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        {customPerson && (
                          <button
                            onClick={() => {
                              if (!selectedPeople.includes(customPerson.trim())) {
                                setSelectedPeople(prev => [...prev, customPerson.trim()]);
                              }
                              setCustomPerson('');
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-primary-500 hover:text-primary-600"
                          >
                            <Plus size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="primary"
                  onClick={handleSaveMemory}
                  disabled={!memoryText.trim() && uploadedFiles.length === 0}
                >
                  <Save size={18} />
                  Save Memory
                </Button>
              </div>
            </div>
          )}

          {analysis && (
            <div className="mt-6 p-4 bg-white rounded-lg border border-neutral-200">
              <h3 className="text-lg font-semibold mb-4">AI Analysis</h3>
              <AIFeedback
                analysis={analysis}
                loading={analyzing}
                error={aiError}
              />
            </div>
          )}
        </div>
        
        <TipsSection
          title="Recording Tips"
          icon={<Mic className="text-primary-500\" size={24} />}
          tips={[
            "Find a quiet space with minimal background noise",
            "Speak clearly and at a normal pace",
            "Keep the microphone about 6-12 inches from your mouth",
            "Start with a brief introduction about who you are and when the story took place",
            "Include sensory details to make your story come alive",
            "Don't worry about perfect storytelling - authentic memories are the most valuable"
          ]}
        />
      </motion.div>
    </div>
  );
};

export default RecordPage;