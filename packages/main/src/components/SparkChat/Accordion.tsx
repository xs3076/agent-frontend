import { Collapse, Spin } from '@arco-design/web-react';
import { IconCheck, IconClose, IconMinus } from '@arco-design/web-react/icon';
import { useState } from 'react';

interface AccordionStepItem {
  icon?: React.ReactNode;
  title?: string;
  children?: React.ReactNode;
}

interface AccordionProps {
  title?: string;
  status?: 'finished' | 'generating' | 'interrupted' | 'error';
  steps?: AccordionStepItem[];
  defaultOpen?: boolean;
}

const StatusIcon = ({ status }: { status?: string }) => {
  if (status === 'finished') return <IconCheck style={{ color: 'var(--color-success-6)' }} />;
  if (status === 'generating') return <Spin size={14} />;
  if (status === 'interrupted') return <IconMinus style={{ color: 'var(--color-warning-6)' }} />;
  if (status === 'error') return <IconClose style={{ color: 'var(--color-danger-6)' }} />;
  return null;
};

export default function Accordion(props: AccordionProps) {
  const { title, status, steps = [], defaultOpen = false } = props;
  const [expanded, setExpanded] = useState(defaultOpen);

  if (!steps.length) return null;

  return (
    <div className="mb-[8px]">
      <div
        className="flex items-center gap-[6px] cursor-pointer py-[4px] text-[13px]"
        style={{ color: 'var(--color-text-2)' }}
        onClick={() => setExpanded(!expanded)}
      >
        <StatusIcon status={status} />
        <span>{title}</span>
        <span
          className="transition-transform"
          style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          ▸
        </span>
      </div>
      {expanded && (
        <Collapse bordered={false} defaultActiveKey={steps.map((_, i) => String(i))}>
          {steps.map((step, index) => (
            <Collapse.Item
              key={index}
              name={String(index)}
              header={
                <div className="flex items-center gap-[6px]">
                  {step.icon}
                  <span>{step.title}</span>
                </div>
              }
            >
              {step.children}
            </Collapse.Item>
          ))}
        </Collapse>
      )}
    </div>
  );
}
