import { Input } from '@arco-design/web-react';
import IconFont from '@/components/ui/IconFont';
import classNames from 'classnames';
import React from 'react';
import styles from './index.module.less';

interface SearchProps {
  /**
   * Search callback
   */
  onSearch?: (value: string) => void;
  /**
   * Custom className to override default styles
   */
  className?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Knowledge base search component
 * Contains search input and view toggle buttons
 */
const Search: React.FC<SearchProps> = ({
  onSearch,
  className,
  onChange,
  value,
  placeholder = 'Type here...',
}) => {
  const handleChange = (newValue: string) => {
    onChange(newValue);
  };

  const handleSearch = () => {
    onSearch?.(value);
  };

  return (
    <Input
      className={classNames(styles['input'], className)}
      prefix={<IconFont type="spark-search-line" />}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      onPressEnter={handleSearch}
      allowClear
    />
  );
};

export default Search;
