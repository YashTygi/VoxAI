import React from 'react';
import { JellyfishSpinner as OriginalJellyfishSpinner } from 'react-spinners-kit';

// Define the props interface
interface JellyfishSpinnerProps {
  color?: string;
  size?: number;
  loading?: boolean;
  [key: string]: any; // For any additional props
}

const JellyfishSpinner: React.FC<JellyfishSpinnerProps> = ({
  color = "#8486F3",
  size = 100,
  loading = true,
  ...props
}) => {
  return (
    <OriginalJellyfishSpinner
      color={color}
      size={size}
      loading={loading}
      {...props}
    />
  );
};

export default JellyfishSpinner;