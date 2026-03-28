import { useFlowInteraction } from '@/hooks';
import { useFlowViewPort } from '@/hooks/useFlowViewPort';
import $i18n from '@/i18n';
import { transformToMacKey } from '@/utils';
import { useKeyPress } from 'ahooks';
import { Divider, Dropdown, Menu, Tooltip } from '@arco-design/web-react';
import React, { memo } from 'react';
import CustomIcon from '../CustomIcon';

export default memo(function ScaleBtn() {
  const { handleScale, scaleRate, handleSetScale } = useFlowViewPort();
  const { autoFitView } = useFlowInteraction();

  useKeyPress(
    [`${transformToMacKey('ctrl')}.equalsign`],
    (event) => {
      event.preventDefault();
      handleScale(1);
    },
    { useCapture: true, exactMatch: true },
  );

  useKeyPress(
    [`${transformToMacKey('ctrl')}.dash`],
    (event) => {
      event.preventDefault();
      handleScale(-1);
    },
    {
      useCapture: true,
      exactMatch: true,
    },
  );

  return (
    <>
      <Dropdown
        trigger="click"
        getPopupContainer={(ele) => ele}
        droplist={
          <Menu onClickMenuItem={(key) => {
            if (key === 'fit') {
              autoFitView();
            } else {
              handleSetScale(parseInt(key) / 100);
            }
          }}>
            <Menu.Item key="200">200%</Menu.Item>
            <Menu.Item key="100">100%</Menu.Item>
            <Menu.Item key="50">50%</Menu.Item>
            <Menu.Item key="fit">{$i18n.get({ id: 'spark-flow.components.FlowTools.ScaleBtn.autoView', dm: '自适应试图' })}</Menu.Item>
          </Menu>
        }
      >
        <Tooltip
          content={$i18n.get({
            id: 'spark-flow.components.FlowTools.ScaleBtn.scale',
            dm: '缩放',
          })}
        >
          <div className="spark-flow-tool-icon-btn flex items-center gap-[4px]">
            <div className="p-[6px] h-[32px]">
              <CustomIcon
                onClick={(e) => {
                  e.stopPropagation();
                  handleScale(-1);
                }}
                className="cursor-pointer"
                type="spark-reduce-line"
              />
            </div>
            <span className={'spark-flow-tools-scale-rate'}>{scaleRate}%</span>
            <div className="p-[6px] h-[32px]">
              <CustomIcon
                onClick={(e) => {
                  e.stopPropagation();
                  handleScale(1);
                }}
                className="cursor-pointer text-[20px]"
                type="spark-amplify-line"
              />
            </div>
          </div>
        </Tooltip>
      </Dropdown>
      <Divider type="vertical" className="m-0" />
      <Tooltip
        title={$i18n.get({
          id: 'spark-flow.components.FlowTools.ScaleBtn.autoView',
          dm: '自适应试图',
        })}
      >
        <div
          onClick={autoFitView}
          className="spark-flow-tool-icon-btn size-[32px] flex-center"
        >
          <CustomIcon className="text-[20px]" type="spark-defaultSize-line" />
        </div>
      </Tooltip>
    </>
  );
});
