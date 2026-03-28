import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import React from 'react';
import styles from './index.module.less';

export interface MarkdownProps {
  content: string;
  className?: string;
}

const Markdown: React.FC<MarkdownProps> = ({ content, className }) => {
  return (
    <div className={`${styles.markdown} ${className || ''}`}>
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;
