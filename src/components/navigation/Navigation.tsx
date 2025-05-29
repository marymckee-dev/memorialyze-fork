import { Link, NavLink } from 'react-router-dom';
import { BookOpen, Mic, Users, User, Book } from 'lucide-react';
import Logo from '../common/Logo';

interface NavigationProps {
  isScrolled: boolean;
  isHomePage: boolean;
}

const Navigation = ({ isScrolled, isHomePage }: NavigationProps) => {
  const linkClass = `flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
    isScrolled || !isHomePage
      ? 'text-neutral-700 hover:bg-neutral-100 hover:text-primary-600'
      : 'text-white hover:bg-white/20'
  }`;

  const activeLinkClass = `${linkClass} ${
    isScrolled || !isHomePage
      ? 'bg-primary-50 text-primary-600 font-medium'
      : 'bg-white/20 font-medium'
  }`;

  return (
    <nav className="flex items-center justify-between">
      <div className="flex items-center">
        <Link to="/" className="flex items-center gap-2">
          <Logo size={36} color={isScrolled || !isHomePage ? 'primary' : 'white'} />
          <span
            className={`text-xl font-serif font-bold ${
              isScrolled || !isHomePage ? 'text-primary-700' : 'text-white'
            }`}
          >
            TimeStitch
          </span>
        </Link>
      </div>
      
      <div className="hidden md:flex items-center gap-2">
        <NavLink
          to="/stories"
          className={({ isActive }) => isActive ? activeLinkClass : linkClass}
        >
          <BookOpen size={18} />
          <span>Stories</span>
        </NavLink>
        
        <NavLink
          to="/record"
          className={({ isActive }) => isActive ? activeLinkClass : linkClass}
        >
          <Mic size={18} />
          <span>Record</span>
        </NavLink>
        
        <NavLink
          to="/family-tree"
          className={({ isActive }) => isActive ? activeLinkClass : linkClass}
        >
          <Users size={18} />
          <span>Family Tree</span>
        </NavLink>

        <NavLink
          to="/memoirs"
          className={({ isActive }) => isActive ? activeLinkClass : linkClass}
        >
          <Book size={18} />
          <span>Memoirs</span>
        </NavLink>
      </div>
      
      <div className="hidden md:flex items-center">
        <NavLink
          to="/profile"
          className={({ isActive }) => isActive ? activeLinkClass : linkClass}
        >
          <User size={18} />
          <span>Profile</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default Navigation;