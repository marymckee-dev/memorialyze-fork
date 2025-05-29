import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Edit, Wand2, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

const MemoirPathChoicePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleManualChoice = () => {
    navigate('/memoirs/new/editor', { 
      state: { 
        ...location.state,
        mode: 'manual' 
      }
    });
  };

  const handleAIChoice = async () => {
    setIsLoading(true);
    try {
      navigate('/memoirs/new/editor', { 
        state: { 
          ...location.state,
          mode: 'ai' 
        }
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
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
              onClick={() => navigate('/memoirs/new/select-stories')}
            >
              <ArrowLeft size={18} />
              Back to Story Selection
            </Button>
            <h1 className="text-3xl md:text-4xl font-serif font-bold">Choose Your Path</h1>
            <p className="text-neutral-600 mt-2">
              How would you like to create your memoir?
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-md p-8 border-2 border-primary-100 cursor-pointer"
            onClick={handleAIChoice}
          >
            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-6">
              <Wand2 size={32} className="text-primary-600" />
            </div>
            <h2 className="text-2xl font-serif font-bold mb-4">AI-Assisted</h2>
            <p className="text-neutral-600 mb-6">
              Let our AI help organize your stories into a cohesive narrative with natural transitions and chapter suggestions.
            </p>
            <Button variant="primary" disabled={isLoading} className="w-full">
              {isLoading ? 'Preparing AI...' : 'Use AI Assistant'}
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-md p-8 cursor-pointer"
            onClick={handleManualChoice}
          >
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-6">
              <Edit size={32} className="text-neutral-600" />
            </div>
            <h2 className="text-2xl font-serif font-bold mb-4">Write Manually</h2>
            <p className="text-neutral-600 mb-6">
              Create your memoir from scratch with our intuitive editor. Full creative control over your narrative.
            </p>
            <Button variant="ghost" className="w-full">
              Start Writing
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default MemoirPathChoicePage;