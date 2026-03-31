import $i18n from '@/i18n';
import { Popover, Tooltip } from '@arco-design/web-react';
import React, { memo, useState } from 'react';
import CustomIcon from '../CustomIcon';
import ShortKeyContent from './ShortKeyContent';

export default memo(function ShortKeyBtn() {
  const [showTip, setShowTip] = useState(false);
  return (
    <Popover
      position="top"
      // @ts-ignore
      arrow={false}
      popupVisible={showTip}
      onVisibleChange={setShowTip}
      content={<ShortKeyContent />}
      trigger="click"
      getPopupContainer={(ele) => ele}
    >
      <Tooltip
        content={$i18n.get({
          id: 'spark-flow.components.FlowTools.ShortKeyBtn.shortcutKeys',
          dm: '快捷键',
        })}
      >
        <div className="spark-flow-tool-icon-btn size-[32px] flex-center">
          <CustomIcon className="text-[20px]" type="spark-keyboard-line" />
        </div>
      </Tooltip>
    </Popover>
  );
});
