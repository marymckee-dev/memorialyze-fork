import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import ChapterEditor from '../components/memoirs/ChapterEditor';
import { Chapter } from '../types/Memoir';
import { useMemoir } from '../hooks/useMemoir';

const MemoirEditorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedStories] = useState<string[]>(location.state?.selectedStories || []);
  const { generateChapters, isGenerating, error } = useMemoir();

  useEffect(() => {
    const initializeEditor = async () => {
      if (location.state?.mode === 'ai' && location.state?.chapterConfig) {
        try {
          const generatedChapters = await generateChapters(
            selectedStories,
            location.state.chapterConfig
          );
          setChapters(generatedChapters);
        } catch (err) {
          console.error('Failed to generate chapters:', err);
        }
      }
    };

    initializeEditor();
  }, [location.state?.mode, location.state?.chapterConfig, selectedStories, generateChapters]);

  const handleContinue = () => {
    if (chapters.length > 0) {
      navigate('/memoirs/new/preview', {
        state: {
          ...location.state,
          chapters
        }
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button
              variant="ghost"
              className="mb-2"
              onClick={() => navigate('/memoirs/new/path')}
            >
              <ArrowLeft size={18} />
              Back to Path Choice
            </Button>
            <h1 className="text-3xl md:text-4xl font-serif font-bold">Edit Your Memoir</h1>
            <p className="text-neutral-600 mt-2">
              {isGenerating
                ? 'Generating chapters from your stories...'
                : 'Organize and edit your memoir chapters'}
            </p>
          </div>

          <Button
            variant="primary"
            onClick={handleContinue}
            disabled={chapters.length === 0}
          >
            Preview Memoir
            <ArrowRight size={18} />
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error-50 text-error-700 rounded-lg flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {isGenerating ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mx-auto mb-4" />
            <p className="text-neutral-600">
              Our AI is crafting your memoir chapters...
            </p>
          </div>
        ) : (
          <ChapterEditor
            chapters={chapters}
            onChange={setChapters}
            selectedStories={selectedStories}
          />
        )}
      </motion.div>
    </div>
  );
};

export default MemoirEditorPage;