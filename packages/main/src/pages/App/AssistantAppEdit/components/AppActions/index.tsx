import $i18n from '@/i18n';
import { channelConfigEventBus } from '@/pages/App/components/ChannelConfig/PublishComponentCard';
import { publishApp } from '@/services/appManage';
import IconFont from '@/components/ui/IconFont';
import {
  Button,
  Checkbox,
  Popover,
  Tooltip,
  Message,
} from '@arco-design/web-react';
import Flex from '@/components/ui/Flex';
import { useSetState } from 'ahooks';

import { useContext } from 'react';
import { AssistantAppContext } from '../../AssistantAppContext';
import AppConfigDiffModal from '../AppConfigDiffModal';
import PublishAppSuccessModal from '../PublishAppSuccessModal';
import styles from './index.module.less';

export default function AppActions(props: {
  activeKey: string;
  updateAppDetailWithInfos: (data: any) => void;
}) {
  const { activeKey } = props;
  const { appState, setAppState, appCode, refreshAppDetail, handleExportSAA } =
    useContext(AssistantAppContext);
  const [state, setState] = useSetState({
    visible: false,
    tip: '',
    code: '',
    checked: false,
    showDiffModal: false,
    showSuccess: false,
  });

  const closeShowDiff = () => {
    setState({ showDiffModal: false });
  };
  const onPublish = () => {
    if (!appCode) return;
    publishApp(appCode).then(() => {
      refreshAppDetail();
      setState({ showSuccess: true });
      setAppState({
        autoSaveTime: '',
        appStatus: 'published',
        historyRefreshCount: appState.historyRefreshCount + 1,
      });
      closeShowDiff();
    });
  };

  const openShowDiff = () => {
    setState({ showDiffModal: true });
  };

  const onConfirm = async () => {
    const { appBasicConfig } = appState;
    if (!appBasicConfig?.name?.trim()) {
      Message.warning(
        $i18n.get({
          id: 'main.pages.App.AssistantAppEdit.components.AppActions.index.enterApplicationName',
          dm: '请填写应用名称',
        }),
      );
      return;
    }
    openShowDiff();
  };

  const beforePublish = () => {
    if (!appState.appBasicConfig) return;
    const { config } = appState.appBasicConfig;
    if (!config.model) {
      Message.warning(
        $i18n.get({
          id: 'main.pages.App.AssistantAppEdit.components.AppActions.index.selectModel',
          dm: '请选择模型！',
        }),
      );
      return;
    }

    const { file_search, instructions: prompt } = config;

    if (file_search?.enable_search) {
      if (!prompt || prompt.match(/\${documents}/g)?.length !== 1) {
        Message.warning(
          $i18n.get({
            id: 'main.pages.App.AssistantAppEdit.components.AppActions.index.knowledgeRetrievalEnhancementFunctionNotFilledOrMultipleVariables',
            dm: '您开启了【知识检索增强】功能，但在Prompt中未填写或者填写了多个${documents}变量，为了保证效果，请保证Prompt中只出现一次',
          }),
        );
        return;
      }
      if (!file_search.kbs?.length) {
        setState({
          visible: true,
          tip: $i18n.get({
            id: 'main.pages.App.AssistantAppEdit.components.AppActions.index.knowledgeRetrievalEnhancementNotAddedKnowledgeBase',
            dm: '已开启知识检索增强，但未添加知识库，检索增强不会生效。是否确定发布？',
          }),
          code: 'no_select_knowledge_tip',
        });
        return;
      }
    }

    onConfirm();
  };

  const onClose = () => {
    setState({ visible: false, checked: false, code: '' });
  };

  const publish = () => {
    onClose();
    onConfirm();
  };

  const handleReset = () => {
    Message.info(
      $i18n.get({
        id: 'main.pages.App.AssistantAppEdit.components.AppActions.index.notImplementedYet',
        dm: '暂未实现',
      }),
    );
  };

  const handleClickAction = (val: string) => {
    setAppState({
      activeKey: 'share',
    });
    setState({ showSuccess: false });
    if (val === 'comp') {
      channelConfigEventBus.emit('openCompCfg');
    }
  };

  return (
    <Flex align="center" justify="flex-end" gap={8}>
      {activeKey === 'config' && (
        <>
          <Tooltip
            trigger={'hover'}
            content={
              appState.flushing
                ? $i18n.get({
                    id: 'main.pages.App.AssistantAppEdit.components.AppActions.index.dialogProcessingProhibitedSwitchVersion',
                    dm: '对话进行中，禁止切换版本',
                  })
                : $i18n.get({
                    id: 'main.components.HistoryPanel.index.historyVersion',
                    dm: '历史版本',
                  })
            }
          >
            <Button
              icon={<IconFont type="spark-auditLog-line" />}
              onClick={() => {
                setAppState((prev) => {
                  return {
                    showHistoryPanel: !prev.showHistoryPanel,
                  };
                });
              }}
              disabled={appState.flushing}
            >
              {$i18n.get({
                id: 'main.pages.App.AssistantAppEdit.components.AppActions.index.versionManagement',
                dm: '版本管理',
              })}
            </Button>
          </Tooltip>
          {appState.selectedVersion === 'draft' ? (
            <>
              <Button
                disabled={appState.saveLoading}
                onClick={handleExportSAA}
              >
                导出SAA工程代码
              </Button>
              <Popover
                onVisibleChange={(val) => {
                  if (!val) onClose();
                }}
                className={styles.confirmWrap}
                trigger="click"
                popupVisible={state.visible}
                content={
                <div className={styles.info}>
                  <IconFont
                    className={styles.warnIcon}
                    type="spark-warningCircle-line"
                  />

                  <div className={styles.tipContent}>
                    <div className={styles.tipText}>{state.tip}</div>
                    <div className={styles.confirmFooter}>
                      <span className={styles.checkWrap}>
                        <Checkbox
                          onChange={(checked) =>
                            setState({ checked })
                          }
                          checked={state.checked}
                        />

                        {$i18n.get({
                          id: 'main.pages.App.AssistantAppEdit.components.AppActions.index.dontPromptAgain',
                          dm: '不再提示',
                        })}
                      </span>
                      <div className={styles.actions}>
                        <Button onClick={() => onClose()}>
                          {$i18n.get({
                            id: 'main.pages.Setting.ModelService.components.ProviderInfoForm.index.cancel',
                            dm: '取消',
                          })}
                        </Button>
                        <Button type="primary" onClick={() => publish()}>
                          {$i18n.get({
                            id: 'main.pages.App.Workflow.index.index.publish',
                            dm: '发布',
                          })}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              }
              rootClassName={styles.confirmWrap111}
            >
              <Button
                icon={<IconFont type="spark-send-line" />}
                onClick={() => {
                  beforePublish();
                }}
                type="primary"
              >
                {$i18n.get({
                  id: 'main.pages.App.Workflow.index.index.publish',
                  dm: '发布',
                })}
              </Button>
            </Popover>
            </>
          ) : (
            <Button
              icon={<IconFont type="spark-processOutput-line" />}
              onClick={async () => {
                if (!appCode) return;
                setAppState({
                  selectedVersion: 'draft',
                  isReleaseVersion: false,
                });
                Message.success(
                  $i18n.get({
                    id: 'main.pages.App.AssistantAppEdit.components.AppActions.index.returnedToCurrentVersion',
                    dm: '已回到当前版本',
                  }),
                );
              }}
            >
              {$i18n.get({
                id: 'main.pages.App.AssistantAppEdit.components.AppActions.index.returnToCurrentVersion',
                dm: '回到当前版本',
              })}
            </Button>
          )}
        </>
      )}
      {state.showDiffModal && appCode && appState.appBasicConfig?.config && (
        <AppConfigDiffModal
          handleReset={handleReset}
          prevConfig={appState.appBasicConfig?.config}
          code={appCode}
          onOk={onPublish}
          onCancel={closeShowDiff}
        />
      )}
      {state.showSuccess && (
        <PublishAppSuccessModal
          onClickAction={handleClickAction}
          onClose={() => setState({ showSuccess: false })}
        />
      )}
    </Flex>
  );
}
