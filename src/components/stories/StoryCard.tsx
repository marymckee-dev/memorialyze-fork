import { motion } from 'framer-motion';
import { Play, Calendar, User, Clock, FileText, Image as ImageIcon, Heart, Share2, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Story } from '../../types/Story';

interface StoryCardProps {
  story: Story;
  isLiked: boolean;
  onLike: () => void;
  onShare: () => void;
  onDownload: () => void;
}

const StoryCard = ({ story, isLiked, onLike, onShare, onDownload }: StoryCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white rounded-xl shadow-md overflow-hidden group"
    >
      <div 
        className="h-48 relative"
        style={{
          backgroundImage: `url(${story.coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.preventDefault();
              onLike();
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isLiked
                ? 'bg-primary-500 text-white'
                : 'bg-white/90 text-neutral-600 hover:bg-primary-500 hover:text-white'
            }`}
          >
            <Heart size={16} className={isLiked ? 'fill-current' : ''} />
          </button>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              onShare();
            }}
            className="w-8 h-8 rounded-full bg-white/90 text-neutral-600 hover:bg-primary-500 hover:text-white flex items-center justify-center transition-colors"
          >
            <Share2 size={16} />
          </button>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              onDownload();
            }}
            className="w-8 h-8 rounded-full bg-white/90 text-neutral-600 hover:bg-primary-500 hover:text-white flex items-center justify-center transition-colors"
          >
            <Download size={16} />
          </button>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white ${
            story.category === 'childhood' ? 'bg-secondary-500' : 
            story.category === 'family' ? 'bg-primary-500' : 
            'bg-accent-500'
          }`}>
            {story.category}
          </span>
          <h3 className="text-xl font-semibold text-white mt-2">{story.title}</h3>
        </div>
        
        {story.mediaType === 'audio' && (
          <div className="absolute top-4 left-4">
            <div className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md">
              <Play size={20} className="text-primary-600 ml-1" />
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center gap-2 text-sm text-neutral-500 mb-3">
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>{story.narrator}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-neutral-300"></div>
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{story.date}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-neutral-300"></div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{story.duration}</span>
          </div>
        </div>
        
        <p className="text-neutral-600 mb-4 line-clamp-2">{story.excerpt}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {story.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-neutral-100 rounded-full text-xs text-neutral-600"
              >
                {tag}
              </span>
            ))}
          </div>
          
          {story.documents && story.documents.length > 0 && (
            <div className="flex items-center gap-1 text-neutral-500">
              <ImageIcon size={14} />
              <FileText size={14} />
              <span className="text-xs">{story.documents.length}</span>
            </div>
          )}
        </div>
        
        <Link
          to={`/stories/${story.id}`}
          className="mt-4 inline-flex items-center font-medium text-primary-600 hover:text-primary-700"
        >
          View story
          <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"></path>
            <path d="M12 5l7 7-7 7"></path>
          </svg>
        </Link>
      </div>
    </motion.div>
  );
};

export default StoryCard;