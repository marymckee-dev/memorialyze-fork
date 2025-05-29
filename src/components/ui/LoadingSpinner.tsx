import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
}

const LoadingSpinner = ({ size = 24, color = 'currentColor' }: LoadingSpinnerProps) => {
  return (
    <motion.div
      className="relative"
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <div
        className="absolute inset-0 border-2 rounded-full"
        style={{
          borderColor: color,
          borderTopColor: 'transparent',
          borderRightColor: 'transparent',
        }}
      />
    </motion.div>
  );
};

export default LoadingSpinner;