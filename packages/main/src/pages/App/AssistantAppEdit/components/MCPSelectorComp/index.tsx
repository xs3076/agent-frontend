import defaultSettings from '@/defaultSettings';
import $i18n from '@/i18n';
import { MCPServerSelectDrawer } from '@/pages/App/components/MCPSelector';
import { IMcpServer } from '@/types/mcp';
import IconFont from '@/components/ui/IconFont';
import { Button, Divider, Tooltip } from '@arco-design/web-react';
import Flex from '@/components/ui/Flex';
import { useSetState } from 'ahooks';

import cls from 'classnames';
import { useContext, useEffect } from 'react';
import { AssistantAppContext } from '../../AssistantAppContext';
import SelectedConfigItem from '../SelectedConfigItem';
import styles from './index.module.less';

export const MCP_MAX_LIMIT = defaultSettings.agentMcpMaxLimit;

export function SelectedMCPItem({
  item,
  handleRemoveMCP,
}: {
  item: IMcpServer;
  handleRemoveMCP: (item: IMcpServer) => void;
}) {
  return (
    <SelectedConfigItem
      icon={<IconFont type="spark-MCP-mcp-line" />}
      name={item.name}
      rightArea={
        <Flex gap={12}>
          <div style={{ color: 'var(--color-text-3)' }}>
            {item.tools?.length}
          </div>
          <IconFont
            type="spark-delete-line"
            onClick={() => {
              handleRemoveMCP(item);
            }}
          ></IconFont>
        </Flex>
      }
    ></SelectedConfigItem>
  );
}

export default function PluginSelectorComp() {
  const { appState, onAppConfigChange } = useContext(AssistantAppContext);
  const { mcp_servers = [] as IMcpServer[] } =
    appState.appBasicConfig?.config || {};
  const [state, setState] = useSetState({
    expand: false,
    selectVisible: false,
  });

  const onSelectMCPs = (val: IMcpServer[]) => {
    onAppConfigChange({ mcp_servers: val });
  };

  useEffect(() => {
    if (mcp_servers.length) {
      setState({ expand: true });
    }
  }, [mcp_servers]);

  const onRemoveMCP = (val: string) => {
    onSelectMCPs(mcp_servers.filter((vItem) => vItem.server_code !== val));
  };

  return (
    <Flex vertical gap={6} className="mb-[20px]">
      <Flex justify="space-between" align="center">
        <Flex
          gap={8}
          className="text-[13px] font-medium leading-[20px]"
          style={{ color: 'var(--color-text-1)' }}
          align="center"
        >
          <Flex align="center">
            <span>
              {$i18n.get({
                id: 'main.components.MCPSelectorComp.index.mcpService',
                dm: 'MCP服务',
              })}
            </span>

            <Tooltip content={$i18n.get({
                id: 'main.components.MCPSelectorComp.index.connectInternalServices',
                dm: '智能体可以通过标准化协议（MCP）连接企业内部服务API并发起调用。',
              })}><IconFont type="spark-question-line" className="cursor-pointer" /></Tooltip>
          </Flex>
          <span
            className="text-[12px] leading-[20px]"
            style={{ color: 'var(--color-text-3)' }}
          >
            {mcp_servers.length}/{MCP_MAX_LIMIT}
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
            MCP
          </Button>
          <Divider type="vertical" className="ml-[16px] mr-[16px]"></Divider>
          <IconFont
            onClick={() => setState({ expand: !state.expand })}
            className={cls(
              styles['expand-btn'],
              !state.expand && styles.hidden,
            )}
            type="spark-up-line"
          />
        </span>
      </Flex>
      {state.expand && (
        <Flex vertical gap={8}>
          {mcp_servers.map(
            (item) =>
              item && (
                <SelectedMCPItem
                  handleRemoveMCP={() => onRemoveMCP(item.server_code)}
                  item={item}
                  key={item.server_code}
                />
              ),
          )}
        </Flex>
      )}
      {state.selectVisible && (
        <MCPServerSelectDrawer
          selectedServers={mcp_servers}
          onOk={onSelectMCPs}
          onClose={() => {
            setState({ selectVisible: false });
          }}
        ></MCPServerSelectDrawer>
      )}
    </Flex>
  );
}
