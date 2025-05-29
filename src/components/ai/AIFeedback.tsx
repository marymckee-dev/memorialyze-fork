import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Lightbulb, Tag, Heart, User } from 'lucide-react';
import { AIAnalysis } from '../../lib/ai';

interface AIFeedbackProps {
  analysis: AIAnalysis | null;
  loading: boolean;
  error: string | null;
}

export default function AIFeedback({ analysis, loading, error }: AIFeedbackProps) {
  if (error) {
    return (
      <div className="p-4 bg-error-50 text-error-700 rounded-lg flex items-center gap-2">
        <AlertCircle size={18} />
        <span>{error}</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 bg-neutral-50 rounded-lg flex items-center gap-2">
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-500 border-t-transparent" />
        <span>Analyzing your story...</span>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="space-y-4"
      >
        {/* Suggested Tags */}
        <div className="flex items-start gap-2">
          <Tag size={18} className="text-primary-500 mt-1" />
          <div>
            <h3 className="font-medium mb-2">Suggested Tags</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.suggestedTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Detected Emotions */}
        <div className="flex items-start gap-2">
          <Heart size={18} className="text-primary-500 mt-1" />
          <div>
            <h3 className="font-medium mb-2">Detected Emotions</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.emotions.map((emotion) => (
                <span
                  key={emotion}
                  className="px-2 py-1 bg-secondary-50 text-secondary-700 rounded-full text-sm"
                >
                  {emotion}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* People Mentioned */}
        <div className="flex items-start gap-2">
          <User size={18} className="text-primary-500 mt-1" />
          <div>
            <h3 className="font-medium mb-2">People Mentioned</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.peopleMentioned.map((person) => (
                <span
                  key={person}
                  className="px-2 py-1 bg-accent-50 text-accent-700 rounded-full text-sm"
                >
                  {person}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Follow-up Questions */}
        <div className="flex items-start gap-2">
          <Lightbulb size={18} className="text-primary-500 mt-1" />
          <div>
            <h3 className="font-medium mb-2">Suggested Follow-up Questions</h3>
            <ul className="space-y-2">
              {analysis.suggestedQuestions.map((question, index) => (
                <li key={index} className="text-sm text-neutral-700">
                  • {question}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}