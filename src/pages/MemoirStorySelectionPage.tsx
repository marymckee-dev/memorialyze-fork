import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ArrowLeft, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import { sampleStories } from '../data/sampleData';

const MemoirStorySelectionPage = () => {
  const navigate = useNavigate();
  const [selectedStories, setSelectedStories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredStories = sampleStories.filter(story => {
    if (searchTerm && !story.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (activeFilter !== 'all' && story.category !== activeFilter) {
      return false;
    }
    return true;
  });

  const handleStoryToggle = (storyId: string) => {
    setSelectedStories(prev =>
      prev.includes(storyId)
        ? prev.filter(id => id !== storyId)
        : [...prev, storyId]
    );
  };

  const handleContinue = () => {
    if (selectedStories.length > 0) {
      navigate('/memoirs/new/chapters', {
        state: { selectedStories }
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
              onClick={() => navigate('/memoirs')}
            >
              <ArrowLeft size={18} />
              Back to Memoirs
            </Button>
            <h1 className="text-3xl md:text-4xl font-serif font-bold">Select Stories</h1>
            <p className="text-neutral-600 mt-2">
              Choose the stories you'd like to include in your memoir
            </p>
          </div>

          <div className="text-right">
            <div className="text-sm text-neutral-600 mb-2">
              {selectedStories.length} stories selected
            </div>
            <Button
              variant="primary"
              onClick={handleContinue}
              disabled={selectedStories.length === 0}
            >
              Continue
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
          {/* Search and Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                <input
                  type="text"
                  placeholder="Search stories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeFilter === 'all'
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter('childhood')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeFilter === 'childhood'
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Childhood
              </button>
              <button
                onClick={() => setActiveFilter('family')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeFilter === 'family'
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Family
              </button>
            </div>
          </div>

          {/* Stories Grid */}
          <div className="space-y-4">
            {filteredStories.map((story) => (
              <div
                key={story.id}
                className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                  selectedStories.includes(story.id)
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-200 hover:border-primary-300'
                }`}
                onClick={() => handleStoryToggle(story.id)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-20 h-20 rounded-lg bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: `url(${story.coverImage})` }}
                  />
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{story.title}</h3>
                    <p className="text-sm text-neutral-600 line-clamp-2">
                      {story.excerpt}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-1 bg-neutral-100 rounded-full">
                        {story.date}
                      </span>
                      <span className="text-xs px-2 py-1 bg-neutral-100 rounded-full">
                        {story.duration}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedStories.includes(story.id)
                          ? 'border-primary-500 bg-primary-500 text-white'
                          : 'border-neutral-300'
                      }`}
                    >
                      {selectedStories.includes(story.id) && (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredStories.length === 0 && (
            <div className="text-center py-12">
              <Filter size={48} className="mx-auto mb-4 text-neutral-400" />
              <h3 className="text-lg font-medium mb-2">No stories found</h3>
              <p className="text-neutral-600">
                Try adjusting your search or filters to find stories
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MemoirStorySelectionPage;