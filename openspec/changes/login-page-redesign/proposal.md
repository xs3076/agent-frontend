## Why

当前登录页使用背景图片和顶部 Header 的布局风格，与新版原型设计（agent2.bizfocus.net）的简洁风格不一致。需要将登录页改造为居中卡片式布局，匹配原型的现代化、简洁设计语言。

## What Changes

- 移除登录页顶部 Header（Logo、主题切换、语言切换）
- 移除背景图片，改为纯浅灰色背景
- 登录卡片居中显示（水平+垂直居中）
- 卡片顶部添加机器人图标
- 标题改为"欢迎回来"，副标题改为"请登录您的 VAgent 账号"
- 表单字段添加标签（"账号"、"密码"）显示在输入框上方
- 添加"记住我"复选框
- 登录按钮改为蓝色全宽圆角样式
- 整体风格更加简洁现代

## Capabilities

### New Capabilities
- `login-page-ui`: 登录页面 UI 重新设计，包括布局、样式、表单结构的全面改造

### Modified Capabilities

## Impact

- `packages/main/src/pages/Login/index.tsx` — 移除 Header 和背景图片容器
- `packages/main/src/pages/Login/index.module.less` — 重写页面级样式
- `packages/main/src/pages/Login/components/Login/index.tsx` — 重构表单结构（添加图标、标题、标签、复选框）
- `packages/main/src/pages/Login/components/Login/index.module.less` — 重写表单样式
- `packages/main/src/pages/Login/components/Form/Email.tsx` — 可能调整图标
- `packages/main/src/pages/Login/components/Form/Password.tsx` — 可能调整图标
