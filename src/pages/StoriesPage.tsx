import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, Tag, Download, Share2, Heart, Filter, Plus } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import StoryCard from '../components/stories/StoryCard';
import Button from '../components/ui/Button';
import { sampleStories } from '../data/sampleData';

const decades = [
  { label: 'All Time', value: 'all' },
  { label: '2020s', start: 2020, end: 2029 },
  { label: '2010s', start: 2010, end: 2019 },
  { label: '2000s', start: 2000, end: 2009 },
  { label: '1990s', start: 1990, end: 1999 },
  { label: '1980s', start: 1980, end: 1989 },
  { label: '1970s', start: 1970, end: 1979 },
  { label: '1960s', start: 1960, end: 1969 },
  { label: 'Earlier', end: 1959 }
];

// Get unique tags from all stories
const allTags = Array.from(
  new Set(sampleStories.flatMap(story => story.tags))
).sort();

const StoriesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showDecadeFilter, setShowDecadeFilter] = useState(false);
  const [showTagFilter, setShowTagFilter] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedStoryForShare, setSelectedStoryForShare] = useState<string | null>(null);
  const [likedStories, setLikedStories] = useState<Set<string>>(new Set());

  // Initialize state from URL params
  const searchTerm = searchParams.get('search') || '';
  const selectedDecade = searchParams.get('decade') || 'all';
  const selectedTag = searchParams.get('tag') || 'all';

  // Update URL when filters change
  const updateFilters = (updates: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== 'all') {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  const handleSearch = (term: string) => {
    updateFilters({ search: term });
  };

  const handleDecadeChange = (decade: string) => {
    updateFilters({ decade });
    setShowDecadeFilter(false);
  };

  const handleTagChange = (tag: string) => {
    updateFilters({ tag });
    setShowTagFilter(false);
  };

  const toggleLike = (storyId: string) => {
    setLikedStories(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(storyId)) {
        newLiked.delete(storyId);
      } else {
        newLiked.add(storyId);
      }
      return newLiked;
    });
  };

  const handleShare = (storyId: string) => {
    setSelectedStoryForShare(storyId);
    setShowShareModal(true);
  };

  const handleDownload = async (storyId: string) => {
    const story = sampleStories.find(s => s.id === storyId);
    if (!story) return;

    // Create a text file with story content
    const content = `${story.title}\nBy ${story.narrator}\n\n${story.excerpt}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${story.title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStoryYear = (dateString: string): number => {
    // Extract year from date string (e.g., "June 12, 2023" -> 2023)
    const match = dateString.match(/\d{4}/);
    return match ? parseInt(match[0]) : 0;
  };

  const filteredStories = sampleStories.filter(story => {
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesTitle = story.title.toLowerCase().includes(searchLower);
      const matchesNarrator = story.narrator.toLowerCase().includes(searchLower);
      const matchesTags = story.tags.some(tag => tag.toLowerCase().includes(searchLower));
      
      if (!matchesTitle && !matchesNarrator && !matchesTags) {
        return false;
      }
    }
    
    // Apply decade filter
    if (selectedDecade !== 'all') {
      const decade = decades.find(d => d.label === selectedDecade);
      if (decade) {
        const storyYear = getStoryYear(story.date);
        if (decade.start && decade.end) {
          if (storyYear < decade.start || storyYear > decade.end) return false;
        } else if (decade.end && !decade.start) {
          if (storyYear > decade.end) return false;
        }
      }
    }

    // Apply tag filter
    if (selectedTag !== 'all' && !story.tags.includes(selectedTag)) {
      return false;
    }
    
    return true;
  });
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowDecadeFilter(false);
      setShowTagFilter(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Family Stories</h1>
            <p className="text-neutral-600">
              {filteredStories.length} {filteredStories.length === 1 ? 'story' : 'stories'} found
            </p>
          </div>
          
          <Button as={Link} to="/record" variant="primary">
            <Plus size={18} />
            Record New Story
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-3 items-center mb-8">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
            <input
              type="text"
              placeholder="Search stories, narrators, or tags..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-neutral-200 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Time Period Filter */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDecadeFilter(!showDecadeFilter);
                setShowTagFilter(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 border rounded-full transition-colors ${
                selectedDecade !== 'all'
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              <span>{selectedDecade === 'all' ? 'Time Period' : selectedDecade}</span>
              <ChevronDown size={16} />
            </button>

            {showDecadeFilter && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-100 py-2 z-10">
                {decades.map((decade) => (
                  <button
                    key={decade.label}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDecadeChange(decade.label);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-neutral-50 ${
                      selectedDecade === decade.label ? 'text-primary-600 font-medium' : 'text-neutral-700'
                    }`}
                  >
                    {decade.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tag Filter */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTagFilter(!showTagFilter);
                setShowDecadeFilter(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 border rounded-full transition-colors ${
                selectedTag !== 'all'
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              <Tag size={18} />
              <span>{selectedTag === 'all' ? 'Tags' : selectedTag}</span>
              <ChevronDown size={16} />
            </button>

            {showTagFilter && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-100 py-2 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTagChange('all');
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-neutral-50 ${
                    selectedTag === 'all' ? 'text-primary-600 font-medium' : 'text-neutral-700'
                  }`}
                >
                  All Tags
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTagChange(tag);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-neutral-50 ${
                      selectedTag === tag ? 'text-primary-600 font-medium' : 'text-neutral-700'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Clear Filters */}
          {(searchTerm || selectedDecade !== 'all' || selectedTag !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchParams(new URLSearchParams());
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
        
        {filteredStories.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                isLiked={likedStories.has(story.id)}
                onLike={() => toggleLike(story.id)}
                onShare={() => handleShare(story.id)}
                onDownload={() => handleDownload(story.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="text-neutral-400 mb-4">
              <Filter size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No stories found</h3>
            <p className="text-neutral-600 mb-6">
              {searchTerm || selectedDecade !== 'all' || selectedTag !== 'all' ? (
                <>
                  No stories match your current filters. Try adjusting your search criteria or
                  {' '}
                  <button
                    onClick={() => setSearchParams(new URLSearchParams())}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    clear all filters
                  </button>
                  .
                </>
              ) : (
                "You haven't recorded any stories yet. Start preserving your family memories today!"
              )}
            </p>
            {!searchTerm && selectedDecade === 'all' && selectedTag === 'all' && (
              <Button as={Link} to="/record" variant="primary">
                <Plus size={18} />
                Record Your First Story
              </Button>
            )}
          </div>
        )}
      </motion.div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Share Story</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Story Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={`${window.location.origin}/stories/${selectedStoryForShare}`}
                    readOnly
                    className="flex-1 p-2 border border-neutral-200 rounded-lg bg-neutral-50"
                  />
                  <Button
                    variant="primary"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/stories/${selectedStoryForShare}`
                      );
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Share via
                </label>
                <div className="flex gap-2">
                  <Button variant="ghost" className="flex-1">
                    Email
                  </Button>
                  <Button variant="ghost" className="flex-1">
                    Messages
                  </Button>
                  <Button variant="ghost" className="flex-1">
                    WhatsApp
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button variant="ghost" onClick={() => setShowShareModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoriesPage;