import { ReactNode } from 'react';

interface FooterAction {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

function FooterActions({ data }: { data: FooterAction[] }) {
  return (
    <div className="flex items-center gap-[4px]">
      {data.map((action, i) => (
        <div
          key={i}
          className="cursor-pointer p-[4px] rounded-[4px] hover:bg-[var(--color-fill-2)] flex items-center gap-[4px]"
          onClick={action.onClick}
        >
          {action.icon}
          {action.label && (
            <span className="text-[12px]" style={{ color: 'var(--color-text-3)' }}>
              {action.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function FooterCount({ data }: { data: [string, number | undefined][] }) {
  return (
    <div className="flex items-center gap-[12px] text-[12px]" style={{ color: 'var(--color-text-3)' }}>
      {data.map(([label, value], i) => (
        <span key={i}>
          {label}: {value ?? '-'}
        </span>
      ))}
    </div>
  );
}

export const DefaultCards = {
  FooterActions,
  FooterCount,
};
