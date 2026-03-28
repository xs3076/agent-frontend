import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'umi';
import { Layout, Menu } from '@arco-design/web-react';
import {
  IconApps,
  IconBulb,
  IconExperiment,
  IconLineChart,
  IconUnorderedList,
  IconPlayCircle,
  IconBarChart,
  IconBranch,
  IconSettings,
  IconMenuFold,
  IconMenuUnfold,
  IconLink,
  IconStorage,
  IconTool,
  IconSwap,
} from '@arco-design/web-react/icon';
import $i18n from '@/i18n';
import Header from './Header';
import styles from './index.module.less';
import LangSelect from './LangSelect';
import LoginProvider from './LoginProvider';
import SettingDropdown from './SettingDropdown';
import ThemeSelect from './ThemeSelect';
import UserAccountModal from '@/components/UserAccountModal';
import PureLayout from './Pure';
import { ModelsContext } from '@/legacy/context/models';
import PromptAPI from '@/legacy/services';

const { Sider, Content } = Layout;

// 获取应该高亮的菜单项 key
const getSelectedMenuKey = (pathname: string): string => {
  // 应用相关页面
  if (pathname.startsWith('/app')) {
    return '/app';
  }

  // MCP 相关页面
  if (pathname.startsWith('/mcp')) {
    return '/mcp';
  }

  // 组件相关页面
  if (pathname.startsWith('/component')) {
    return '/component';
  }

  // 知识库相关页面
  if (pathname.startsWith('/knowledge')) {
    return '/knowledge';
  }

  // 设置相关页面
  if (pathname.startsWith('/setting')) {
    return '/setting';
  }

  // 调试页面
  if (pathname.startsWith('/debug')) {
    return '/debug';
  }

  // Dify 转换页面
  if (pathname.startsWith('/dify')) {
    return '/dify';
  }

  // Agent Schema 页面
  if (pathname.startsWith('/agent-schema')) {
    return '/agent-schema';
  }

  // 评测集相关页面
  if (pathname.startsWith('/admin/evaluation/gather')) {
    return '/admin/evaluation/gather';
  }

  // 评估器相关页面
  if (pathname.startsWith('/admin/evaluation/evaluator') || pathname === '/admin/evaluation/debug') {
    return '/admin/evaluation/evaluator';
  }

  // 实验相关页面
  if (pathname.startsWith('/admin/evaluation/experiment')) {
    return '/admin/evaluation/experiment';
  }

  // Prompt 相关页面
  if (
    pathname.startsWith('/admin/prompt') ||
    pathname === '/admin/prompts' ||
    pathname === '/admin/playground' ||
    pathname === '/admin/version-history'
  ) {
    if (pathname === '/admin/playground') {
      return '/admin/playground';
    }
    return '/admin/prompts';
  }

  // Tracing 页面
  if (pathname.startsWith('/admin/tracing')) {
    return '/admin/tracing';
  }

  // 默认情况，直接返回当前路径
  return pathname;
};

export default function SideMenuLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [models, setModels] = useState<any[]>([]);
  const [modelNameMap, setModelNameMap] = useState<Record<number, string>>({});

  // 加载模型列表（用于 legacy 页面）
  useEffect(() => {
    PromptAPI.getModels()
      .then((res) => {
        const nameMap = res.data.pageItems.reduce((acc: Record<number, string>, item: any) => {
          acc[item.id] = item.name;
          return acc;
        }, {});
        setModelNameMap(nameMap);
        setModels(res.data.pageItems);
      })
      .catch((err) => {
        console.error('Failed to load models:', err);
      });
  }, []);

  // 获取应该高亮的菜单项 key
  const selectedKey = useMemo(() => getSelectedMenuKey(location.pathname), [location.pathname]);

  const handleMenuClick = (key: string) => {
    navigate(key);
  };

  // 判断是否应该隐藏侧边栏（登录页、首页等）
  const shouldHideSidebar = ['/login', '/', '/home'].includes(location.pathname);

  if (shouldHideSidebar) {
    return (
      <PureLayout>
        <LoginProvider>
          <Header
            right={
              <>
                <ThemeSelect />
                <LangSelect />
                <SettingDropdown />
                <UserAccountModal avatarProps={{ className: styles.avatar }} />
              </>
            }
          />
          <div className={styles['body']}>{children}</div>
        </LoginProvider>
      </PureLayout>
    );
  }

  return (
    <PureLayout>
      <LoginProvider>
        <ModelsContext.Provider
          value={{
            models,
            modelNameMap,
            setModels,
          }}
        >
          <Layout className="h-screen">
            <Sider
              width={256}
              collapsedWidth={80}
              collapsed={collapsed}
              className="shadow-lg border-r border-gray-200"
              style={{ height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0 }}
            >
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-800 flex items-center whitespace-nowrap overflow-hidden">
                  <IconSettings className="mr-1 text-blue-500" />
                  {!collapsed && 'SAA Admin'}
                </h1>
              </div>

              <Menu
                mode="vertical"
                selectedKeys={[selectedKey]}
                defaultOpenKeys={collapsed ? [] : ['studio']}
                onClickMenuItem={handleMenuClick}
                collapse={collapsed}
                style={{ borderRight: 'none', marginTop: 24 }}
              >
                <Menu.SubMenu
                  key="studio"
                  title={
                    <>
                      <IconApps />
                      {$i18n.get({
                        id: 'main.layouts.SideMenu.studio',
                        dm: ' Agent Builder',
                      })}
                    </>
                  }
                >
                  <Menu.Item key="/app">
                    <IconApps />
                    {$i18n.get({
                      id: 'main.layouts.MenuList.application',
                      dm: '应用',
                    })}
                  </Menu.Item>
                  <Menu.Item key="/mcp">
                    <IconLink /> MCP
                  </Menu.Item>
                  <Menu.Item key="/component">
                    <IconTool />
                    {$i18n.get({
                      id: 'main.pages.Component.AppComponent.index.component',
                      dm: '组件',
                    })}
                  </Menu.Item>
                  <Menu.Item key="/knowledge">
                    <IconStorage />
                    {$i18n.get({
                      id: 'main.pages.Knowledge.Test.index.knowledgeBase',
                      dm: '知识库',
                    })}
                  </Menu.Item>
                  <Menu.Item key="/dify">
                    <IconSwap />
                    {$i18n.get({
                      id: 'main.layouts.SideMenu.dify',
                      dm: 'Dify To Graph',
                    })}
                  </Menu.Item>
                </Menu.SubMenu>

                <Menu.SubMenu
                  key="prompt"
                  title={
                    <>
                      <IconBulb /> Prompt工程
                    </>
                  }
                >
                  <Menu.Item key="/admin/prompts">
                    <IconUnorderedList /> Prompts
                  </Menu.Item>
                  <Menu.Item key="/admin/playground">
                    <IconPlayCircle /> Playground
                  </Menu.Item>
                </Menu.SubMenu>

                <Menu.SubMenu
                  key="evaluation"
                  title={
                    <>
                      <IconExperiment /> 评测
                    </>
                  }
                >
                  <Menu.Item key="/admin/evaluation/gather">
                    <IconUnorderedList /> 评测集
                  </Menu.Item>
                  <Menu.Item key="/admin/evaluation/evaluator">
                    <IconBarChart /> 评估器
                  </Menu.Item>
                  <Menu.Item key="/admin/evaluation/experiment">
                    <IconExperiment /> 实验
                  </Menu.Item>
                </Menu.SubMenu>

                <Menu.SubMenu
                  key="observability"
                  title={
                    <>
                      <IconLineChart /> 可观测
                    </>
                  }
                >
                  <Menu.Item key="/admin/tracing">
                    <IconBranch /> Tracing
                  </Menu.Item>
                </Menu.SubMenu>

                <Menu.Item key="/setting">
                  <IconSettings />
                  {$i18n.get({
                    id: 'main.pages.Setting.ModelService.Detail.setting',
                    dm: '设置',
                  })}
                </Menu.Item>
              </Menu>

              <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
                <div
                  className="flex items-center justify-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setCollapsed(!collapsed)}
                >
                  {collapsed ? (
                    <IconMenuUnfold className="text-gray-600 text-lg" />
                  ) : (
                    <IconMenuFold className="text-gray-600 text-lg" />
                  )}
                  {!collapsed && <span className="ml-2 text-gray-600">收起菜单</span>}
                </div>
              </div>
            </Sider>

            <Layout style={{ marginLeft: collapsed ? 80 : 256, transition: 'margin-left 0.2s' }}>
              <Header
                right={
                  <>
                    <ThemeSelect />
                    <LangSelect />
                    <SettingDropdown />
                    <UserAccountModal avatarProps={{ className: styles.avatar }} />
                  </>
                }
              />
              <Content className="overflow-hidden">
                <div className="h-full overflow-y-auto bg-gray-50" style={{ minHeight: 'calc(100vh - 56px)' }}>
                  {children}
                </div>
              </Content>
            </Layout>
          </Layout>
        </ModelsContext.Provider>
      </LoginProvider>
    </PureLayout>
  );
}
