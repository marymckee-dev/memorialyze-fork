import { motion } from 'framer-motion';
import { Book, Plus, Download, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

interface Memoir {
  id: string;
  title: string;
  coverImage: string;
  storyCount: number;
  status: 'draft' | 'completed';
  lastModified: string;
}

const sampleMemoirs: Memoir[] = [
  {
    id: '1',
    title: 'Growing Up in the 80s',
    coverImage: 'https://images.pexels.com/photos/3831849/pexels-photo-3831849.jpeg',
    storyCount: 12,
    status: 'completed',
    lastModified: '2024-03-15'
  },
  {
    id: '2',
    title: 'Family Traditions',
    coverImage: 'https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg',
    storyCount: 8,
    status: 'draft',
    lastModified: '2024-03-20'
  }
];

const MemoirPage = () => {
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
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Memoirs</h1>
            <p className="text-neutral-600">Transform your stories into beautifully crafted books</p>
          </div>
          
          <Button as={Link} to="/memoirs/new/select-stories" variant="primary">
            <Plus size={18} />
            Start a New Memoir
          </Button>
        </div>

        {sampleMemoirs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleMemoirs.map((memoir) => (
              <motion.div
                key={memoir.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div 
                  className="h-48 relative"
                  style={{
                    backgroundImage: `url(${memoir.coverImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white ${
                      memoir.status === 'completed' ? 'bg-success-500' : 'bg-primary-500'
                    }`}>
                      {memoir.status === 'completed' ? 'Completed' : 'Draft'}
                    </span>
                    <h3 className="text-xl font-semibold text-white mt-2">{memoir.title}</h3>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-4 text-sm text-neutral-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Book size={14} />
                      <span>{memoir.storyCount} stories</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>Updated {memoir.lastModified}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Button
                      as={Link}
                      to={`/memoirs/${memoir.id}`}
                      variant="ghost"
                      size="sm"
                    >
                      View Details
                    </Button>
                    
                    {memoir.status === 'completed' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary-600"
                      >
                        <Download size={16} />
                        Download PDF
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Book size={32} className="text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No memoirs yet</h3>
            <p className="text-neutral-600 mb-6">
              Start creating your first memoir by selecting stories and customizing the style.
            </p>
            <Button as={Link} to="/memoirs/new/select-stories" variant="primary">
              <Plus size={18} />
              Create Your First Memoir
            </Button>
          </div>
        )}

        <div className="mt-12 bg-white rounded-xl shadow-md p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-4">About Memoirs</h2>
          <div className="prose max-w-none text-neutral-600">
            <p>
              Memoirs help you organize and present your family stories in a beautiful, cohesive format.
              Our AI-powered system helps you:
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>Arrange stories chronologically or thematically</li>
              <li>Generate natural transitions between stories</li>
              <li>Create chapter introductions and summaries</li>
              <li>Include relevant photos and documents</li>
              <li>Export as a professionally formatted PDF</li>
              <li>Order printed copies for family members</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MemoirPage;