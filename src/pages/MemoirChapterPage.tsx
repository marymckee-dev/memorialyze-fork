import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Wand2, Edit } from 'lucide-react';
import Button from '../components/ui/Button';

interface ChapterConfig {
  count: number;
  tone: 'formal' | 'casual' | 'nostalgic';
}

const MemoirChapterPage = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<ChapterConfig>({
    count: 3,
    tone: 'nostalgic'
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateWithAI = async () => {
    setIsGenerating(true);
    try {
      // In a real app, we would send the selected stories, chapter count,
      // and tone to the AI service here
      await new Promise(resolve => setTimeout(resolve, 2000));
      navigate('/memoirs/new/style', { 
        state: { 
          useAI: true,
          chapterConfig: config
        }
      });
    } catch (error) {
      console.error('Failed to generate chapters:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOrganizeManually = () => {
    navigate('/memoirs/new/style', { 
      state: { 
        useAI: false,
        chapterConfig: config
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button
              variant="ghost"
              className="mb-2"
              onClick={() => navigate('/memoirs/new/select-stories')}
            >
              <ArrowLeft size={18} />
              Back to Story Selection
            </Button>
            <h1 className="text-3xl md:text-4xl font-serif font-bold">Organize Your Memoir</h1>
            <p className="text-neutral-600 mt-2">
              Choose how you want to structure your memoir's chapters
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Number of Chapters
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={config.count}
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  count: Math.max(1, Math.min(20, parseInt(e.target.value) || 1))
                }))}
                className="w-full p-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="mt-1 text-sm text-neutral-500">
                Choose between 1 and 20 chapters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Writing Tone
              </label>
              <select
                value={config.tone}
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  tone: e.target.value as ChapterConfig['tone']
                }))}
                className="w-full p-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="formal">Formal & Professional</option>
                <option value="casual">Casual & Conversational</option>
                <option value="nostalgic">Warm & Nostalgic</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-6">Choose Your Approach</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 border border-primary-100 rounded-xl bg-primary-50 hover:bg-primary-100 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <Wand2 size={24} className="text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold">AI-Generated</h3>
              </div>
              <p className="text-neutral-600 mb-6">
                Let AI organize your stories into cohesive chapters with natural transitions and introductions.
              </p>
              <Button
                variant="primary"
                onClick={handleGenerateWithAI}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? 'Generating...' : 'Generate with AI'}
              </Button>
            </div>

            <div className="p-6 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center">
                  <Edit size={24} className="text-neutral-600" />
                </div>
                <h3 className="text-lg font-semibold">Manual Organization</h3>
              </div>
              <p className="text-neutral-600 mb-6">
                Organize your stories into chapters yourself with our intuitive drag-and-drop interface.
              </p>
              <Button
                variant="ghost"
                onClick={handleOrganizeManually}
                className="w-full"
              >
                Organize Manually
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MemoirChapterPage;