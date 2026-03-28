import IconFont from '@/components/ui/IconFont';
import { Popover, Typography } from '@arco-design/web-react';
import Flex from '@/components/ui/Flex';

import React from 'react';

export default (props: {
  iconType: string;
  name: string;
  description?: string;
  rightArea: React.ReactElement;
  weightInfo?: {
    value: number;
    label: string;
    description: string;
  };
}) => {
  return (
    <Flex
      justify="space-between"
      style={{ background: 'var(--color-fill-3)' }}
      className="w-full height-[32px] rounded-[6px] p-[6px_12px]"
    >
      <Flex
        gap={4}
        className="flex flex-1 items-center title"
        style={{ width: 'calc(100% - 24px)' }}
      >
        <IconFont type={props.iconType} size="small"></IconFont>
        <Typography.Text
          ellipsis={{ tooltip:(props.name) }}
          style={{ color: 'var(--color-text-1)', width: '112px' }}
          className="text-[12px] text-normal leading-[20px]"
        >
          {props.name}
        </Typography.Text>
        <Typography.Text
          style={{
            width: 'calc(100% - 140px)',
            color: 'var(--color-text-3)',
          }}
          ellipsis={{ tooltip:(props?.description || '') }}
        >
          {props?.description}
        </Typography.Text>
        <Popover content={props.weightInfo?.description}>
          <Typography.Text
            style={{
              color: 'var(--color-text-3)',
              fontSize: '12px',
              flexShrink: 0,
              marginRight: '12px',
            }}
          >
            {props.weightInfo?.label}
            {props.weightInfo?.value}
          </Typography.Text>
        </Popover>
      </Flex>
      {props.rightArea}
    </Flex>
  );
};
