import { motion } from 'framer-motion';
import { FamilyMember } from '../../types/FamilyMember';

interface FamilyTreeNodeProps {
  member: FamilyMember;
  onClick: (member: FamilyMember) => void;
}

const FamilyTreeNode = ({ member, onClick }: FamilyTreeNodeProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(member)}
      className="flex flex-col items-center cursor-pointer"
    >
      <div 
        className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden mb-2"
        style={{ backgroundColor: member.color }}
      >
        {member.photoUrl ? (
          <img 
            src={member.photoUrl} 
            alt={member.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl">
            {member.name.charAt(0)}
          </div>
        )}
      </div>
      <div className="text-center">
        <p className="font-medium">{member.name}</p>
        <p className="text-xs text-neutral-500">{member.birthYear}-{member.deathYear || 'Present'}</p>
      </div>
      <div className="mt-1 flex -space-x-1">
        {member.storyCount > 0 && (
          <div className="w-5 h-5 rounded-full bg-primary-100 border border-primary-200 flex items-center justify-center">
            <span className="text-[8px] font-bold text-primary-700">{member.storyCount}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FamilyTreeNode;