import $i18n from '@/i18n';
import { IBranchItem } from '@/types/work-flow';
import { Select, Message, Input, Typography } from '@arco-design/web-react';
import IconFont from '../IconFont';
import { useSetState } from 'ahooks';
import React, { memo, useCallback, useRef } from 'react';
import './index.less';

export interface IBranchTitleHeaderProps {
  data: IBranchItem;
  onChange: (data: Partial<IBranchItem>) => void;
  deleteBranchItem: () => void;
  branches: IBranchItem[];
  disabled?: boolean;
}

export default memo(function BranchTitleHeader(props: IBranchTitleHeaderProps) {
  const [state, setState] = useSetState({
    isEdit: false,
    tempName: props.data.label,
  });
  const isComposingRef = useRef(false);

  const handleSure = () => {
    if (!state.tempName) {
      Message.warning(
        $i18n.get({
          id: 'spark-flow.BranchTitleHeader.index.conditionGroupNameEmpty',
          dm: '条件组名称不能为空',
        }),
      );
      return;
    }
    if (
      props.branches.some(
        (item) => item.label === state.tempName && item.id !== props.data.id,
      )
    ) {
      Message.warning(
        $i18n.get({
          id: 'spark-flow.BranchTitleHeader.index.conditionGroupNameExists',
          dm: '条件组名称已存在',
        }),
      );
      return;
    }
    props.onChange({ label: state.tempName });
    setState({ isEdit: false });
  };

  // handle Chinese input start event
  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true;
  }, []);

  // handle Chinese input end event
  const handleCompositionEnd = useCallback(() => {
    isComposingRef.current = false;
  }, []);

  // handle enter event
  const handlePressEnter = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // if Chinese input is ongoing, do not handle enter event
      if (isComposingRef.current) {
        return;
      }

      // trigger confirm operation
      handleSure();

      // prevent default behavior (such as form submission)
      e.preventDefault();
    },
    [handleSure],
  );

  return (
    <div style={{display:"flex",justifyContent:"space-between"}}>
      {state.isEdit ? (
        <div className="flex-1 flex gap-[8px] items-center">
          <Input
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            onPressEnter={handlePressEnter}
            value={state.tempName}
            onChange={(value) => setState({ tempName: value })}
            placeholder={$i18n.get({
              id: 'spark-flow.BranchTitleHeader.index.enterConditionGroupName',
              dm: '请输入条件组名称',
            })}
          />

          <IconFont
            onClick={handleSure}
            isCursorPointer
            className="spark-flow-name-input-ok-btn"
            type="spark-true-line"
          />

          <IconFont
            onClick={() =>
              setState({ isEdit: false, tempName: props.data.label })
            }
            isCursorPointer
            type="spark-false-line"
          />
        </div>
      ) : (
        <>
          <div className="flex items-center gap-[16px]">
            <Typography.Text
              ellipsis={{ showTooltip: true }}
              style={{ maxWidth: 120 }}
              className="spark-flow-panel-form-title"
            >
              {props.data.label}
            </Typography.Text>
            <div className="flex items-center gap-[4px]">
              <span>
                {$i18n.get({
                  id: 'spark-flow.BranchTitleHeader.index.whenSatisfy',
                  dm: '当满足以下',
                })}
              </span>
              <Select
                disabled={props.disabled}
                className="spark-flow-logic-selector"
                value={props.data.logic}
                onChange={(val) => props.onChange({ logic: val })}
                options={[
                  {
                    label: $i18n.get({
                      id: 'spark-flow.BranchTitleHeader.index.all',
                      dm: '所有',
                    }),
                    value: 'and',
                  },
                  {
                    label: $i18n.get({
                      id: 'spark-flow.BranchTitleHeader.index.any',
                      dm: '任意',
                    }),
                    value: 'or',
                  },
                ]}
                bordered={false}
                size="small"
              />

              <span>
                {$i18n.get({
                  id: 'spark-flow.BranchTitleHeader.index.conditions',
                  dm: '条件时',
                })}
              </span>
            </div>
          </div>
          <div className="flex gap-[12px]">
            <IconFont
              className={props.disabled ? 'disabled-icon-btn' : ''}
              onClick={() => {
                if (props.disabled) return;
                setState({
                  isEdit: true,
                  tempName: props.data.label,
                });
              }}
              size="small"
              isCursorPointer={!props.disabled}
              type="spark-edit-line"
            />

            <IconFont
              onClick={props.disabled ? void 0 : props.deleteBranchItem}
              className={props.disabled ? 'disabled-icon-btn' : ''}
              size="small"
              isCursorPointer={!props.disabled}
              type="spark-delete-line"
            />
          </div>
        </>
      )}
    </div>
  );
});
