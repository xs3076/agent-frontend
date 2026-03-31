import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Layout as ArcoLayout } from '@arco-design/web-react';
import { IconBulb, IconExperiment, IconDashboard, IconUnorderedList, IconPlayCircle, IconBranch, IconSettings, IconMenuFold, IconMenuUnfold } from '@arco-design/web-react/icon';

const { Sider, Content } = ArcoLayout;
const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

// 获取应该高亮的菜单项 key
const getSelectedMenuKey = (pathname) => {
  // 移除 /admin 前缀进行匹配
  const path = pathname.replace(/^\/admin/, '') || '/';

  // 评测集相关页面
  if (path.startsWith('/evaluation/gather')) {
    return '/admin/evaluation/gather';
  }

  // 评估器相关页面
  if (path.startsWith('/evaluation/evaluator') || path === '/evaluation/debug') {
    return '/admin/evaluation/evaluator';
  }

  // 实验相关页面
  if (path.startsWith('/evaluation/experiment')) {
    return '/admin/evaluation/experiment';
  }

  // Prompt 相关页面
  if (path.startsWith('/prompt') || path === '/prompts' || path === '/playground' || path === '/version-history') {
    if (path === '/playground') {
      return '/admin/playground';
    }
    if (path === '/version-history') {
      return '/admin/prompts';
    }
    return '/admin/prompts';
  }

  // Tracing 页面
  if (path.startsWith('/tracing')) {
    return '/admin/tracing';
  }

  // 默认情况，直接返回当前路径
  return pathname;
};

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const selectedKey = getSelectedMenuKey(location.pathname);

  const handleMenuClick = (key) => {
    navigate(key);
  };

  return (
    <ArcoLayout className="h-screen">
      <Sider
        width={256}
        collapsedWidth={80}
        collapsed={collapsed}
        theme="light"
        className="shadow-lg border-r border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800 flex items-center whitespace-nowrap overflow-hidden">
            <IconSettings className="mr-1 text-blue-500" />
            {!collapsed && "SAA Admin"}
          </h1>
        </div>

        <Menu
          mode="vertical"
          selectedKeys={[selectedKey]}
          defaultOpenKeys={collapsed ? [] : ['prompt', 'evaluation', 'observability']}
          onClickMenuItem={handleMenuClick}
          className="border-r-0 mt-6"
          collapse={collapsed}
        >
          <SubMenu key="prompt" title={<><IconBulb /> Prompt工程</>}>
            <MenuItem key="/admin/prompts"><IconUnorderedList /> Prompts</MenuItem>
            <MenuItem key="/admin/playground"><IconPlayCircle /> Playground</MenuItem>
          </SubMenu>
          <SubMenu key="evaluation" title={<><IconExperiment /> 评测</>}>
            <MenuItem key="/admin/evaluation/gather"><IconUnorderedList /> 评测集</MenuItem>
            <MenuItem key="/admin/evaluation/evaluator"><IconDashboard /> 评估器</MenuItem>
            <MenuItem key="/admin/evaluation/experiment"><IconExperiment /> 实验</MenuItem>
          </SubMenu>
          <SubMenu key="observability" title={<><IconDashboard /> 可观测</>}>
            <MenuItem key="/admin/tracing"><IconBranch /> Tracing</MenuItem>
          </SubMenu>
        </Menu>

        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
          <div
            className="flex items-center justify-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ?
              <IconMenuUnfold className="text-gray-600 text-lg" /> :
              <IconMenuFold className="text-gray-600 text-lg" />
            }
            {!collapsed && <span className="ml-2 text-gray-600">收起菜单</span>}
          </div>
        </div>
      </Sider>

      <Content className="overflow-hidden">
        <div className="h-full overflow-y-auto bg-gray-50">
          {children}
        </div>
      </Content>
    </ArcoLayout>
  );
};

export default Layout;
