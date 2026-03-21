## Context

当前登录页采用背景图片 + 顶部 Header（含 Logo、主题/语言切换）的布局。原型设计采用更简洁的居中卡片式布局，纯浅灰色背景，无顶部导航。需要将现有登录页改造为与原型一致的视觉风格。

当前涉及的文件结构：
- `pages/Login/index.tsx` — 页面入口，包含 Header 和背景容器
- `pages/Login/index.module.less` — 页面级样式（背景图片、固定宽高）
- `pages/Login/components/Login/index.tsx` — 登录表单组件
- `pages/Login/components/Login/index.module.less` — 表单样式
- `pages/Login/components/Form/Email.tsx` / `Password.tsx` — 输入框组件

## Goals / Non-Goals

**Goals:**
- 登录页视觉风格与原型完全一致
- 保持现有登录逻辑（API 调用、表单验证、默认凭据填充）不变
- 保持 i18n 支持
- 保持暗色/亮色主题支持（ConfigProvider 仍通过 PureLayout 提供）

**Non-Goals:**
- 不改动登录 API 和认证逻辑
- 不改动路由配置
- 不改动第三方登录（GitHub）功能逻辑，仅视觉调整
- 不改动其他页面的样式

## Decisions

### 1. 移除 Header，保留 PureLayout
- **选择**：从登录页移除 Header 组件，但保留 PureLayout（提供主题 ConfigProvider）
- **原因**：原型无顶部导航，但仍需要主题配置能力
- **替代方案**：完全移除 PureLayout → 放弃，因为需要 Ant Design 主题配置

### 2. 使用 Flexbox 实现垂直水平居中
- **选择**：页面容器使用 `display: flex; justify-content: center; align-items: center; min-height: 100vh`
- **原因**：简单可靠，无需固定宽高

### 3. 表单标签使用 Form.Item label 属性
- **选择**：通过 Ant Design Form.Item 的 `label` prop 显示"账号"和"密码"标签
- **原因**：复用 Ant Design 内置样式，保持一致性

### 4. 机器人图标使用项目已有的 IconFont
- **选择**：使用项目 IconFont 中的机器人图标，若无合适图标则使用 Ant Design 的 RobotOutlined
- **原因**：保持图标体系一致

### 5. 登录按钮颜色
- **选择**：使用蓝色主题色（#4F46E5 或类似），通过自定义 class 覆盖
- **原因**：与原型视觉一致

## Risks / Trade-offs

- [移除 Header] → 主题和语言切换入口从登录页消失。用户登录后仍可在主界面切换。可接受的取舍。
- [固定文案] → "欢迎回来"和"请登录您的 VAgent 账号"需要 i18n 化。添加对应 i18n key。
