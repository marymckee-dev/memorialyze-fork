import { Check, AlertCircle } from 'lucide-react';

interface AutosaveIndicatorProps {
  lastSaved: Date | null;
  error: string | null;
}

const AutosaveIndicator = ({ lastSaved, error }: AutosaveIndicatorProps) => {
  if (error) {
    return (
      <div className="flex items-center gap-2 text-error-600">
        <AlertCircle size={16} />
        <span className="text-sm">{error}</span>
      </div>
    );
  }

  if (!lastSaved) return null;

  return (
    <div className="flex items-center gap-2 text-success-600">
      <Check size={16} />
      <span className="text-sm">
        Last saved {lastSaved.toLocaleTimeString()}
      </span>
    </div>
  );
};

export default AutosaveIndicator;