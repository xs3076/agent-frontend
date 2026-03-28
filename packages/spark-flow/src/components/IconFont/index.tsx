import React from 'react';
import classNames from 'classnames';

export interface IconFontProps {
  type: string;
  size?: 'small' | 'medium' | 'large' | number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
  isCursorPointer?: boolean;
}

const sizeMap = { small: 14, medium: 16, large: 20 };

const IconFont: React.FC<IconFontProps> = ({ type, size = 'medium', className, style, onClick, isCursorPointer }) => {
  const resolvedSize = typeof size === 'number' ? size : sizeMap[size];
  return (
    <svg className={classNames('icon', className)} style={{ width: resolvedSize, height: resolvedSize, fill: 'currentColor', verticalAlign: 'middle', cursor: isCursorPointer ? 'pointer' : undefined, ...style }} onClick={onClick} aria-hidden="true">
      <use xlinkHref={`#${type}`} />
    </svg>
  );
};

export default IconFont;
