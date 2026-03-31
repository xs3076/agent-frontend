import React, { useRef, useEffect } from 'react';

interface CodeBlockProps {
  value?: string;
  language?: string;
  theme?: 'dark' | 'light' | string;
  readOnly?: boolean;
  className?: string;
  onChange?: (value: string) => void;
}

/**
 * Stub CodeBlock component replacing @spark-ai/design CodeBlock.
 * Renders a simple <pre><code> block with optional editing support.
 */
const CodeBlock: React.FC<CodeBlockProps> = ({
  value = '',
  language,
  theme,
  readOnly = true,
  className,
  onChange,
}) => {
  const preRef = useRef<HTMLPreElement>(null);

  const isDark = theme === 'dark';

  const style: React.CSSProperties = {
    padding: '12px 16px',
    borderRadius: 6,
    fontSize: 13,
    lineHeight: 1.6,
    overflow: 'auto',
    margin: 0,
    backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5',
    color: isDark ? '#d4d4d4' : '#333',
    border: '1px solid var(--color-border-2, #e5e5e5)',
    fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace",
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  };

  const handleInput = () => {
    if (onChange && preRef.current) {
      onChange(preRef.current.textContent || '');
    }
  };

  useEffect(() => {
    if (preRef.current && preRef.current.textContent !== value) {
      preRef.current.textContent = value;
    }
  }, [value]);

  if (!readOnly && onChange) {
    return (
      <pre
        ref={preRef}
        className={className}
        style={style}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-language={language}
      >
        {value}
      </pre>
    );
  }

  return (
    <pre className={className} style={style} data-language={language}>
      <code>{value}</code>
    </pre>
  );
};

export default CodeBlock;
