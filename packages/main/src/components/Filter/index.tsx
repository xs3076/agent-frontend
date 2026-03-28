import { Tag } from '@arco-design/web-react';
import styles from './index.module.less';

export interface IFilterProps {
  options: {
    value: string;
    label: string;
  }[];
  value: string;
  onSelect: (value: string, item: any) => void;
}

export default function Filter({ options, value, onSelect }: IFilterProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${styles['filter-selector']}`}>
      {options.map((item) => {
        const isActive = item.value === value;
        return (
          <Tag
            checkable
            checked={isActive}
            onClick={() => {
              if (isActive) return;
              onSelect(item.value, item);
            }}
            key={item.value}
          >
            {item.label}
          </Tag>
        );
      })}
    </div>
  );
}
