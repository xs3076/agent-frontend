# Arco Design 全量迁移实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 agent-frontend 从 Ant Design + @spark-ai/design + @spark-ai/chat 全量迁移到 Arco Design，提升 UI 现代感。

**Architecture:** 分层迁移 — 先替换依赖和构建配置，再自建缺失组件，然后从布局到页面逐层替换。spark-flow 包单独处理。@spark-ai/chat 的 ChatAnywhere 组件暂时保留（迁移风险最高），其他 chat 组件用 Arco 替代。

**Tech Stack:** @arco-design/web-react, @arco-design/web-react/icon, react-markdown, rehype-highlight, TailwindCSS (保留)

---

### Task 1: 替换依赖和构建配置 (packages/main)

**Files:**
- Modify: `packages/main/package.json`
- Modify: `packages/main/.umirc.ts`
- Create: `packages/main/src/arco-theme.ts`

- [ ] **Step 1: 修改 packages/main/package.json — 替换依赖**

移除：
```
"antd": "5.23.2"
"@ant-design/icons": "^6.0.0"
"@spark-ai/design": "^1.0.3"
```

添加：
```
"@arco-design/web-react": "^2.68.0"
"react-markdown": "^9.0.0"
"rehype-highlight": "^7.0.0"
```

注意：暂时保留 `@spark-ai/chat`，Task 10 单独处理。

- [ ] **Step 2: 修改 .umirc.ts — 移除 antd 相关配置**

移除 `lessLoader.modifyVars` 中的 `@ant-prefix` 配置。整个 lessLoader 块可以简化为：

```ts
lessLoader: {
  javascriptEnabled: true,
},
```

- [ ] **Step 3: 创建 Arco 主题配置文件**

创建 `packages/main/src/arco-theme.ts`：

```ts
/**
 * Arco Design theme configuration
 * Used in ConfigProvider at the root layout level
 */
export const arcoTheme = {
  // Keep consistent with existing brand colors
  '--color-primary-6': '#722ED1', // purple primary
  '--color-primary-5': '#8B4FD8',
  '--color-primary-4': '#A472DF',
  '--color-primary-3': '#BD95E6',
  '--color-primary-2': '#D6B8ED',
  '--color-primary-1': '#EFDBF4',
  '--border-radius-small': '4px',
  '--border-radius-medium': '6px',
  '--border-radius-large': '8px',
};

/**
 * Toggle dark mode via Arco's built-in mechanism
 */
export function setArcoDarkMode(dark: boolean) {
  if (dark) {
    document.body.setAttribute('arco-theme', 'dark');
  } else {
    document.body.removeAttribute('arco-theme');
  }
}
```

- [ ] **Step 4: 安装依赖**

```bash
cd packages/main && npm install
```

验证：确认 `node_modules/@arco-design/web-react` 存在。

- [ ] **Step 5: 提交**

```bash
git add packages/main/package.json packages/main/.umirc.ts packages/main/src/arco-theme.ts
git commit -m "chore: replace antd with arco-design dependencies and build config"
```

---

### Task 2: 替换依赖和构建配置 (packages/spark-flow)

**Files:**
- Modify: `packages/spark-flow/package.json`

- [ ] **Step 1: 修改 spark-flow/package.json**

在 `dependencies` 中：
- 移除 `"@spark-ai/design": "^1.0.3"`
- 添加 `"@arco-design/web-react": "^2.68.0"`

在 `devDependencies` 中：
- 移除 `"antd": "5.23.2"`

在 `peerDependencies` 中：
- 移除 `"antd": "5.23.2"`
- 添加 `"@arco-design/web-react": ">=2.60.0"`

- [ ] **Step 2: 安装依赖**

```bash
cd packages/spark-flow && npm install
```

- [ ] **Step 3: 提交**

```bash
git add packages/spark-flow/package.json
git commit -m "chore: replace antd with arco-design in spark-flow"
```

---

### Task 3: 自建基础 UI 工具组件

**Files:**
- Create: `packages/main/src/components/ui/IconFont/index.tsx`
- Create: `packages/main/src/components/ui/IconButton/index.tsx`
- Create: `packages/main/src/components/ui/EllipsisTip/index.tsx`
- Create: `packages/main/src/components/ui/AlertDialog/index.tsx`
- Create: `packages/main/src/components/ui/index.ts`

这些组件替代 `@spark-ai/design` 中没有 Arco 直接对应的组件。

- [ ] **Step 1: 创建 IconFont 组件**

`packages/main/src/components/ui/IconFont/index.tsx`:

```tsx
import React from 'react';
import classNames from 'classnames';

export interface IconFontProps {
  type: string;
  size?: 'small' | 'medium' | 'large' | number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
}

const sizeMap = {
  small: 14,
  medium: 16,
  large: 20,
};

/**
 * IconFont component - renders SVG icons from iconfont.cn symbol sprite.
 * The sprite is loaded via /iconfonts/index.js (see Icon/index.tsx).
 */
const IconFont: React.FC<IconFontProps> = ({
  type,
  size = 'medium',
  className,
  style,
  onClick,
}) => {
  const resolvedSize = typeof size === 'number' ? size : sizeMap[size];

  return (
    <svg
      className={classNames('icon', className)}
      style={{
        width: resolvedSize,
        height: resolvedSize,
        fill: 'currentColor',
        verticalAlign: 'middle',
        ...style,
      }}
      onClick={onClick}
      aria-hidden="true"
    >
      <use xlinkHref={`#${type}`} />
    </svg>
  );
};

export default IconFont;
```

- [ ] **Step 2: 创建 IconButton 组件**

`packages/main/src/components/ui/IconButton/index.tsx`:

```tsx
import { Button, ButtonProps } from '@arco-design/web-react';
import React from 'react';
import IconFont from '../IconFont';

export interface IconButtonProps extends Omit<ButtonProps, 'icon'> {
  icon: string | React.ReactNode;
  bordered?: boolean;
}

/**
 * IconButton - a button that renders only an icon.
 * Replaces @spark-ai/design IconButton.
 */
const IconButton: React.FC<IconButtonProps> = ({
  icon,
  bordered = true,
  style,
  ...rest
}) => {
  const iconNode =
    typeof icon === 'string' ? <IconFont type={icon} /> : icon;

  return (
    <Button
      {...rest}
      icon={iconNode}
      style={{
        border: bordered ? undefined : 'none',
        boxShadow: bordered ? undefined : 'none',
        background: bordered ? undefined : 'transparent',
        ...style,
      }}
    />
  );
};

export default IconButton;
```

- [ ] **Step 3: 创建 EllipsisTip 组件**

`packages/main/src/components/ui/EllipsisTip/index.tsx`:

```tsx
import { Tooltip } from '@arco-design/web-react';
import React, { useEffect, useRef, useState } from 'react';

export interface EllipsisTipProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * EllipsisTip - shows a tooltip when text is truncated.
 * Replaces @spark-ai/design EllipsisTip.
 */
const EllipsisTip: React.FC<EllipsisTipProps> = ({
  children,
  title,
  className,
  style,
}) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      setIsTruncated(
        textRef.current.scrollWidth > textRef.current.clientWidth,
      );
    }
  }, [children]);

  const content = (
    <span
      ref={textRef}
      className={className}
      style={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        display: 'inline-block',
        maxWidth: '100%',
        ...style,
      }}
    >
      {children}
    </span>
  );

  if (isTruncated) {
    return (
      <Tooltip content={title || (typeof children === 'string' ? children : '')}>
        {content}
      </Tooltip>
    );
  }

  return content;
};

export default EllipsisTip;
```

- [ ] **Step 4: 创建 AlertDialog 组件**

`packages/main/src/components/ui/AlertDialog/index.tsx`:

```tsx
import { Modal } from '@arco-design/web-react';

export interface AlertDialogOptions {
  title: string;
  content: React.ReactNode;
  onOk?: () => void | Promise<void>;
  onCancel?: () => void;
}

/**
 * AlertDialog - static confirmation dialogs.
 * Replaces @spark-ai/design AlertDialog.
 */
const AlertDialog = {
  warning(options: AlertDialogOptions) {
    return Modal.confirm({
      title: options.title,
      content: options.content,
      onOk: options.onOk,
      onCancel: options.onCancel,
    });
  },
  confirm(options: AlertDialogOptions) {
    return Modal.confirm({
      title: options.title,
      content: options.content,
      onOk: options.onOk,
      onCancel: options.onCancel,
    });
  },
};

export default AlertDialog;
```

- [ ] **Step 5: 创建 barrel export**

`packages/main/src/components/ui/index.ts`:

```ts
export { default as IconFont } from './IconFont';
export type { IconFontProps } from './IconFont';
export { default as IconButton } from './IconButton';
export type { IconButtonProps } from './IconButton';
export { default as EllipsisTip } from './EllipsisTip';
export type { EllipsisTipProps } from './EllipsisTip';
export { default as AlertDialog } from './AlertDialog';
export type { AlertDialogOptions } from './AlertDialog';
```

- [ ] **Step 6: 提交**

```bash
git add packages/main/src/components/ui/
git commit -m "feat: add custom UI components replacing @spark-ai/design specifics"
```

---

### Task 4: 自建 Markdown 组件

**Files:**
- Create: `packages/main/src/components/ui/Markdown/index.tsx`
- Create: `packages/main/src/components/ui/Markdown/index.module.less`
- Create: `packages/main/src/components/ui/Accordion/index.tsx`

- [ ] **Step 1: 创建 Markdown 组件**

`packages/main/src/components/ui/Markdown/index.tsx`:

```tsx
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import styles from './index.module.less';

export interface MarkdownProps {
  content: string;
  className?: string;
}

/**
 * Markdown renderer - replaces @spark-ai/chat Markdown.
 */
const Markdown: React.FC<MarkdownProps> = ({ content, className }) => {
  return (
    <div className={`${styles.markdown} ${className || ''}`}>
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;
```

- [ ] **Step 2: 创建 Markdown 样式**

`packages/main/src/components/ui/Markdown/index.module.less`:

```less
.markdown {
  line-height: 1.6;
  font-size: 14px;
  word-break: break-word;

  h1, h2, h3, h4, h5, h6 {
    margin-top: 16px;
    margin-bottom: 8px;
    font-weight: 600;
  }

  p {
    margin-bottom: 8px;
  }

  code {
    padding: 2px 6px;
    border-radius: 4px;
    background: var(--color-fill-2);
    font-size: 13px;
  }

  pre {
    padding: 12px;
    border-radius: 6px;
    background: var(--color-fill-2);
    overflow-x: auto;

    code {
      padding: 0;
      background: transparent;
    }
  }

  ul, ol {
    padding-left: 20px;
    margin-bottom: 8px;
  }

  blockquote {
    border-left: 3px solid var(--color-primary-6);
    padding-left: 12px;
    color: var(--color-text-3);
    margin: 8px 0;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 8px;

    th, td {
      border: 1px solid var(--color-border);
      padding: 8px 12px;
      text-align: left;
    }

    th {
      background: var(--color-fill-2);
      font-weight: 600;
    }
  }
}
```

- [ ] **Step 3: 创建 Accordion 组件**

`packages/main/src/components/ui/Accordion/index.tsx`:

```tsx
import { Collapse } from '@arco-design/web-react';
import React from 'react';

export interface AccordionItem {
  key: string;
  title: React.ReactNode;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultActiveKey?: string[];
  className?: string;
}

/**
 * Accordion - replaces @spark-ai/chat Accordion.
 */
const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultActiveKey,
  className,
}) => {
  return (
    <Collapse defaultActiveKey={defaultActiveKey} className={className}>
      {items.map((item) => (
        <Collapse.Item key={item.key} header={item.title} name={item.key}>
          {item.content}
        </Collapse.Item>
      ))}
    </Collapse>
  );
};

export default Accordion;
```

- [ ] **Step 4: 更新 barrel export**

在 `packages/main/src/components/ui/index.ts` 追加：

```ts
export { default as Markdown } from './Markdown';
export type { MarkdownProps } from './Markdown';
export { default as Accordion } from './Accordion';
export type { AccordionProps, AccordionItem } from './Accordion';
```

- [ ] **Step 5: 提交**

```bash
git add packages/main/src/components/ui/
git commit -m "feat: add Markdown and Accordion components replacing @spark-ai/chat"
```

---

### Task 5: 迁移根布局 (Pure.tsx + SideMenuLayout + Header + ThemeSelect + LangSelect + SettingDropdown)

**Files:**
- Modify: `packages/main/src/layouts/Pure.tsx`
- Modify: `packages/main/src/layouts/SideMenuLayout.tsx`
- Modify: `packages/main/src/layouts/Header.tsx`
- Modify: `packages/main/src/layouts/ThemeSelect.tsx`
- Modify: `packages/main/src/layouts/LangSelect.tsx`
- Modify: `packages/main/src/layouts/SettingDropdown.tsx`
- Modify: `packages/main/src/layouts/LoginProvider.tsx`

这是最关键的一步 — Pure.tsx 是全局的 ConfigProvider 根节点。

- [ ] **Step 1: 迁移 Pure.tsx**

将 antd 的 ConfigProvider + @spark-ai/design 的 ConfigProvider 替换为 Arco 的 ConfigProvider。

替换前的导入：
```ts
import { ConfigProvider, Empty, purpleDarkTheme, purpleTheme } from '@spark-ai/design';
import { Flex, theme } from 'antd';
import enUS from 'antd/locale/en_US';
import jaJP from 'antd/locale/ja_JP';
import zhCN from 'antd/locale/zh_CN';
```

替换后：
```ts
import { ConfigProvider, Empty } from '@arco-design/web-react';
import enUS from '@arco-design/web-react/es/locale/en-US';
import jaJP from '@arco-design/web-react/es/locale/ja-JP';
import zhCN from '@arco-design/web-react/es/locale/zh-CN';
import '@arco-design/web-react/dist/css/arco.css';
import { setArcoDarkMode } from '@/arco-theme';
```

整个组件重写为：
```tsx
import { iconFontUrl } from '@/components/Icon';
import $i18n from '@/i18n';
import { getGlobalConfig } from '@/services/globalConfig';
import { ConfigProvider, Empty } from '@arco-design/web-react';
import enUS from '@arco-design/web-react/es/locale/en-US';
import jaJP from '@arco-design/web-react/es/locale/ja-JP';
import zhCN from '@arco-design/web-react/es/locale/zh-CN';
import '@arco-design/web-react/dist/css/arco.css';
import { useRequest } from 'ahooks';
import { ErrorBoundary } from 'react-error-boundary';
import styles from './index.module.less';
import { prefersColor } from './ThemeSelect';
import { setArcoDarkMode } from '@/arco-theme';
import { useEffect } from 'react';

const langPreset = $i18n.getCurrentLanguage();

export default function PureLayout(props: {
  children: React.ReactNode | React.ReactNode[];
}) {
  const darkMode = prefersColor.get() === 'dark';
  const locale = {
    zh: zhCN,
    en: enUS,
    ja: jaJP,
  }[langPreset];

  const { loading } = useRequest(getGlobalConfig);

  useEffect(() => {
    setArcoDarkMode(darkMode);
  }, [darkMode]);

  if (loading) return null;

  return (
    <ErrorBoundary
      FallbackComponent={() => <h1>something error</h1>}
    >
      <ConfigProvider locale={locale}>
        <div className={styles['main']}>{props.children}</div>
      </ConfigProvider>
    </ErrorBoundary>
  );
}
```

- [ ] **Step 2: 迁移 SideMenuLayout.tsx**

替换导入：
```ts
// 移除
import { Layout as AntLayout, Menu } from 'antd';
import { AppstoreOutlined, BulbOutlined, ... } from '@ant-design/icons';

// 替换为
import { Layout, Menu } from '@arco-design/web-react';
import {
  IconApps, IconBulb, IconExperiment, IconLineChart,
  IconUnorderedList, IconPlayCircle, IconBarChart,
  IconBranch, IconSettings, IconMenuFold, IconMenuUnfold,
  IconApi, IconStorage, IconTool, IconSwap,
} from '@arco-design/web-react/icon';
```

替换组件用法：

`const { Sider, Content } = AntLayout;` → `const { Sider, Content } = Layout;`

`<AntLayout>` → `<Layout>`

Menu 的 `items` prop 在 Arco 中不直接支持嵌套 items 格式。需要改用 `<Menu.SubMenu>` + `<Menu.Item>` 的 JSX 子组件写法：

```tsx
<Menu
  mode="inline"  // Arco 中改为 mode="pop" 或直接嵌套
  selectedKeys={[selectedKey]}
  defaultOpenKeys={collapsed ? [] : ['studio']}
  onClickMenuItem={handleMenuClick}
  collapse={collapsed}
  style={{ borderRight: 'none', marginTop: 24 }}
>
  <Menu.SubMenu key="studio" title={
    <span><IconApps /> Agent Builder</span>
  }>
    <Menu.Item key="/app"><IconApps /> 应用</Menu.Item>
    <Menu.Item key="/mcp"><IconApi /> MCP</Menu.Item>
    <Menu.Item key="/component"><IconTool /> 组件</Menu.Item>
    <Menu.Item key="/knowledge"><IconStorage /> 知识库</Menu.Item>
    <Menu.Item key="/dify"><IconSwap /> Dify To Graph</Menu.Item>
  </Menu.SubMenu>
  {/* ... other sub menus ... */}
  <Menu.Item key="/setting"><IconSettings /> 设置</Menu.Item>
</Menu>
```

注意 Arco Menu 的关键 API 差异：
- `onClick` → `onClickMenuItem`（回调签名是 `(key: string) => void`）
- `inlineCollapsed` → `collapse`
- Arco `Menu.SubMenu` 用 `title` prop 而非 `label`
- Arco `Menu.Item` 内容直接写在子元素中

Sider 的 API 差异：
- antd `theme="light"` → Arco 不需要（默认 light），通过 className 控制
- antd `collapsedWidth` → Arco `collapsedWidth`（一致）

- [ ] **Step 3: 迁移 Header.tsx**

替换导入：
```ts
// 移除
import { getCommonConfig } from '@spark-ai/design';

// 替换为 — 直接使用 prefersColor
import { prefersColor } from './ThemeSelect';
```

替换用法：
```ts
// 移除
const darkMode = getCommonConfig().isDarkMode;

// 替换为
const darkMode = prefersColor.get() === 'dark';
```

- [ ] **Step 4: 迁移 ThemeSelect.tsx**

替换导入：
```ts
// 移除
import { IconButton } from '@spark-ai/design';

// 替换为
import IconButton from '@/components/ui/IconButton';
import { setArcoDarkMode } from '@/arco-theme';
```

更新 `prefersColor.set()` 方法，在切换时调用 `setArcoDarkMode`：
```ts
set(value: 'light' | 'dark') {
  localStorage.setItem('data-prefers-color', value);
  setArcoDarkMode(value === 'dark');
  location.reload();
},
```

- [ ] **Step 5: 迁移 LangSelect.tsx**

替换导入：
```ts
// 移除
import { Dropdown, IconButton, IconFont } from '@spark-ai/design';
import { MenuProps } from 'antd';

// 替换为
import { Dropdown, Menu } from '@arco-design/web-react';
import IconButton from '@/components/ui/IconButton';
import IconFont from '@/components/ui/IconFont';
```

Arco Dropdown 用法差异 — antd 使用 `menu={{ items, onClick }}`，Arco 使用 `droplist` prop：

```tsx
const droplist = (
  <Menu onClickMenuItem={(key) => {
    $i18n.setCurrentLanguage(key);
    setWorkFlowLanguage(key);
    location.reload();
  }}>
    <Menu.Item key="en">
      <div className="flex items-center gap-[4px]">
        <IconFont type="spark-english02-line" /> English
      </div>
    </Menu.Item>
    <Menu.Item key="zh">
      <div className="flex items-center gap-[4px]">
        <IconFont type="spark-chinese02-line" /> 简体中文
      </div>
    </Menu.Item>
  </Menu>
);

return (
  <Dropdown droplist={droplist} trigger="click">
    {button}
  </Dropdown>
);
```

- [ ] **Step 6: 迁移 SettingDropdown.tsx**

同样的 Dropdown 模式替换，参照 Step 5。

- [ ] **Step 7: 迁移 LoginProvider.tsx**

检查该文件中的 antd 引用并替换。如果只是简单包装器，改动很小。

- [ ] **Step 8: 更新布局相关 LESS 文件**

`packages/main/src/layouts/index.module.less` 中的 `--ag-ant-*` CSS 变量需要替换为 Arco 的 `--color-*` 变量。具体：
- `--ag-ant-color-bg-layout` → `--color-bg-1`
- `--ag-ant-color-bg-base` → `--color-bg-2`
- `--ag-ant-color-border-secondary` → `--color-border`
- `--ag-ant-color-primary` → `--color-primary-6`
- `--ag-ant-color-text-disabled` → `--color-text-4`

- [ ] **Step 9: 验证布局编译通过**

```bash
cd packages/main && npx umi build 2>&1 | head -50
```

预期：可能还有其他文件引用 antd 报错，但布局文件本身应无错误。

- [ ] **Step 10: 提交**

```bash
git add packages/main/src/layouts/ packages/main/src/arco-theme.ts
git commit -m "feat: migrate root layout from antd to arco-design"
```

---

### Task 6: 迁移共享组件

**Files:**
- Modify: `packages/main/src/components/InnerLayout/index.tsx`
- Modify: `packages/main/src/components/Card/ProCard.tsx`
- Modify: `packages/main/src/components/Card/List.tsx`
- Modify: `packages/main/src/components/Search/index.tsx`
- Modify: `packages/main/src/components/SliderInput/index.tsx`
- Modify: `packages/main/src/components/Tag/FileTag.tsx`
- Modify: `packages/main/src/components/Tag/StatusTag.tsx`
- Modify: `packages/main/src/components/TipBox/index.tsx`
- Modify: `packages/main/src/components/ExpandBtn/index.tsx`
- Modify: `packages/main/src/components/Filter/index.tsx`
- Modify: `packages/main/src/components/Table/index.tsx`
- Modify: `packages/main/src/components/AccountModal/index.tsx`
- Modify: `packages/main/src/components/UserAccountModal/index.tsx`
- Modify: `packages/main/src/components/ModelConfigForm/index.tsx`
- Modify: `packages/main/src/components/VariableBaseInput/index.tsx`
- Modify: `packages/main/src/components/VariableBaseInput/FileInput.tsx`

- [ ] **Step 1: 迁移 InnerLayout/index.tsx**

替换导入：
```ts
// 移除
import { Button, IconButton, IconFont, Tabs, TabsProps, Tooltip } from '@spark-ai/design';
import { Breadcrumb, BreadcrumbProps, Flex, Spin } from 'antd';

// 替换为
import { Breadcrumb, Spin, Tooltip } from '@arco-design/web-react';
import type { BreadcrumbProps } from '@arco-design/web-react';
import { Button } from '@arco-design/web-react';
import IconButton from '@/components/ui/IconButton';
import IconFont from '@/components/ui/IconFont';
```

关键 API 差异：
- antd `Tabs` 的 `items` prop → Arco `Tabs` 使用 `<Tabs.TabPane>` 子组件写法，或也支持简化写法
- antd `Tabs` 的 `type="segmented"` → Arco 中用 `type="capsule"` 或 `type="card-gutter"` 最接近
- antd `Flex` → 直接用 `<div className="flex">` （Tailwind）
- antd `Breadcrumb` 的 `items` prop + `itemRender` → Arco `Breadcrumb` 使用 `<Breadcrumb.Item>` 子组件模式
- antd `Spin spinning={loading}` → Arco `Spin loading={loading}`
- antd `Tooltip` 的 `title` prop → Arco `Tooltip` 的 `content` prop
- `Tooltip` 的 `mode="dark"` 不存在于 Arco 中，删除即可

`Tabs` 的 `items` 需要改为 JSX 写法：
```tsx
import { Tabs } from '@arco-design/web-react';

// 渲染 tabs
const renderTabs = () => {
  if (!Array.isArray(tabs)) return null;
  return (
    <Tabs
      activeTab={activeTab}
      onChange={handleTabChange}
      type="capsule"
      destroyOnHide={destroyInactiveTabPanel}
      className={styles.tabs}
    >
      {tabs.map((item: any) => (
        <Tabs.TabPane key={item.key} title={item.label} />
      ))}
    </Tabs>
  );
};
```

Breadcrumb 需要改为 JSX 写法：
```tsx
<Breadcrumb>
  {breadcrumbLinks.map((item, index) => (
    <Breadcrumb.Item key={index}>
      <BreadcrumbItem item={item} navigate={navigate} />
    </Breadcrumb.Item>
  ))}
</Breadcrumb>
```

Tooltip 的 `title` → `content`：
```tsx
<Tooltip content={title} position="bottom">
  {content}
</Tooltip>
```

- [ ] **Step 2: 迁移 Card/ProCard.tsx**

```ts
// 移除
import { Card } from '@spark-ai/design';
// 替换为
import { Card } from '@arco-design/web-react';
```

Arco Card 没有 `hoverable` prop，改用 `hoverable` className 或直接用 CSS：
```tsx
<Card
  className={`${styles.proCard} ${className || ''} ${onClick ? styles.hoverable : ''}`}
  onClick={onClick}
>
```

在 `index.module.less` 中添加：
```less
.hoverable {
  cursor: pointer;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
}
```

- [ ] **Step 3: 迁移 Card/List.tsx**

```ts
// 移除
import { Empty, Pagination } from '@spark-ai/design';
// 替换为
import { Empty, Pagination } from '@arco-design/web-react';
```

Arco Pagination API 与 antd 基本一致，`onChange` 回调签名相同。

- [ ] **Step 4: 迁移 Search/index.tsx**

```ts
// 移除
import { IconFont, Input } from '@spark-ai/design';
// 替换为
import { Input } from '@arco-design/web-react';
import IconFont from '@/components/ui/IconFont';
```

Arco `Input.Search` 可直接替代。

- [ ] **Step 5: 迁移 SliderInput/index.tsx**

```ts
// 移除
import { InputNumber, Slider } from '@spark-ai/design';
// 替换为
import { InputNumber, Slider } from '@arco-design/web-react';
```

- [ ] **Step 6: 迁移 Tag/FileTag.tsx 和 Tag/StatusTag.tsx**

```ts
// 移除
import { Tag, TagProps } from '@spark-ai/design';
import { IconFont, Tag, TagProps } from '@spark-ai/design';
// 替换为
import { Tag } from '@arco-design/web-react';
import type { TagProps } from '@arco-design/web-react';
import IconFont from '@/components/ui/IconFont';
```

Arco Tag 的 `color` prop 支持预设颜色和自定义颜色，与 antd 类似。

- [ ] **Step 7: 迁移其余组件**

对 TipBox、ExpandBtn、Filter、Table、AccountModal、UserAccountModal、ModelConfigForm、VariableBaseInput 执行相同的导入替换模式：

- `from '@spark-ai/design'` 的基础组件 → `from '@arco-design/web-react'`
- `IconFont` → `from '@/components/ui/IconFont'`
- `IconButton` → `from '@/components/ui/IconButton'`
- `AlertDialog` → `from '@/components/ui/AlertDialog'`
- `message` → `import { Message } from '@arco-design/web-react'`（注意 Arco 中是大写 `Message`）
- `notification` → `import { Notification } from '@arco-design/web-react'`
- antd `Form` 的 `onFinish` → Arco `Form` 的 `onSubmit`
- antd `Form.Item` 的 `name` → Arco `Form.Item` 的 `field`

具体差异汇总表（在迁移每个文件时参考）：

| antd | Arco |
|------|------|
| `message.success()` | `Message.success()` |
| `notification.error()` | `Notification.error()` |
| `<Tooltip title="x">` | `<Tooltip content="x">` |
| `<Spin spinning={x}>` | `<Spin loading={x}>` |
| `<Form onFinish={fn}>` | `<Form onSubmit={fn}>` |
| `<Form.Item name="x">` | `<Form.Item field="x">` |
| `<Select onChange={fn}>` | `<Select onChange={fn}>` (一致) |
| `<Modal open={x}>` | `<Modal visible={x}>` |
| `<Drawer open={x}>` | `<Drawer visible={x}>` |
| `<Upload onChange={fn}>` | `<Upload onChange={fn}>` (一致) |
| `<Flex>` | `<div className="flex">` (用 Tailwind) |
| `<Space>` | `<div className="flex gap-2">` (用 Tailwind) |

- [ ] **Step 8: 更新组件的 LESS 文件中的 CSS 变量引用**

所有 `--ag-ant-*` 变量替换为 Arco 对应变量（参见 Task 5 Step 8 的映射表）。

- [ ] **Step 9: 提交**

```bash
git add packages/main/src/components/
git commit -m "feat: migrate all shared components from antd to arco-design"
```

---

### Task 7: 迁移 request 层和 services

**Files:**
- Modify: `packages/main/src/request/request.tsx`
- Modify: `packages/main/src/request/upload.ts` (if uses antd)

- [ ] **Step 1: 迁移 request.tsx**

替换导入：
```ts
// 移除
import { notification, Space } from 'antd';
// 替换为
import { Notification } from '@arco-design/web-react';
```

替换 `notificationError` 函数：
```ts
function notificationError(error: any) {
  Notification.error({
    title: error.response?.data?.code || error.message,
    content: (
      <div className="flex flex-col gap-1">
        <div>{error.response?.data?.message}</div>
        <div>{error.response?.data?.request_id}</div>
      </div>
    ),
  });
}
```

Arco Notification API 差异：
- antd `message` → Arco `title`
- antd `description` → Arco `content`
- antd `className` → Arco `style` 或保留 `className`

- [ ] **Step 2: 检查 upload.ts 的 antd 引用并替换**

- [ ] **Step 3: 提交**

```bash
git add packages/main/src/request/
git commit -m "feat: migrate request layer from antd to arco-design"
```

---

### Task 8: 迁移页面 — App 相关

**Files:**
- Modify: `packages/main/src/pages/App/AppList.tsx`
- Modify: `packages/main/src/pages/App/index.tsx`
- Modify: `packages/main/src/pages/App/components/` (all files)
- Modify: `packages/main/src/pages/App/AssistantAppEdit/` (all files except SparkChat)
- Modify: `packages/main/src/pages/App/Workflow/index.tsx`
- Modify: `packages/main/src/pages/App/Workflow/components/` (all files)
- Modify: `packages/main/src/pages/App/Workflow/nodes/` (all files)

- [ ] **Step 1: 迁移 AppList.tsx**

替换导入：
```ts
// 移除
import { AlertDialog, Button, IconFont, message } from '@spark-ai/design';
// 替换为
import { Button, Message } from '@arco-design/web-react';
import IconFont from '@/components/ui/IconFont';
import AlertDialog from '@/components/ui/AlertDialog';
```

替换 `message.success()` → `Message.success()`。

- [ ] **Step 2: 迁移 App/components/ 目录下所有文件**

对每个文件执行标准导入替换。重点关注：

**CreateModal/index.tsx**:
```ts
// 移除
import { Button, getCommonConfig, message, Modal } from '@spark-ai/design';
// 替换为
import { Button, Message, Modal } from '@arco-design/web-react';
```
- `getCommonConfig()` → 直接使用 `prefersColor.get()` 判断深色模式
- Modal 的 `open` → `visible`

**Card.tsx** (AppCard):
- 同样的模式替换

- [ ] **Step 3: 迁移 AssistantAppEdit/ 目录**

这是最大的页面之一。逐文件替换导入：
- `AssistantAppEdit/index.tsx` — 替换 `Empty, IconFont, renderTooltip` 导入
- `components/AssistantConfig/index.tsx` — 替换 `IconFont`
- `components/AppStatus/index.tsx` — 替换 `EllipsisTip, Tag`
- `components/AppConfigDiffModal/index.tsx` — 替换 `Button, Modal`
- `components/AssistantPromptEditor/editor.tsx` — 替换 `Dropdown, IconFont, SlateEditor, Tag`
- `components/AssistantPromptEditor/Variables/index.tsx` — 替换 `Button, Form, IconFont, Tag`
- `components/VarConfigDrawer/form.tsx` — 替换多个 @spark-ai/design 组件
- `components/HistoryPanel/HistoryPanelComp.tsx` — 替换多个组件
- `components/AssistantTestWindow/index.tsx` — 替换多个组件
- 其余子组件同样模式

**SlateEditor 特殊处理**：
`@spark-ai/design` 的 `SlateEditor` 是一个富文本编辑器。需要分析它在 `AssistantPromptEditor/editor.tsx` 中的具体用法。如果它只是一个简单的 Slate 编辑器封装，可以：
1. 直接安装 `slate` + `slate-react` + `slate-history` 依赖
2. 创建一个简单的编辑器封装在 `src/components/ui/SlateEditor/`
3. 或者如果用法简单，用 Arco 的 `Input.TextArea` 替代

- [ ] **Step 4: 迁移 Workflow/ 目录**

`Workflow/index.tsx` 和 `Workflow/components/` 和 `Workflow/nodes/` — 大量文件，全部执行标准导入替换。

重点关注：
- 所有 `from 'antd'` → `from '@arco-design/web-react'`
- 所有 `from '@spark-ai/design'` → 对应的 Arco 组件 + 自建组件
- antd `Form.Item` 的 `name` → Arco `Form.Item` 的 `field`
- antd `Select` 的 `options` → Arco `Select` 的 `options`（兼容）
- antd `Modal` 的 `open` → Arco `Modal` 的 `visible`

- [ ] **Step 5: 提交**

```bash
git add packages/main/src/pages/App/
git commit -m "feat: migrate App pages from antd to arco-design"
```

---

### Task 9: 迁移页面 — Knowledge, MCP, Setting, Login, Debug, Dify, AgentSchema

**Files:**
- Modify: `packages/main/src/pages/Knowledge/` (all files)
- Modify: `packages/main/src/pages/MCP/` (all files)
- Modify: `packages/main/src/pages/Setting/` (all files)
- Modify: `packages/main/src/pages/Login/` (all files)
- Modify: `packages/main/src/pages/Debug/` (all files)
- Modify: `packages/main/src/pages/Dify/` (all files)
- Modify: `packages/main/src/pages/AgentSchema/` (all files)

- [ ] **Step 1: 迁移 Knowledge 页面**

Knowledge 页面使用了较多 antd 原生组件（Upload, Table, Form）。按标准模式替换。

重点：
- `Knowledge/Create/index.tsx` — Upload 组件，Arco Upload API 基本兼容
- `Knowledge/Editor/index.tsx` — 可能有 antd Table，替换为 Arco Table（API 兼容）
- `Knowledge/Detail/` 系列 — 搜索、列表、切片编辑等

- [ ] **Step 2: 迁移 MCP 页面**

```ts
// MCP/Detail.tsx, MCP/Manage.tsx — 替换 @spark-ai/design 导入
// MCP/components/ — 替换 McpCard, RadioItem, ToolPanel, Overview, McpTools 中的导入
```

MCP/components/ToolPanel/index.tsx 导入较多 @spark-ai/design 组件，逐一替换。

- [ ] **Step 3: 迁移 Setting 页面**

- `Setting/Account/index.tsx` — 使用了 antd Table、Form，替换为 Arco 版本
- `Setting/ModelService/` — Model 配置相关
- `Setting/APIKeys/` — API Key 管理

- [ ] **Step 4: 迁移 Login 页面**

- `Login/index.tsx` — Form + Button
- `Login/components/Login/index.tsx` — Button
- `Login/components/Login/GithubLogin.tsx` — Button
- `Login/components/Form/Password.tsx` — Input + IconFont

- [ ] **Step 5: 迁移 Debug 页面**

Debug 页面组件中直接引用了 antd。逐文件替换。注意 Debug 页面是聊天 UI，与 @spark-ai/chat 有交叉。

- [ ] **Step 6: 迁移 Dify 和 AgentSchema 页面**

- `Dify/index.tsx` — Upload 组件
- `AgentSchema/index.tsx` — 这个文件很大（49K+），大量 antd 组件。需要仔细替换 Form、Select、Input、Button、Table 等。

- [ ] **Step 7: 提交**

```bash
git add packages/main/src/pages/
git commit -m "feat: migrate remaining pages from antd to arco-design"
```

---

### Task 10: 处理 @spark-ai/chat 依赖

**Files:**
- Modify: `packages/main/src/pages/App/AssistantAppEdit/components/SparkChat/` (all files)
- Modify: `packages/main/src/pages/App/Workflow/components/TaskTestPanel/`
- Modify: `packages/main/src/pages/App/Workflow/components/ChatTestPanel/`
- Modify: `packages/main/src/pages/App/Workflow/components/NodeResultPanel/`

`@spark-ai/chat` 提供的 `ChatAnywhere` 是一个完整的聊天 UI 框架（消息列表、输入框、文件上传、卡片系统、消息状态管理）。完全自建替代成本极高。

**策略：暂时保留 @spark-ai/chat，后续独立项目迁移。**

- [ ] **Step 1: 确认 @spark-ai/chat 在 package.json 中保留**

`@spark-ai/chat` 底层依赖 antd。保留意味着 antd 仍会作为间接依赖存在。为了避免冲突：
- 确认 `@spark-ai/chat` 自带的 antd 样式不会与 Arco 冲突
- 如果有冲突，考虑通过 CSS scope 隔离

- [ ] **Step 2: 替换 SparkChat 中 @spark-ai/design 的导入**

SparkChat/index.tsx 中同时使用了 `@spark-ai/chat` 和 `@spark-ai/design`。只替换 `@spark-ai/design` 部分：

```ts
// 移除
import { Button, copy, IconButton, IconFont, message, notification, Tooltip } from '@spark-ai/design';
import { UploadFile } from 'antd';

// 替换为
import { Button, Message, Notification, Tooltip } from '@arco-design/web-react';
import IconButton from '@/components/ui/IconButton';
import IconFont from '@/components/ui/IconFont';
```

`copy` 函数自建或使用 navigator.clipboard.writeText：
```ts
function copy(text: string) {
  navigator.clipboard.writeText(text).catch(() => {
    // fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  });
}
```

`notification.useNotification()` → Arco 中使用 `Notification.info()` 静态方法（不需要 hooks）。

`UploadFile` 类型 — 改为 Arco 的 `UploadItem` 类型或直接用 `any`。

- [ ] **Step 3: 替换 Markdown 导入（非 ChatAnywhere 部分）**

在 TaskTestPanel、NodeResultPanel 中：
```ts
// 移除
import { Markdown } from '@spark-ai/chat';
// 替换为
import Markdown from '@/components/ui/Markdown';
```

注意 props 差异：@spark-ai/chat 的 Markdown 可能接受 `children` 或 `content`，需要检查每个用法。

- [ ] **Step 4: 替换 Accordion 导入**

在 SparkChat/components/Steps/ 中：
```ts
// 移除
import { Accordion } from '@spark-ai/chat';
// 替换为
import Accordion from '@/components/ui/Accordion';
```

需要调整 props 适配新的 Accordion 接口。

- [ ] **Step 5: 提交**

```bash
git add packages/main/src/pages/App/
git commit -m "feat: migrate spark-ai/design imports in chat components, retain spark-ai/chat"
```

---

### Task 11: 迁移 spark-flow 包

**Files:**
- Modify: `packages/spark-flow/src/` (57 files)

- [ ] **Step 1: 批量替换 spark-flow 中的 antd 导入**

模式与 main 包相同：
```ts
// 移除
import { ... } from 'antd';
import { ... } from '@spark-ai/design';

// 替换为
import { ... } from '@arco-design/web-react';
import IconFont from '../../components/ui/IconFont'; // 或定义在 spark-flow 内部
```

由于 spark-flow 是独立 npm 包，不能引用 main 包的组件。需要在 spark-flow 内部也创建 IconFont 等工具组件，或将 IconFont 提取到 spark-i18n 或新的共享包中。

**建议方案**：在 spark-flow 内部创建简单的 `src/components/IconFont/index.tsx`（代码与 main 包相同）。

- [ ] **Step 2: 处理 spark-flow 中 antd 特有组件**

检查 spark-flow 使用的 antd 组件列表：
- Form, Input, Select, Button, Tooltip, Dropdown, Drawer, Modal, Popover, Switch, Radio, Checkbox, InputNumber, Slider
- 全部替换为 Arco 对应组件
- 注意 API 差异（参见 Task 6 Step 7 的差异表）

- [ ] **Step 3: 更新 spark-flow 的 LESS/CSS 变量**

替换所有 `--ag-ant-*` 为 Arco 变量。

- [ ] **Step 4: 构建 spark-flow**

```bash
cd packages/spark-flow && npm run build
```

预期：构建成功，生成 dist/ 目录。

- [ ] **Step 5: 提交**

```bash
git add packages/spark-flow/
git commit -m "feat: migrate spark-flow from antd to arco-design"
```

---

### Task 12: 迁移 legacy 代码

**Files:**
- Modify: `packages/main/src/legacy/` (all files that import antd)

- [ ] **Step 1: 识别 legacy 中的 antd 引用**

```bash
grep -r "from 'antd'" packages/main/src/legacy/ --include="*.tsx" --include="*.jsx" --include="*.ts" -l
```

- [ ] **Step 2: 逐文件替换**

legacy 代码可能使用 antd v5 的旧 API。按标准模式替换。如果 legacy 代码即将被废弃，可以考虑降低优先级。

- [ ] **Step 3: 提交**

```bash
git add packages/main/src/legacy/
git commit -m "feat: migrate legacy code from antd to arco-design"
```

---

### Task 13: 全局清理和验证

**Files:**
- Modify: `package.json` (root)
- Modify: `packages/main/package.json`
- Modify: `packages/main/tailwind.css` (if needed)
- Modify: 所有 `*.module.less` 文件中的 `--ag-ant-*` 变量残留

- [ ] **Step 1: 全局搜索残留引用**

```bash
grep -r "from 'antd'" packages/ --include="*.tsx" --include="*.ts" --include="*.jsx" -l
grep -r "@spark-ai/design" packages/ --include="*.tsx" --include="*.ts" -l
grep -r "@ant-design" packages/ --include="*.tsx" --include="*.ts" -l
grep -r "ag-ant" packages/ --include="*.less" --include="*.css" --include="*.tsx" --include="*.ts" -l
```

预期：除了 @spark-ai/chat 的内部依赖外，不应有任何残留。

- [ ] **Step 2: 清理 CSS 变量残留**

所有 `.module.less` 文件中搜索 `--ag-ant-` 并替换为 Arco 变量。

- [ ] **Step 3: 移除根 package.json 中的 antd 相关依赖**

检查根 `package.json` 是否有 antd 或 @ant-design/icons：
```ts
// 移除
"@ant-design/icons": "^6.0.0",
"antd": "5.23.2",
"@spark-ai/design": "^1.0.3",
```

- [ ] **Step 4: 重新安装所有依赖**

```bash
npm run clear && npm install --ignore-scripts
```

- [ ] **Step 5: 构建 spark-flow**

```bash
npm run build:flow
```

- [ ] **Step 6: 构建 main 应用**

```bash
npm run build:app
```

预期：构建成功，无错误。

- [ ] **Step 7: 启动开发服务器验证**

```bash
npm run dev
```

在浏览器中验证：
1. 布局正确渲染（侧边栏、头部、内容区域）
2. 深色/浅色模式切换正常
3. 语言切换正常
4. App 列表页面可以正常展示
5. 创建/编辑应用正常
6. 工作流编辑器正常加载
7. 知识库、MCP、设置等页面正常

- [ ] **Step 8: 最终提交**

```bash
git add -A
git commit -m "chore: final cleanup - remove all antd residuals, verify build"
```
