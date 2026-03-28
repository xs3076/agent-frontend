import { useStore } from '@/flow/context';
import {
  useNodeDataUpdate,
  useNodesInteraction,
  useNodesReadOnly,
} from '@/hooks';
import $i18n from '@/i18n';
import { IWorkFlowNode } from '@/types/work-flow';
import { Dropdown, Menu, Empty, Input, Tag, Divider, Tooltip, Typography, Message } from '@arco-design/web-react';
import IconButton from '../IconButton';
import IconFont from '../IconFont';
import { useNodes } from '@xyflow/react';
import { useSetState } from 'ahooks';
import { compact } from 'lodash-es';
import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import CustomIcon from '../CustomIcon';
import DragPanel from '../DragPanel';
import FlowIcon from '../FlowIcon';
import PanelContainer from './PanelContainer';

export interface ISingleTestPanel {
  selectedNodeData: IWorkFlowNode;
  onClose: () => void;
  disabled?: boolean;
}

export const ConfigPanel = memo(
  ({
    selectedNode,
    singleTestPanel,
  }: {
    selectedNode: IWorkFlowNode;
    singleTestPanel?: React.ComponentType<ISingleTestPanel>;
  }) => {
    const nodes: IWorkFlowNode[] = useNodes();
    const setSelectedNode = useStore((state) => state.setSelectedNode);
    const getConfigPanel = useStore((state) => state.getConfigPanel);
    const showSingleTest = useStore((state) => state.showSingleTest);
    const setShowSingleTest = useStore((state) => state.setShowSingleTest);
    const { handleNodeDataUpdate } = useNodeDataUpdate();
    const { onNodeCopy, onNodeDelete } = useNodesInteraction();
    const nodeSchemaMap = useStore((state) => state.nodeSchemaMap);
    const { nodesReadOnly } = useNodesReadOnly();
    const [state, setState] = useSetState({
      tempName: '',
      isEditing: false,
    });
    const textAreaRef = useRef<any>(null);

    const selectedNodeData = useMemo(() => {
      return nodes.find((node) => node.id === selectedNode.id);
    }, [nodes, selectedNode.id]);

    const handleClickOperation = useCallback(
      ({ key }: { key: string }) => {
        if (!selectedNodeData) return;
        switch (key) {
          case 'rename':
            setState({
              isEditing: true,
              tempName: selectedNodeData.data.label,
            });
            break;
          case 'copy':
            onNodeCopy(selectedNodeData.id);
            break;
          case 'delete':
            onNodeDelete(selectedNodeData.id);
            break;
          case 'id':
            navigator.clipboard.writeText(selectedNode.id);
            Message.success(
              $i18n.get({
                id: 'spark-flow.components.FlowPanel.ConfigPanel.copySuccess',
                dm: '复制成功',
              }),
            );
            break;
        }
      },
      [selectedNodeData?.id, selectedNodeData?.data.label],
    );

    useEffect(() => {
      setState({
        isEditing: false,
      });
    }, [selectedNodeData?.id]);

    const handleSure = useCallback(() => {
      if (!state.tempName) {
        Message.error(
          $i18n.get({
            id: 'spark-flow.components.FlowPanel.ConfigPanel.enterNodeName',
            dm: '请输入节点名称',
          }),
        );
        return;
      }
      if (
        nodes.some(
          (node) =>
            node.data.label === state.tempName &&
            node.id !== selectedNodeData?.id,
        )
      ) {
        Message.error(
          $i18n.get({
            id: 'spark-flow.components.FlowPanel.ConfigPanel.nodeNameExists',
            dm: '节点名称已存在',
          }),
        );
        return;
      }
      setState({
        isEditing: false,
      });

      handleNodeDataUpdate({
        id: selectedNodeData?.id as string,
        data: {
          label: state.tempName,
        },
      });
    }, [selectedNodeData, handleNodeDataUpdate, nodes, state.tempName]);

    const nodeInfo = useMemo(() => {
      if (!selectedNodeData) return null;
      return nodeSchemaMap[selectedNodeData.type];
    }, [nodeSchemaMap, selectedNodeData?.type]);

    const handleBlur = useCallback(() => {
      if (textAreaRef.current && textAreaRef.current.resizableTextArea) {
        const textArea = textAreaRef.current.resizableTextArea.textArea;
        textArea.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, []);

    if (!selectedNodeData) return null;
    const panelContent = getConfigPanel(selectedNodeData);
    return (
      <DragPanel defaultWidth={480} minWidth={420} maxWidth={720}>
        <PanelContainer
          noPadding
          hiddenRight={state.isEditing}
          headerBottom={
            <Input.TextArea
              ref={textAreaRef}
              value={selectedNodeData.data.desc}
              onChange={(value) =>
                handleNodeDataUpdate({
                  id: selectedNodeData.id,
                  data: { desc: value },
                })
              }
              onBlur={handleBlur}
              style={{ padding: 0, marginTop: 6 }}
              placeholder={$i18n.get({
                id: 'spark-flow.components.FlowPanel.ConfigPanel.enterDescription',
                dm: '添加描述...',
              })}
              autoSize={{ minRows: 1, maxRows: 2 }}
            />
          }
          title={
            <div className="flex gap-[8px] items-center flex-1">
              <FlowIcon nodeType={selectedNodeData.type} />
              {state.isEditing ? (
                <div className="flex gap-[8px] items-center flex-1">
                  <Input
                    value={state.tempName}
                    onChange={(value) => setState({ tempName: value })}
                  />

                  <IconButton
                    className="size-[32px] flex-shrink-0"
                    type="text"
                    onClick={handleSure}
                    icon={<IconFont type="spark-true-line" />}
                  />

                  <IconButton
                    onClick={() => setState({ isEditing: false })}
                    className="size-[32px] flex-shrink-0"
                    type="text"
                    icon={<IconFont type="spark-false-line" />}
                  />
                </div>
              ) : (
                <Typography.Text
                  ellipsis={{ showTooltip: true }}
                  className="spark-flow-panel-title flex-1 w-1"
                >
                  {selectedNodeData.data.label ||
                    $i18n.get({
                      id: 'spark-flow.components.FlowPanel.ConfigPanel.nodeNameConfig',
                      dm: '【节点名称】配置',
                    })}
                </Typography.Text>
              )}
            </div>
          }
          onClose={() => setSelectedNode(null)}
          right={
            <>
              {singleTestPanel &&
                nodeInfo?.allowSingleTest &&
                !nodesReadOnly && (
                  <Tooltip
                    content={$i18n.get({
                      id: 'spark-flow.components.FlowPanel.ConfigPanel.debug',
                      dm: '调试',
                    })}
                  >
                    <div
                      onClick={() => setShowSingleTest(true)}
                      className="spark-flow-operator-icon-with-bg rounded-[6px] size-[32px] cursor-pointer flex-center"
                    >
                      <CustomIcon
                        className="spark-flow-node-action-btn text-[24px]"
                        type="spark-circlePlay-line"
                      />
                    </div>
                  </Tooltip>
                )}
              <Dropdown
                position="br"
                trigger="click"
                getPopupContainer={(ele) => ele}
                droplist={
                  <Menu onClickMenuItem={(key) => handleClickOperation({ key })}>
                    {compact([
                      !nodesReadOnly && { key: 'rename', label: <div className="flex items-center gap-[8px]"><CustomIcon type="spark-edit-line" /><span>{$i18n.get({ id: 'spark-flow.components.FlowPanel.ConfigPanel.rename', dm: '重命名' })}</span></div> },
                      !nodeInfo?.isSystem && !nodesReadOnly && { key: 'copy', label: <div className="flex items-center gap-[8px]"><CustomIcon type="spark-copy-line" /><span>{$i18n.get({ id: 'spark-flow.components.FlowPanel.ConfigPanel.copy', dm: '复制' })}</span></div> },
                      !nodeInfo?.isSystem && !nodesReadOnly && { key: 'delete', label: <div className="flex items-center gap-[8px]"><CustomIcon type="spark-delete-line" /><span>{$i18n.get({ id: 'spark-flow.components.FlowPanel.ConfigPanel.delete', dm: '删除' })}</span></div> },
                      !nodesReadOnly && { type: 'divider' },
                      { key: 'id', label: <div className="flex items-center spark-flow-node-copy-btn gap-[4px]"><Tag className="spark-flow-node-copy-btn-tag" icon={<CustomIcon type="spark-ID-line" />}>{selectedNodeData.id}</Tag><CustomIcon className="spark-flow-node-copy-btn-icon" type="spark-copy-line" /></div> },
                    ]).map((item: any) =>
                      item.type === 'divider' ? (
                        <Menu.Item key="__divider" style={{ height: 1, padding: 0, background: 'var(--color-border-2)', margin: '4px 0', cursor: 'default' }} />
                      ) : (
                        <Menu.Item key={item.key}>{item.label}</Menu.Item>
                      ),
                    )}
                  </Menu>
                }
              >
                <div className="spark-flow-operator-icon-with-bg rounded-[6px] size-[32px] flex-center cursor-pointer">
                  <CustomIcon
                    className="spark-flow-node-action-btn text-[24px]"
                    type="spark-more-line"
                  />
                </div>
              </Dropdown>
              <Divider style={{ margin: 0, height: '20px' }} type="vertical" />
            </>
          }
        >
          {panelContent || (
            <div className="full-center">
              <Empty
                description={$i18n.get({
                  id: 'spark-flow.components.FlowPanel.ConfigPanel.pleaseConfigureFirst',
                  dm: '请先配置',
                })}
              />
            </div>
          )}
          {showSingleTest &&
            singleTestPanel &&
            React.createElement(singleTestPanel, {
              selectedNodeData,
              onClose: () => setShowSingleTest(false),
              disabled: nodesReadOnly,
            })}
        </PanelContainer>
      </DragPanel>
    );
  },
);

const ConfigPanelWrap = memo(
  (props: { singleTestPanel?: React.ComponentType<ISingleTestPanel> }) => {
    const selectedNode = useStore((state) => state.selectedNode);
    if (!selectedNode) return null;
    return (
      <ConfigPanel
        key={selectedNode.id}
        selectedNode={selectedNode}
        singleTestPanel={props.singleTestPanel}
      ></ConfigPanel>
    );
  },
);

export default ConfigPanelWrap;
