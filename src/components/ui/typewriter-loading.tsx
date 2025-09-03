import React from 'react';

interface TypewriterLoadingProps {
  className?: string;
}

export const TypewriterLoading: React.FC<TypewriterLoadingProps> = ({ className = '' }) => {
  return (
    <div className={`typewriter-alt ${className}`}>
      <div className="slide">
        <i></i>
      </div>
      <div className="paper"></div>
      <div className="keyboard"></div>
    </div>
  );
};

export default TypewriterLoading;