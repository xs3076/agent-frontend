## 1. 页面布局改造

- [x] 1.1 修改 `pages/Login/index.tsx`：移除 Header 组件，保留 PureLayout，简化页面结构
- [x] 1.2 重写 `pages/Login/index.module.less`：移除背景图片，改为浅灰色背景 + Flexbox 居中布局

## 2. 登录卡片重构

- [x] 2.1 修改 `components/Login/index.tsx`：添加机器人图标、"欢迎回来"标题、"请登录您的 VAgent 账号"副标题
- [x] 2.2 修改 `components/Login/index.tsx`：给 Form.Item 添加 label（"账号"、"密码"）
- [x] 2.3 修改 `components/Login/index.tsx`：添加"记住我"复选框
- [x] 2.4 重写 `components/Login/index.module.less`：卡片样式（白色背景、圆角、阴影）、标题样式、按钮蓝色全宽样式

## 3. 输入框组件调整

- [x] 3.1 检查并调整 Email 和 Password 组件的图标，确保与原型一致（邮件图标、锁图标）

## 4. i18n 支持

- [x] 4.1 添加新增文案的 i18n key（欢迎回来、请登录您的 VAgent 账号、账号、密码、记住我）
