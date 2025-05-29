import { ReactNode } from 'react';
import { Lightbulb } from 'lucide-react';

interface TipsSectionProps {
  title: string;
  tips: string[];
  icon?: ReactNode;
}

const TipsSection = ({ title, tips, icon = <Lightbulb className="text-primary-500" size={24} /> }: TipsSectionProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        {icon}
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <ul className="space-y-4">
        {tips.map((tip, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center text-sm font-medium">
              {index + 1}
            </div>
            <span className="text-neutral-700">{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TipsSection;