import { ReactNode } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface PreviewPaneProps {
  children: ReactNode;
  loading?: boolean;
  style: 'classic' | 'modern' | 'vintage';
  customizations: {
    fontSize: number;
    lineHeight: number;
    marginSize: string;
  };
}

const PreviewPane = ({ children, loading, style, customizations }: PreviewPaneProps) => {
  const getStyleClasses = () => {
    const baseClasses = 'aspect-[3/4] bg-white rounded-lg border transition-all duration-300';
    const styleSpecificClasses = {
      classic: 'font-serif border-neutral-200 p-8',
      modern: 'font-sans border-neutral-100 p-6',
      vintage: 'font-serif border-neutral-300 p-10 bg-neutral-50',
    };
    
    return `${baseClasses} ${styleSpecificClasses[style]}`;
  };

  return (
    <div className={getStyleClasses()}>
      {loading ? (
        <div className="h-full flex items-center justify-center">
          <LoadingSpinner size={32} color="#00afaf" />
        </div>
      ) : (
        <div
          style={{
            fontSize: `${customizations.fontSize}px`,
            lineHeight: customizations.lineHeight,
            padding: customizations.marginSize === 'large' ? '2rem' : '1rem',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default PreviewPane;