# SignAI - 手语智能翻译平台

<div align="center">

一个基于 AI 技术的手语翻译平台，为听障人士打造的无障碍交流工具

[在线演示](https://www.miaoda.cn/projects/app-71w5z1brvnk1) | [功能文档](./docs/FEATURES.md) | [需求文档](./docs/prd.md)

</div>

## ✨ 项目介绍

SignAI 是一个创新的手语智能翻译平台，旨在消除听障人士与健听人士之间的沟通障碍。通过先进的 Web 技术和 Mock 数据演示，实现了文字、语音和手语之间的无缝转换。

### 核心功能

- 🔤 **文字转手语** - 输入文字，自动生成对应的手语视频
- 🎤 **语音转手语** - 实时语音识别，自动转换为手语视频
- 👋 **手语转文字语音** - 录制/上传手语视频，识别并转换为文字和语音

### 项目特色

- ✅ 完全基于浏览器，无需安装额外软件
- ✅ 实时语音识别技术（Web Speech API）
- ✅ 支持视频录制和上传
- ✅ Mock 数据演示，支持多种词汇和古诗词
- ✅ 美观的 UI 界面，良好的用户体验

## 📁 目录结构

```
sign-ai/
├── README.md                 # 说明文档
├── docs/                     # 文档目录
│   ├── FEATURES.md          # 功能说明文档
│   └── prd.md               # 产品需求文档
├── public/                   # 静态资源目录
│   ├── video/               # 手语视频文件
│   │   ├── hello.mp4        # 你好
│   │   ├── thank.mp4        # 谢谢
│   │   ├── bye.mp4          # 再见
│   │   ├── eat.mp4          # 吃饭
│   │   ├── sleep.mp4        # 睡觉
│   │   ├── love.mp4         # 我爱你
│   │   ├── data1.mp4        # 古诗词1
│   │   ├── data2.mp4        # 古诗词2
│   │   └── data3.mp4        # 古诗词3
│   └── images/              # 图片资源
├── src/                      # 源码目录
│   ├── pages/               # 页面目录
│   │   ├── Home.tsx         # 首页
│   │   ├── TextToSign.tsx   # 文字转手语
│   │   ├── VoiceToSign.tsx  # 语音转手语
│   │   └── SignToText.tsx   # 手语转文字语音
│   ├── components/          # 组件目录
│   │   ├── ui/              # UI 组件库（shadcn/ui）
│   │   └── common/          # 通用组件
│   ├── services/            # API 服务
│   │   └── signLanguageApi.ts  # 手语 API
│   ├── utils/               # 工具函数
│   │   └── audioUtils.ts    # 音频处理工具
│   ├── types/               # TypeScript 类型定义
│   ├── hooks/               # 自定义 Hooks
│   ├── lib/                 # 工具库
│   └── routes.tsx           # 路由配置
├── package.json             # 项目配置
├── vite.config.ts           # Vite 配置
└── tailwind.config.js       # Tailwind CSS 配置
```

## 🛠️ 技术栈

### 前端框架
- ⚡ **Vite** - 下一代前端构建工具
- ⚛️ **React 18** - 用户界面库
- 📘 **TypeScript** - 类型安全的 JavaScript

### UI 框架
- 🎨 **Tailwind CSS** - 实用优先的 CSS 框架
- 🧩 **shadcn/ui** - 精美的 React 组件库
- 🎭 **Lucide React** - 图标库

### 核心技术
- 🎤 **Web Speech API (SpeechRecognition)** - 浏览器原生语音识别
- 🔊 **Speech Synthesis API** - 浏览器原生文字转语音
- 📹 **MediaRecorder API** - 视频录制
- 🎬 **HTML5 Video** - 视频播放

### 路由和状态
- 🛣️ **React Router** - 客户端路由
- 📦 **React Hooks** - 状态管理

### 工具库
- 🎯 **Axios** - HTTP 客户端
- 🎉 **Sonner** - 优雅的提示组件
- 📝 **React Hook Form** - 表单处理

## 🚀 快速开始

### 环境要求

```bash
Node.js >= 20
pnpm >= 9 (推荐) 或 npm >= 10
```

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd sign-ai
```

2. **安装依赖**
```bash
# 推荐使用 pnpm
pnpm install

# 或使用 npm
npm install
```

3. **启动开发服务器**
```bash
pnpm vite
# 或
npx vite
```

4. **访问应用**
打开浏览器访问：`http://localhost:5173`

### 推荐开发工具

- **编辑器**: [VSCode](https://code.visualstudio.com/)
- **浏览器**: Chrome 或 Edge（支持 Web Speech API）

## 🚢 部署

### Vercel 部署（推荐）

本项目完全支持 Vercel 一键部署，已包含 `vercel.json` 配置文件。

#### 方法一：通过 GitHub（推荐）

1. **将代码推送到 GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **连接 Vercel**
   - 访问 [Vercel](https://vercel.com)
   - 点击 "Import Project"
   - 选择你的 GitHub 仓库
   - Vercel 会自动检测为 Vite 项目
   - 点击 "Deploy"

3. **等待部署完成**
   - 首次部署通常需要 1-2 分钟
   - 部署成功后会获得一个 `.vercel.app` 域名

#### 方法二：通过 Vercel CLI

```bash
# 全局安装 Vercel CLI
npm install -g vercel

# 登录 Vercel
vercel login

# 部署项目
vercel

# 部署到生产环境
vercel --prod
```

#### 环境变量配置

如果需要配置环境变量（如 API 密钥）：

1. 在 Vercel 项目设置中添加环境变量
2. 或在项目根目录创建 `.env` 文件（本地开发）

```bash
VITE_APP_ID=your_app_id
```

### 其他部署平台

本项目也支持部署到其他静态网站托管平台：

#### Netlify
```bash
npm run build
# 上传 dist 目录到 Netlify
```

#### GitHub Pages
```bash
npm run build
# 将 dist 目录内容推送到 gh-pages 分支
```

#### Cloudflare Pages
- 连接 GitHub 仓库
- 构建命令：`npm run build`
- 输出目录：`dist`

## 📖 功能说明

### 1. 文字转手语

输入文字，系统自动生成对应的手语视频。

**支持的内容：**
- 日常用语：你好、谢谢你、再见、吃饭、睡觉、我爱你
- 古诗词：
  - 接天莲叶无穷碧,映日荷花别样红
  - 向浅洲远渚亭亭清绝
  - 黄梅时节家家雨,青草池塘处处蛙

**使用方法：**
1. 输入文字内容（最多30字）
2. 点击"生成手语视频"
3. 自动播放对应的手语视频

### 2. 语音转手语

通过录音输入语音，实时识别并转换为手语视频。

**支持的词汇：** 你好、再见、谢谢

**使用方法：**
1. 点击"开始录音"，清晰地说出词汇
2. 点击"停止录音"
3. 系统自动识别语音并生成对应的手语视频

**技术特点：**
- 使用浏览器内置的 Web Speech API
- 实时语音识别，无需等待
- 智能文字清理和匹配

### 3. 手语转文字语音

录制或上传手语视频，识别并转换为文字和语音。

**支持的视频文件：**
- hello.mp4 → 你好
- thank.mp4 → 谢谢
- bye.mp4 → 再见
- eat.mp4 → 吃饭
- sleep.mp4 → 睡觉
- love.mp4 → 我爱你
- data1.mp4 ~ data3.mp4 → 古诗词

**使用方法：**
1. 点击"开始"按钮
2. 选择"录像"或"上传视频"
   - **录像**: 使用摄像头录制手语视频
   - **上传**: 从本地选择视频文件
3. 点击"开始识别"
4. 系统根据文件名识别并生成文字
5. 自动使用浏览器原生 TTS 合成语音
6. 点击"播放语音"播报识别结果

**技术特点：**
- 基于文件名的 Mock 识别（演示用）
- 使用浏览器内置的 Speech Synthesis API
- 支持中文语音合成
- 实时语音播报，无需网络 API

## 🎯 项目亮点

### 1. 完全基于浏览器原生 API
- 无需依赖外部 API 或后端服务
- 语音识别使用 **Web Speech API**
- 语音合成使用 **Speech Synthesis API**
- 视频录制使用 **MediaRecorder API**
- 完全离线可用（除视频文件加载）

### 2. 跨平台支持
- 无需安装任何额外软件
- 支持 Windows、macOS、Linux
- 移动端友好（iOS Safari、Android Chrome）

### 3. 实时语音处理
- 边说边识别，响应迅速
- 智能文字清理和匹配
- 自动生成手语视频

### 4. 灵活的视频输入
- 支持摄像头实时录制
- 支持本地视频上传
- HTML5 视频播放器，控制便捷

### 5. 优秀的用户体验
- 现代化的 UI 设计
- 渐变色彩和动画效果
- 清晰的功能说明和即时反馈

## 📝 开发说明

### Mock 数据

当前版本使用 Mock 数据演示：

- **文字转手语**: 根据输入文字匹配对应的视频文件
- **语音转手语**: 使用 Web Speech API 识别语音，自动匹配视频
- **手语转文字**: 根据上传的视频文件名识别内容

### 扩展开发

如需接入真实的手语识别 API：

1. 修改 `src/services/signLanguageApi.ts`
2. 替换 Mock 数据逻辑
3. 集成实际的手语识别服务

## 📄 许可证

本项目使用 MIT 许可证

## 🔗 相关链接

- [在线演示](https://www.miaoda.cn/projects/app-71w5z1brvnk1)
- [功能文档](./docs/FEATURES.md)
- [需求文档](./docs/prd.md)
- [帮助文档](https://cloud.baidu.com/doc/MIAODA/s/Xmewgmsq7)

---

<div align="center">
Made with ❤️ for accessibility
</div>
