# M-Team 移动版前端项目

基于 Vue 3 + Vite 开发的 M-Team Private Tracker 移动端网站。

## 技术栈

- **框架**: Vue 3 (JavaScript)
- **构建工具**: Vite 5.4.10
- **路由**: Vue Router 4
- **状态管理**: Pinia
- **样式**: Tailwind CSS 3.4
- **测试**: Vitest
- **代码规范**: ESLint + Prettier

## 项目特色

- 🎨 蓝色调亮色主题设计
- 📱 专为手机端优化的响应式布局
- 🔐 完整的登录表单UI（含密码显示/隐藏、表单验证）
- 🧭 Router 路由配置
- 📦 Pinia 状态管理
- ✨ 现代化的用户界面

## 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 运行测试
```bash
npm run test
```

### 代码检查
```bash
npm run lint
```

### 代码格式化
```bash
npm run format
```

## 项目结构

```
frontend/
├── src/
│   ├── assets/          # 静态资源
│   │   └── main.css     # 主样式文件（含Tailwind CSS）
│   ├── components/      # 通用组件
│   ├── composables/     # Vue 组合式函数
│   ├── router/          # 路由配置
│   │   └── index.js
│   ├── stores/          # Pinia 状态管理
│   │   └── auth.js      # 认证状态
│   ├── utils/           # 工具函数
│   ├── views/           # 页面组件
│   │   ├── LoginView.vue # 登录页面
│   │   └── HomeView.vue  # 首页
│   ├── App.vue          # 根组件
│   └── main.js          # 入口文件
├── public/              # 公共静态资源
├── tailwind.config.js   # Tailwind CSS 配置
├── postcss.config.js    # PostCSS 配置
├── vite.config.js       # Vite 配置
└── package.json
```

## 功能特性

### 已实现
- ✅ 项目基础架构搭建
- ✅ 登录页面UI（表单验证、密码显示切换、记住我选项）
- ✅ 首页布局
- ✅ Vue Router 路由配置
- ✅ Pinia 状态管理（用户认证）
- ✅ Tailwind CSS 样式系统
- ✅ 蓝色主题配色
- ✅ 手机端响应式设计

### 待实现
- ⏳ API 接口集成
- ⏳ OTP 双因素认证
- ⏳ 种子列表页面
- ⏳ 种子详情页面
- ⏳ 个人中心

## 开发说明

1. 项目已配置了 ESLint 和 Prettier 用于代码规范
2. 使用 Tailwind CSS 进行样式开发，主色调为蓝色
3. 组件开发遵循 Vue 3 Composition API
4. 状态管理使用 Pinia store
5. 所有页面都针对手机端进行了优化

## 浏览器兼容性

支持所有现代浏览器，包括：
- Chrome 87+
- Firefox 78+
- Safari 14+
- Edge 88+

## 注意事项

- 当前项目在 Node.js 18.20.8 环境下开发，推荐使用 Node.js 18+ 版本
- 登录功能目前仅为UI展示，实际API调用需要后续开发
- 项目已经通过 `npm run build` 和 `npm run dev` 测试，确保无报错