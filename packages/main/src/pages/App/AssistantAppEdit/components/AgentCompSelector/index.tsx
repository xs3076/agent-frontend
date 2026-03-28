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

const COMPONENT_MAX_LIMIT = defaultSettings.agentAgentComponentMaxLimit;
export default function AgentSelectorComp() {
  const { appState, onAppConfigChange, appCode } =
    useContext(AssistantAppContext);
  const { agent_components = [] as IAppComponentListItem[] } =
    appState.appBasicConfig?.config || {};
  const [state, setState] = useSetState({
    expand: false,
    selectVisible: false,
  });

  const onSelect = (val: IAppComponentListItem[]) => {
    onAppConfigChange({ agent_components: val });
    setState({ selectVisible: false });
  };

  useEffect(() => {
    if (agent_components.length) {
      setState({ expand: true });
    }
  }, [agent_components]);

  const onRemoveAgent = (val: string) => {
    onSelect(agent_components.filter((vItem) => vItem.code !== val));
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
                id: 'main.pages.Component.index.intelligentAgent',
                dm: '智能体',
              })}
            </span>
            <Tooltip content={$i18n.get({
                id: 'main.pages.App.AssistantAppEdit.components.AgentCompSelector.index.configuredAgentApplicationCanBePublishedAsAgentComponent',
                dm: '配置好的智能体应用可发布为智能体组件，从而实现特定场景下的智能处理。',
              })}><IconFont type="spark-question-line" className="cursor-pointer" /></Tooltip>
          </Flex>
          <span
            className="text-[12px] leading-[20px]"
            style={{ color: 'var(--color-text-3)' }}
          >
            {agent_components.length}/{COMPONENT_MAX_LIMIT}
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
              id: 'main.pages.Component.index.intelligentAgent',
              dm: '智能体',
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
          {agent_components.map(
            (item) =>
              item && (
                <SelectedConfigItem
                  key={item.code}
                  icon={<IconFont type="spark-dataAugmentation-line" />}
                  name={item.name!}
                  rightArea={
                    <IconFont
                      type="spark-delete-line"
                      onClick={() => {
                        onRemoveAgent(item.code!);
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
          maxLength={COMPONENT_MAX_LIMIT}
          selected={agent_components}
          onClose={() => {
            setState({ selectVisible: false });
          }}
          type={IAppType.AGENT}
          onSelect={onSelect}
          appCode={appCode || ''}
        />
      )}
    </Flex>
  );
}
