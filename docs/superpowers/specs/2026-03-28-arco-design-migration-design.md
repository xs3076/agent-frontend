# UI 重设计：Ant Design -> Arco Design 全量迁移

## 目标

将 agent-frontend 从 Ant Design v5 + @spark-ai/design + @spark-ai/chat 全量迁移到 Arco Design，同时提升整体 UI 设计质感，走现代极简风格。

## 范围

- **packages/main**（~170 个文件直接引用 antd，~50 个文件引用 @spark-ai/design，~10 个文件引用 @spark-ai/chat）
- **packages/spark-flow**（~57 个文件引用 antd/@spark-ai/design）
- **所有页面**：App、Knowledge、MCP、Setting、Debug、Dify、AgentSchema、Login
- **布局框架**：SideMenuLayout、Header、Pure layout
- **共享组件**：InnerLayout、ProCard、Search、Filter、Tag、TipBox 等

## 技术决策

### 组件映射

直接替换，无适配层。Arco Design 与 Ant Design 组件 API 高度相似。

| 原依赖 | 替换为 |
|--------|--------|
| `antd` | `@arco-design/web-react` |
| `@ant-design/icons` | `@arco-design/web-react/icon` |
| `@spark-ai/design` 的基础组件 | `@arco-design/web-react` 对应组件 |
| `@spark-ai/design` 的特有组件 | 自建组件（见下方） |
| `@spark-ai/chat` | 自建组件 |

### 基础组件 1:1 映射

Button, Input, InputNumber, Select, Modal, Drawer, Form, Table, Tabs, Tag, Tooltip, Dropdown, Slider, Card, Empty, Pagination, Avatar, Spin, Upload, Layout, Menu, message/Message

### 需自建的组件

创建 `src/components/ui/` 目录存放：

1. **IconFont** — 基于 iconfont.cn Symbol 方式，渲染 `<svg><use xlinkHref="#icon-xxx" /></svg>`
2. **IconButton** — Arco Button 封装，icon-only 样式
3. **EllipsisTip** — CSS text-overflow + Arco Tooltip
4. **renderTooltip** — 工具函数
5. **getCommonConfig** — 提取必要配置的工具函数
6. **SlateEditor** — 保留 slate 依赖，自建编辑器封装（替代 @spark-ai/design 的 SlateEditor）
7. **Markdown** — 基于 react-markdown + rehype-highlight
8. **Accordion** — 基于 Arco Collapse 封装
9. **ChatAnywhere** — 自建聊天组件，包含消息列表、输入框、消息气泡

### 样式方案

- 移除 LESS 中的 Ant Design 变量覆盖和 `ag-ant` 前缀
- 使用 Arco Design 的 CSS 变量主题系统
- 保留 TailwindCSS 作为辅助工具类
- Arco 全局样式通过 `@arco-design/web-react/dist/css/arco.css` 引入
- 自定义主题通过 Arco 的 `ConfigProvider` + CSS 变量实现

### 主题配置

Arco Design 的现代极简风格定制：
- 主色调保持项目现有品牌色
- 圆角：6px（与现有一致）
- 间距和排版遵循 Arco 默认体系
- 支持 light/dark 模式（通过 `document.body.setAttribute('arco-theme', 'dark')`）

### 构建配置变更

- `.umirc.ts`：移除 antd 相关配置（`antd` plugin、`ag-ant` 前缀、LESS antd 变量）
- `package.json`：移除 `antd`、`@ant-design/icons`、`@spark-ai/design`、`@spark-ai/chat`，添加 `@arco-design/web-react`、`react-markdown`、`rehype-highlight`
- `spark-flow/package.json`：同样替换依赖

### API 差异处理

关键差异点：
- antd `message.success()` -> Arco `Message.success()`
- antd `Form` `onFinish` -> Arco `Form` `onSubmit`
- antd `Modal.confirm` -> Arco `Modal.confirm`（API 基本一致）
- antd `Tabs` `items` prop -> Arco `Tabs` 使用 `<Tabs.TabPane>` 子组件
- antd `Table` `columns` -> Arco `Table` `columns`（API 基本一致）
- antd `Select` `options` -> Arco `Select` `options`（API 基本一致）
- antd `Layout.Sider` -> Arco `Layout.Sider`（API 基本一致）

### 迁移顺序

1. **基础设施**：依赖替换、构建配置、全局样式、主题
2. **自建组件**：IconFont、IconButton、EllipsisTip、Markdown、ChatAnywhere 等
3. **布局框架**：SideMenuLayout、Header、Pure layout
4. **共享组件**：InnerLayout、ProCard、Card/List、Search、Filter、Tag 等
5. **页面迁移-核心**：App 列表、App 编辑、Workflow 编辑器
6. **页面迁移-辅助**：Knowledge、MCP、Setting、Login
7. **页面迁移-其他**：Debug、Dify、AgentSchema
8. **spark-flow 包**：迁移工作流编辑器内部组件
9. **清理**：移除所有 antd 残留、LESS 变量清理、前缀清理

## 风险

- `@spark-ai/chat` 的 ChatAnywhere 组件功能复杂，自建替代需要仔细分析其 API
- SlateEditor 的 @spark-ai/design 封装可能有定制逻辑，需要深入分析
- spark-flow 包修改后需要重新 build 才能被 main 消费
- legacy 代码（src/legacy/）也引用了 antd，需要一并迁移
