import React, { useState, useEffect, ReactNode } from 'react';
import { cn } from '../lib/utils';

interface TransitionTextProps {
  children: ReactNode;
  className?: string;
  transitionDuration?: number;
  as?: keyof JSX.IntrinsicElements;
}

export const TransitionText: React.FC<TransitionTextProps> = ({
  children,
  className,
  transitionDuration = 200,
  as: Component = 'span'
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayText, setDisplayText] = useState(children);

  useEffect(() => {
    if (displayText !== children) {
      setIsTransitioning(true);
      
      const timer = setTimeout(() => {
        setDisplayText(children);
        setIsTransitioning(false);
      }, transitionDuration / 2);

      return () => clearTimeout(timer);
    }
  }, [children, transitionDuration]);

  return (
    <Component
      className={cn(
        "transition-opacity duration-200 ease-in-out",
        isTransitioning && "opacity-0",
        !isTransitioning && "opacity-100",
        className
      )}
      style={{ transitionDuration: `${transitionDuration}ms` }}
    >
      {displayText}
    </Component>
  );
}; 