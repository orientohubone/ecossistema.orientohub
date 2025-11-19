import React, { ReactNode, useState } from 'react';

interface SimpleTooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export const SimpleTooltip = ({ content, children, side = 'right' }: SimpleTooltipProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <span className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      tabIndex={0}
    >
      {children}
      {visible && (
        <span
          className={`z-50 absolute whitespace-nowrap px-2 py-1 text-xs rounded bg-gray-900 text-white shadow-lg ${
            side === 'right' ? 'left-full top-1/2 -translate-y-1/2 ml-2' :
            side === 'left' ? 'right-full top-1/2 -translate-y-1/2 mr-2' :
            side === 'top' ? 'bottom-full left-1/2 -translate-x-1/2 mb-2' :
            'top-full left-1/2 -translate-x-1/2 mt-2'
          }`}
          role="tooltip"
        >
          {content}
        </span>
      )}
    </span>
  );
};
