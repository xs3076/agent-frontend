import { Select, Typography } from '@arco-design/web-react';
import type { SelectProps } from '@arco-design/web-react';
import React, { memo } from 'react';
import './index.less';

export default memo(function SelectWithDesc(props: SelectProps) {
  return (
    <Select
      {...props}
      renderFormat={(option) => {
        return option?.children || option?.value;
      }}
    >
      {(props.options || []).map((item: any) => (
        <Select.Option key={item.value} value={item.value}>
          <div className={'spark-flow-select-with-desc-item'}>
            <div>{item.label}</div>
            {!!item.desc && (
              <Typography.Paragraph
                ellipsis={{
                  rows: 2,
                  showTooltip: true,
                }}
                className={'spark-flow-select-with-desc-item-desc'}
              >
                {item.desc}
              </Typography.Paragraph>
            )}
          </div>
        </Select.Option>
      ))}
    </Select>
  );
});
