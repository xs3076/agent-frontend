import defaultSettings from '@/defaultSettings';
import $i18n from '@/i18n';
import { IAppType } from '@/services/appComponent';
import { IAppComponentListItem } from '@/types/appComponent';
import IconFont from '@/components/ui/IconFont';
import { Button, Divider, Tooltip } from '@arco-design/web-react';
import Flex from '@/components/ui/Flex';
import { useSetState } from 'ahooks';

import cls from 'classnames';
import { useContext, useEffect } from 'react';
import { AssistantAppContext } from '../../AssistantAppContext';
import ComponentSelectorDrawer from '../ComponentSelectorDrawer';
import SelectedConfigItem from '../SelectedConfigItem';
import styles from './index.module.less';

const MAX_LIMIT = defaultSettings.agentWorkflowComponentMaxLimit;

export default function WorkFlowSelectorComp() {
  const { appState, onAppConfigChange, appCode } =
    useContext(AssistantAppContext);
  const { workflow_components = [] } = appState.appBasicConfig?.config || {};
  const [state, setState] = useSetState({
    expand: false,
    selectVisible: false,
  });

  const onSelect = (val: IAppComponentListItem[]) => {
    onAppConfigChange({ workflow_components: val });
    setState({ selectVisible: false });
  };

  useEffect(() => {
    if (workflow_components.length) {
      setState({ expand: true });
    }
  }, [workflow_components]);

  const onRemove = (val: string) => {
    onSelect(workflow_components.filter((vItem) => vItem.code !== val));
  };

  return (
    <Flex vertical gap={6} className="mb-[20px]">
      <Flex justify="space-between">
        <Flex
          gap={8}
          className="text-[13px] font-medium leading-[20px]"
          style={{ color: 'var(--color-text-1)' }}
          align="center"
        >
          <Flex align="center">
            <span>
              {$i18n.get({
                id: 'main.pages.App.AssistantAppEdit.components.WorkFlowSelectorComp.index.workflow',
                dm: '工作流',
              })}
            </span>

            <Tooltip content={$i18n.get({
                id: 'main.pages.App.AssistantAppEdit.components.WorkFlowSelectorComp.index.workflowDescription',
                dm: '编排好的工作流应用可发布为工作流组件，从而实现复杂、稳定的业务流程。',
              })}><IconFont type="spark-question-line" className="cursor-pointer" /></Tooltip>
          </Flex>
          <span
            className="text-[12px] leading-[24px]"
            style={{ color: 'var(--color-text-3)' }}
          >
            {workflow_components.length}/{MAX_LIMIT}
          </span>
        </Flex>
        <span>
          <Button
            style={{ padding: 0 }}
            onClick={() => setState({ selectVisible: true })}
            icon={<IconFont type="spark-plus-line" />}
            type="text"
            size="small"
          >
            {$i18n.get({
              id: 'main.pages.App.AssistantAppEdit.components.WorkFlowSelectorComp.index.workflow',
              dm: '工作流',
            })}
          </Button>
          <Divider type="vertical" className="ml-[16px] mr-[16px]"></Divider>
          <IconFont
            onClick={() => setState({ expand: !state.expand })}
            className={cls(styles.expandBtn, !state.expand && styles.hidden)}
            type="spark-up-line"
          />
        </span>
      </Flex>
      {state.expand && (
        <Flex vertical gap={8}>
          {workflow_components.map(
            (item) =>
              item && (
                <SelectedConfigItem
                  key={item.code}
                  icon={<IconFont type="spark-processJudgment-line" />}
                  name={item.name!}
                  rightArea={
                    <IconFont
                      type="spark-delete-line"
                      onClick={() => {
                        onRemove(item.code!);
                      }}
                    ></IconFont>
                  }
                />
              ),
          )}
        </Flex>
      )}
      {state.selectVisible && (
        <ComponentSelectorDrawer
          maxLength={MAX_LIMIT}
          selected={workflow_components}
          onClose={() => {
            setState({ selectVisible: false });
          }}
          type={IAppType.WORKFLOW}
          onSelect={onSelect}
          appCode={appCode || ''}
        />
      )}
    </Flex>
  );
}
