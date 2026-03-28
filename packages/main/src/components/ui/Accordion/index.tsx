import { Collapse } from '@arco-design/web-react';
import React from 'react';

export interface AccordionItem {
  key: string;
  title: React.ReactNode;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultActiveKey?: string[];
  className?: string;
}

const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultActiveKey,
  className,
}) => {
  return (
    <Collapse defaultActiveKey={defaultActiveKey} className={className}>
      {items.map((item) => (
        <Collapse.Item key={item.key} header={item.title} name={item.key}>
          {item.content}
        </Collapse.Item>
      ))}
    </Collapse>
  );
};

export default Accordion;
