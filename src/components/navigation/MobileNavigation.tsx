import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Mic, Users, User, Book } from 'lucide-react';

const MobileNavigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-neutral-200 z-50">
      <div className="flex justify-around items-center h-16">
        <Link
          to="/stories"
          className={`flex flex-col items-center justify-center px-2 pt-2 pb-1 rounded-md transition-colors ${
            isActive('/stories') ? 'text-primary-600' : 'text-neutral-500'
          }`}
        >
          <BookOpen size={20} />
          <span className="text-xs mt-1">Stories</span>
        </Link>
        
        <Link
          to="/record"
          className={`flex flex-col items-center justify-center px-2 pt-2 pb-1 rounded-md transition-colors ${
            isActive('/record') ? 'text-primary-600' : 'text-neutral-500'
          }`}
        >
          <Mic size={20} />
          <span className="text-xs mt-1">Record</span>
        </Link>
        
        <Link
          to="/memoirs"
          className={`flex flex-col items-center justify-center px-2 pt-2 pb-1 rounded-md transition-colors ${
            isActive('/memoirs') ? 'text-primary-600' : 'text-neutral-500'
          }`}
        >
          <Book size={20} />
          <span className="text-xs mt-1">Memoirs</span>
        </Link>
        
        <Link
          to="/family-tree"
          className={`flex flex-col items-center justify-center px-2 pt-2 pb-1 rounded-md transition-colors ${
            isActive('/family-tree') ? 'text-primary-600' : 'text-neutral-500'
          }`}
        >
          <Users size={20} />
          <span className="text-xs mt-1">Family</span>
        </Link>
        
        <Link
          to="/profile"
          className={`flex flex-col items-center justify-center px-2 pt-2 pb-1 rounded-md transition-colors ${
            isActive('/profile') ? 'text-primary-600' : 'text-neutral-500'
          }`}
        >
          <User size={20} />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileNavigation;