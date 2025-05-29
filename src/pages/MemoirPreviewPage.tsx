import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Book, Share2, AlertCircle, Printer, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../components/ui/Button';

interface MemoirPreview {
  title: string;
  dedication?: string;
  style: 'classic' | 'modern' | 'vintage';
  chapters: {
    id: string;
    title: string;
    content: string;
  }[];
  customizations: {
    fontSize: number;
    lineHeight: number;
    marginSize: string;
  };
}

const samplePreview: MemoirPreview = {
  title: "Growing Up in the 80s",
  dedication: "For my children, may these stories help you understand where you came from.",
  style: "classic",
  chapters: [
    {
      id: "1",
      title: "Summer Days at Grandpa's Farm",
      content: `<p>The summer of 1985 remains etched in my memory like a photograph, its colors growing warmer with each passing year. Grandpa's farm was our sanctuary, a place where time seemed to move at its own gentle pace.</p>
      <p>The old farmhouse stood proud against the horizon, its wrap-around porch offering the perfect vantage point for watching fireflies emerge at dusk. The smell of fresh-cut hay and grandmother's apple pies would mingle in the air, creating a scent that I can still recall with perfect clarity.</p>`
    },
    {
      id: "2",
      title: "Family Traditions",
      content: `<p>Every Sunday was a celebration in our household. Mom would wake up early to start preparing her famous pot roast, the aroma filling every corner of our home. Dad would gather us around the table, insisting that no matter how busy our lives became, this weekly ritual was non-negotiable.</p>
      <p>These weren't just meals; they were the foundation of our family's story. Stories would flow as freely as the gravy, tales of grandparents and great-grandparents, of triumph and tribulation, of love and perseverance.</p>`
    }
  ],
  customizations: {
    fontSize: 16,
    lineHeight: 1.6,
    marginSize: "medium"
  }
};

function MemoirPreviewPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [preview, setPreview] = useState<MemoirPreview>(samplePreview);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    // In a real app, we would fetch the memoir data here
    setIsLoading(true);
    try {
      // Simulated API call
      setTimeout(() => {
        setPreview(samplePreview);
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to load memoir preview');
      setIsLoading(false);
    }
  }, []);

  const totalPages = preview.chapters.length + 2; // Cover + Dedication + Chapters

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would generate and download a PDF
      const blob = new Blob(['PDF content'], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${preview.title.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to generate PDF');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getStyleClasses = () => {
    const baseClasses = 'bg-white shadow-lg rounded-lg transition-all duration-300 min-h-[800px]';
    const styleSpecificClasses = {
      classic: 'font-serif p-16',
      modern: 'font-sans p-12',
      vintage: 'font-serif p-20 bg-neutral-50',
    };
    
    return `${baseClasses} ${styleSpecificClasses[preview.style]}`;
  };

  const renderPage = () => {
    if (currentPage === 0) {
      // Cover page
      return (
        <div className="text-center py-32">
          <h1 
            className={`text-4xl font-bold mb-8 ${
              preview.style === 'modern' ? 'font-sans' : 'font-serif'
            }`}
            style={{ 
              fontSize: `${preview.customizations.fontSize + 16}px`,
              lineHeight: preview.customizations.lineHeight
            }}
          >
            {preview.title}
          </h1>
          <div 
            className="mx-auto w-32 h-1 bg-primary-500 mb-8"
            style={{ 
              marginTop: preview.customizations.marginSize === 'large' ? '3rem' : '2rem',
              marginBottom: preview.customizations.marginSize === 'large' ? '3rem' : '2rem'
            }}
          />
          <div className="text-neutral-600">
            {new Date().getFullYear()}
          </div>
        </div>
      );
    } else if (currentPage === 1) {
      // Dedication page
      return (
        <div className="text-center py-32">
          <h2 
            className={`text-2xl mb-8 ${
              preview.style === 'modern' ? 'font-sans' : 'font-serif'
            }`}
            style={{ fontSize: `${preview.customizations.fontSize + 8}px` }}
          >
            Dedication
          </h2>
          <p 
            className="italic text-neutral-700"
            style={{ 
              fontSize: `${preview.customizations.fontSize}px`,
              lineHeight: preview.customizations.lineHeight
            }}
          >
            {preview.dedication}
          </p>
        </div>
      );
    } else {
      // Chapter pages
      const chapter = preview.chapters[currentPage - 2];
      return chapter ? (
        <div>
          <h2 
            className={`text-3xl mb-8 ${
              preview.style === 'modern' ? 'font-sans' : 'font-serif'
            }`}
            style={{ fontSize: `${preview.customizations.fontSize + 12}px` }}
          >
            {chapter.title}
          </h2>
          <div 
            className="prose max-w-none"
            style={{ 
              fontSize: `${preview.customizations.fontSize}px`,
              lineHeight: preview.customizations.lineHeight
            }}
            dangerouslySetInnerHTML={{ __html: chapter.content }}
          />
        </div>
      ) : null;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <Book size={48} className="mx-auto mb-4 text-primary-500 animate-pulse" />
          <p className="text-neutral-600">Loading preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-5xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/memoirs/new/style')}
          >
            <ArrowLeft size={18} />
            Back to Editor
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => setShowShareModal(true)}
            >
              <Share2 size={18} />
              Share
            </Button>
            <Button
              variant="ghost"
              onClick={handlePrint}
            >
              <Printer size={18} />
              Print
            </Button>
            <Button
              variant="primary"
              onClick={handleDownload}
              disabled={isLoading}
            >
              <Download size={18} />
              Download PDF
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error-50 text-error-700 rounded-lg flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-neutral-100 rounded-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 0}
              >
                <ChevronLeft size={16} />
                Previous
              </Button>
              <span className="text-sm text-neutral-600">
                Page {currentPage + 1} of {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1}
              >
                Next
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>

          <div className={getStyleClasses()}>
            {renderPage()}
          </div>
        </div>
      </motion.div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Share Memoir</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Preview Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={`${window.location.origin}/memoirs/preview/${preview.title.toLowerCase().replace(/\s+/g, '-')}`}
                    readOnly
                    className="flex-1 p-2 border border-neutral-200 rounded-lg bg-neutral-50"
                  />
                  <Button
                    variant="primary"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/memoirs/preview/${preview.title.toLowerCase().replace(/\s+/g, '-')}`
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
}

export default MemoirPreviewPage;