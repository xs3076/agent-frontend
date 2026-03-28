import IconFont from '@/components/ui/IconFont';
import { Popover } from '@arco-design/web-react';

import { memo } from 'react';
import styles from './index.module.less';

interface IProps {
  tip: string;
}

export default memo(function InfoIcon(props: IProps) {
  return (
    <Popover content={props.tip} destroyTooltipOnHide>
      <IconFont
        className={styles['info-icon']}
        size="small"
        type="spark-info-line"
      />
    </Popover>
  );
});
