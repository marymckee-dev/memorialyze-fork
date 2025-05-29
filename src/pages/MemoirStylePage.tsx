import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Edit, Book, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import ChapterEditor from '../components/memoirs/ChapterEditor';
import PreviewPane from '../components/ui/PreviewPane';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Chapter, MemoirStyle } from '../types/Memoir';

const styleOptions: MemoirStyle[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'A timeless design with elegant typography and traditional layouts.',
    preview: 'https://images.pexels.com/photos/5834/nature-grass-leaf-green.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    features: [
      'Serif typography for readability',
      'Traditional chapter layouts',
      'Elegant page decorations',
      'Professional formatting'
    ]
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean, minimalist design with contemporary typography.',
    preview: 'https://images.pexels.com/photos/2170/creative-desk-pens-school.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    features: [
      'Sans-serif typography',
      'Minimalist layouts',
      'Full-bleed images',
      'Modern spacing'
    ]
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Nostalgic design with retro elements and warm tones.',
    preview: 'https://images.pexels.com/photos/3646172/pexels-photo-3646172.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    features: [
      'Vintage typography',
      'Decorative borders',
      'Aged paper textures',
      'Historical aesthetics'
    ]
  }
];

function MemoirStylePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedStyle, setSelectedStyle] = useState<string>('classic');
  const [title, setTitle] = useState('');
  const [dedication, setDedication] = useState('');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedStories] = useState<string[]>(location.state?.selectedStories || []);
  const [currentPage, setCurrentPage] = useState(0);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customizations, setCustomizations] = useState({
    fontSize: 16,
    lineHeight: 1.6,
    marginSize: 'medium',
  });
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  useEffect(() => {
    // Load chapters from location state if available
    if (location.state?.chapters) {
      setChapters(location.state.chapters);
    }
  }, [location.state]);

  useEffect(() => {
    // Simulate preview generation when content changes
    const generatePreview = async () => {
      if (!title && !dedication && chapters.length === 0) return;
      
      setIsPreviewLoading(true);
      try {
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 500));
      } finally {
        setIsPreviewLoading(false);
      }
    };

    generatePreview();
  }, [title, dedication, chapters, selectedStyle, customizations]);

  const handleContinue = () => {
    if (title.trim()) {
      navigate('/memoirs/new/preview', {
        state: {
          title,
          dedication,
          style: selectedStyle,
          chapters,
          customizations,
        }
      });
    }
  };

  const totalPages = chapters.length + 2; // Cover + Dedication + Chapters

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  const handleCustomizationChange = (key: string, value: any) => {
    setCustomizations(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const renderPreviewPage = () => {
    if (currentPage === 0) {
      return (
        <div className="text-center">
          <h1 
            className={`text-2xl font-bold mb-4 ${
              selectedStyle === 'modern' ? 'font-sans' : 'font-serif'
            }`}
            style={{ fontSize: `${customizations.fontSize + 8}px` }}
          >
            {title || 'Enter a title'}
          </h1>
          {dedication && (
            <p 
              className="text-sm italic"
              style={{ 
                fontSize: `${customizations.fontSize - 2}px`,
                lineHeight: customizations.lineHeight
              }}
            >
              {dedication}
            </p>
          )}
        </div>
      );
    }

    if (currentPage === 1) {
      return (
        <div className="text-center">
          <h2 
            className={`text-lg mb-4 ${
              selectedStyle === 'modern' ? 'font-sans' : 'font-serif'
            }`}
            style={{ fontSize: `${customizations.fontSize + 4}px` }}
          >
            Dedication
          </h2>
          <p 
            className="italic"
            style={{ 
              fontSize: `${customizations.fontSize}px`,
              lineHeight: customizations.lineHeight
            }}
          >
            {dedication || 'Add a dedication message'}
          </p>
        </div>
      );
    }

    const chapter = chapters[currentPage - 2];
    return chapter ? (
      <div>
        <h2 
          className={`text-lg mb-4 ${
            selectedStyle === 'modern' ? 'font-sans' : 'font-serif'
          }`}
          style={{ fontSize: `${customizations.fontSize + 4}px` }}
        >
          {chapter.title}
        </h2>
        <div 
          dangerouslySetInnerHTML={{ __html: chapter.content }}
          style={{ 
            fontSize: `${customizations.fontSize}px`,
            lineHeight: customizations.lineHeight
          }}
        />
      </div>
    ) : (
      <div className="text-center text-neutral-500">
        <Book size={48} className="mx-auto mb-4" />
        <p>Add chapters to preview content</p>
      </div>
    );
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
              onClick={() => navigate('/memoirs/new/editor')}
            >
              <ArrowLeft size={18} />
              Back to Editor
            </Button>
            <h1 className="text-3xl md:text-4xl font-serif font-bold">Style Your Memoir</h1>
            <p className="text-neutral-600 mt-2">
              Choose a design style and customize your memoir's details
            </p>
          </div>

          <Button
            variant="primary"
            onClick={handleContinue}
            disabled={!title.trim()}
          >
            Preview Memoir
            <ArrowRight size={18} />
          </Button>
        </div>

        <div className="space-y-8">
          {/* Memoir Details */}
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-6">Memoir Details</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
                  Memoir Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title for your memoir"
                  className="w-full p-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="dedication" className="block text-sm font-medium text-neutral-700 mb-1">
                  Dedication (Optional)
                </label>
                <textarea
                  id="dedication"
                  value={dedication}
                  onChange={(e) => setDedication(e.target.value)}
                  placeholder="Add a dedication message"
                  className="w-full h-24 p-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Style Selection */}
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-6">Choose a Style</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {styleOptions.map((style) => (
                <motion.div
                  key={style.id}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedStyle === style.id
                      ? 'border-primary-500'
                      : 'border-transparent hover:border-primary-300'
                  }`}
                >
                  <div
                    className="h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url(${style.preview})` }}
                  />
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{style.name}</h3>
                    <p className="text-sm text-neutral-600 mb-4">{style.description}</p>
                    <ul className="space-y-2">
                      {style.features.map((feature, index) => (
                        <li key={index} className="text-xs text-neutral-500 flex items-center gap-2">
                          <svg className="w-4 h-4 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Preview</h2>
              <div className="flex items-center gap-4">
                <div className="text-sm text-neutral-500">
                  Page {currentPage + 1} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={currentPage === 0}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages - 1}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
                <Button 
                  variant={isCustomizing ? 'primary' : 'ghost'} 
                  size="sm"
                  onClick={() => setIsCustomizing(!isCustomizing)}
                >
                  <Edit size={16} />
                  Customize
                </Button>
              </div>
            </div>

            <div className="flex gap-8">
              <PreviewPane
                style={selectedStyle as any}
                customizations={customizations}
                loading={isPreviewLoading}
              >
                {renderPreviewPage()}
              </PreviewPane>

              {isCustomizing && (
                <div className="w-64 border-l border-neutral-200 pl-6">
                  <h3 className="font-medium mb-4">Customization</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-neutral-600 mb-2">
                        Font Size
                      </label>
                      <input
                        type="range"
                        min="12"
                        max="24"
                        value={customizations.fontSize}
                        onChange={(e) => handleCustomizationChange('fontSize', parseInt(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-neutral-500">
                        <span>Small</span>
                        <span>Large</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-neutral-600 mb-2">
                        Line Height
                      </label>
                      <input
                        type="range"
                        min="1.2"
                        max="2"
                        step="0.1"
                        value={customizations.lineHeight}
                        onChange={(e) => handleCustomizationChange('lineHeight', parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-neutral-500">
                        <span>Tight</span>
                        <span>Spacious</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-neutral-600 mb-2">
                        Margin Size
                      </label>
                      <select
                        value={customizations.marginSize}
                        onChange={(e) => handleCustomizationChange('marginSize', e.target.value)}
                        className="w-full p-2 border border-neutral-200 rounded-lg"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default MemoirStylePage;