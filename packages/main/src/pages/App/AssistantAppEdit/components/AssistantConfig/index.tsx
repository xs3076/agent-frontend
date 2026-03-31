import defaultSettings from '@/defaultSettings';
import $i18n from '@/i18n';
import { Message } from '@arco-design/web-react';
import Flex from '@/components/ui/Flex';
import { useSetState } from 'ahooks';

import { useContext, useLayoutEffect, useRef } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { isTextModal } from '../..';
import { AssistantAppContext } from '../../AssistantAppContext';
import AgentSelectorComp from '../AgentCompSelector';
import { AssistantPromptEditorWrap } from '../AssistantPromptEditor';
import AssistantTestWindow from '../AssistantTestWindow';
import HistoryPanelComp from '../HistoryPanel/HistoryPanelComp';
import KnowledgeBaseSelectorComp from '../KnowledgeSelectorComp';
import MCPSelectorComp from '../MCPSelectorComp';
import PluginSelectorComp from '../PluginSelectorComp';
import WorkFlowSelectorComp from '../WorkFlowSelectorComp';
import styles from './index.module.less';
import ModelConfig from './modelConfig';

export const RAG_PROMPT_TEMPLATE = $i18n.get({
  id: 'main.pages.App.AssistantAppEdit.components.AssistantConfig.index.knowledgeBaseTip',
  dm: '# 知识库\\n请记住以下材料，他们可能对回答问题有帮助。\\n${documents}',
});

export default function AssistantConfig() {
  const { appState, setAppState, appCode, onAppConfigChange } =
    useContext(AssistantAppContext);
  const { appBasicConfig } = appState;
  const prompt = appBasicConfig?.config.instructions;
  const containerRef = useRef(null as HTMLDivElement | null);
  const [widthLayout, setWidthLayout] = useSetState({
    leftWidth: 38,
    rightWidth: 62,
  });

  const beforeSendValidate = () => {
    if (!appBasicConfig?.config?.model) {
      Message.warning(
        $i18n.get({
          id: 'main.pages.App.AssistantAppEdit.components.AssistantConfig.index.selectModelFirst',
          dm: '请先选择模型！',
        }),
      );
      return false;
    }

    return true;
  };

  const getUniqueId = () => {
    return {
      left: `config_left`,
      right: `config_right`,
    };
  };

  useLayoutEffect(() => {
    if (!isTextModal(appState.modalType)) {
      setWidthLayout({ leftWidth: 33.3, rightWidth: 66.7 });
    } else {
      setWidthLayout({ leftWidth: 38, rightWidth: 62 });
    }
  }, [appState.modalType]);

  // Switch agent version
  const onSelectVersion = async (version: string, index?: number) => {
    if (!appCode) return;
    if (version === 'draft') {
      setAppState({ selectedVersion: 'draft', isReleaseVersion: false });
    } else {
      setAppState({ selectedVersion: version, isReleaseVersion: index === 0 });
    }
  };

  return (
    <div
      id={`agent_${appCode}`}
      ref={containerRef}
      className={styles.container}
    >
      <PanelGroup direction="horizontal" id="assistant-config-v2">
        <Panel
          minSize={25}
          defaultSizePercentage={widthLayout.leftWidth}
          id={getUniqueId().left}
          order={1}
          style={{ overflowY: 'auto' }}
        >
          <div style={{ pointerEvents: appState.readonly ? 'none' : 'auto', opacity: appState.readonly ? 0.6 : 1 }}>
            {/* 模型选择 */}
            <div className="px-[24px] py-[12px] flex items-center justify-between"
              style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>
              <span className="text-[12px] font-medium tracking-wide" style={{ color: 'rgba(0, 0, 0, 0.35)' }}>
                {$i18n.get({
                  id: 'main.pages.App.AssistantAppEdit.components.AssistantConfig.index.apiConfiguration',
                  dm: 'API配置',
                })}
              </span>
              <ModelConfig />
            </div>

            <div className={styles.configScrollContainer}>
              {/* 指令 Section */}
              <div className={styles.configSection}>
                <div className={styles.sectionTitle}>
                  {$i18n.get({
                    id: 'main.pages.App.AssistantAppEdit.components.AssistantConfig.index.instruction',
                    dm: '指令',
                  })}
                </div>
                <AssistantPromptEditorWrap
                  maxTokenContext={defaultSettings.agentSystemPromptMaxLength}
                  appBasicConfig={appBasicConfig}
                  changePrompt={(val) => onAppConfigChange({ instructions: val })}
                  prompt={prompt || ''}
                />
              </div>

              {/* 知识 Section */}
              <div className={styles.configSection}>
                <div className={styles.sectionTitle}>
                  {$i18n.get({
                    id: 'main.pages.App.AssistantAppEdit.components.AssistantConfig.index.knowledge',
                    dm: '知识',
                  })}
                </div>
                <KnowledgeBaseSelectorComp />
              </div>

              {/* 技能 Section */}
              <div className={styles.configSection}>
                <div className={styles.sectionTitle}>
                  {$i18n.get({
                    id: 'main.pages.App.AssistantAppEdit.components.AssistantConfig.index.skill',
                    dm: '技能',
                  })}
                </div>
                <MCPSelectorComp />
                <PluginSelectorComp />
                <AgentSelectorComp />
                <WorkFlowSelectorComp />
              </div>
            </div>
          </div>
        </Panel>
        <PanelResizeHandle className={styles.resizeHandle}>
          <div className={styles.divider1}>
            <img draggable={false} src="/images/panelResizeHandle.svg" alt="" />
          </div>
        </PanelResizeHandle>
        <Panel
          minSize={40}
          defaultSizePercentage={widthLayout.rightWidth}
          order={2}
          id={getUniqueId().right}
        >
          <div className={styles.testWindow}>
            <AssistantTestWindow
              appStatus={appState.appStatus}
              beforeSendValidate={beforeSendValidate}
              maxTokenContext={defaultSettings.agentUserPromptMaxLength}
              assistantId={appCode}
            />
          </div>
        </Panel>
      </PanelGroup>
      {appState.showHistoryPanel && appCode && appBasicConfig && (
        <HistoryPanelComp
          hasInitData
          appDetail={appBasicConfig}
          onSelectVersion={onSelectVersion}
          selectedVersion={appState.selectedVersion}
          onClose={() => {
            setAppState({ showHistoryPanel: false });
          }}
        />
      )}
    </div>
  );
}
