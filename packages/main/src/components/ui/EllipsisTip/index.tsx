import { Tooltip } from '@arco-design/web-react';
import React, { useEffect, useRef, useState } from 'react';

export interface EllipsisTipProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
}

const EllipsisTip: React.FC<EllipsisTipProps> = ({
  children,
  title,
  className,
  style,
}) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      setIsTruncated(textRef.current.scrollWidth > textRef.current.clientWidth);
    }
  }, [children]);

  const content = (
    <span
      ref={textRef}
      className={className}
      style={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        display: 'inline-block',
        maxWidth: '100%',
        ...style,
      }}
    >
      {children}
    </span>
  );

  if (isTruncated) {
    return (
      <Tooltip content={title || (typeof children === 'string' ? children : '')}>
        {content}
      </Tooltip>
    );
  }
  return content;
};

export default EllipsisTip;
