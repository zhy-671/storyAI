# Story AI - Interactive AI Story Generator & Writer

🌐 **Website**: [https://storyai.pro](https://storyai.pro)

Story AI 是一个强大的 AI 故事生成平台，帮助用户快速创建个性化的互动故事、儿童故事书、奇幻冒险、浪漫小说等多种类型的故事内容。通过先进的 AI 技术，几分钟内生成完整的故事书，包含文字内容和精美的插图。

## 🌟 核心功能

### ✨ AI 故事生成
- **多类型支持**：儿童故事、奇幻冒险、浪漫小说、恐怖悬疑、推理犯罪等
- **智能创作**：基于主题和提示词，自动生成完整的故事内容、角色设定和情节发展
- **插图生成**：自动为每个场景生成详细的插图描述，支持多种艺术风格（水彩、绘本、油画等）
- **个性化定制**：支持自定义故事主题、角色、情节走向

### 📚 故事书管理
- **故事广场**：浏览和阅读社区创作的 AI 故事书
- **个人作品集**：管理自己创建的所有故事书
- **故事详情页**：精美的翻页阅读体验，支持全屏阅读

### 🎨 视觉功能
- **多种图片风格**：水彩、绘本、油画、素描等艺术风格选择
- **响应式设计**：完美适配手机、平板和桌面设备
- **3D 翻页效果**：沉浸式的故事书阅读体验

### 💳 订阅与积分系统
- **灵活付费**：支持一次性积分购买和月度/年度订阅
- **积分系统**：使用积分生成故事，每生成一个故事消耗相应积分
- **订阅管理**：自动续费、取消订阅、查看订阅状态

### 🔐 用户系统
- **安全认证**：基于 Supabase 的身份验证系统
- **Google OAuth**：支持 Google 账号快速登录
- **邮箱注册**：传统的邮箱密码注册方式

## 🚀 技术栈

### 前端框架
- **Next.js 15** (App Router) - 最新的 React 框架
- **React 19** - 最新版本的 React
- **TypeScript** - 类型安全的开发体验
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Framer Motion** - 流畅的动画效果
- **shadcn/ui** - 现代化的 UI 组件库

### 后端服务
- **Supabase** - 数据库、认证和实时功能
- **Creem.io** - 支付处理和订阅管理
- **火山引擎 TOS** - 对象存储服务（图片存储）
- **OpenAI/OpenRouter** - AI 内容生成

### 开发工具
- **ESLint** - 代码质量检查
- **PostCSS** - CSS 处理
- **Autoprefixer** - CSS 兼容性处理

## 📦 快速开始

### 前提条件

- Node.js 18+ 
- npm 或 yarn
- Supabase 账户
- Creem.io 账户
- 火山引擎 TOS 账户（可选，用于图片存储）

### 安装步骤

1. **克隆项目**
```bash
git clone <your-repo-url>
cd storyai
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**

创建 `.env.local` 文件：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=你的supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的supabase匿名密钥
SUPABASE_SERVICE_ROLE_KEY=你的supabase服务角色密钥

# Creem.io 配置
CREEM_WEBHOOK_SECRET=你的webhook密钥
CREEM_API_KEY=你的creem API密钥
CREEM_API_URL=https://api.creem.io/v1
CREEM_SUCCESS_URL=https://storyai.pro/credits

# 站点配置
NEXT_PUBLIC_SITE_URL=https://storyai.pro

# 火山引擎 TOS 配置（可选）
VOLC_TOS_ACCESS_KEY_ID=你的访问密钥ID
VOLC_TOS_SECRET_ACCESS_KEY=你的秘密访问密钥
VOLC_TOS_REGION=cn-beijing
VOLC_TOS_ENDPOINT=https://tos-cn-beijing.volces.com
VOLC_TOS_BUCKET=你的bucket名称
VOLC_TOS_PUBLIC_BASE_URL=https://你的CDN域名
```

4. **设置 Supabase 数据库**

运行数据库迁移脚本（在 `supabase/migrations/` 目录下）：
- 创建必要的表结构（storybooks, customers, subscriptions, credits_history 等）
- 配置 Row Level Security (RLS) 策略
- 设置必要的索引

5. **配置 Creem.io Webhook**

在 Creem.io 后台配置 Webhook URL：
```
https://storyai.pro/api/webhooks/creem
```

6. **运行开发服务器**
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 🏗️ 项目结构

```
storyai/
├── app/                          # Next.js App Router
│   ├── (auth-pages)/            # 认证相关页面
│   │   ├── sign-in/            # 登录页面
│   │   ├── sign-up/            # 注册页面
│   │   └── forgot-password/    # 忘记密码
│   ├── api/                    # API 路由
│   │   ├── storybook/          # 故事生成 API
│   │   ├── storybooks/         # 故事书管理 API
│   │   ├── credits/            # 积分相关 API
│   │   ├── subscription/       # 订阅相关 API
│   │   └── webhooks/creem/     # Creem Webhook 处理
│   ├── create-story-book/      # 故事创建页面
│   ├── story-book/             # 故事书浏览和详情
│   ├── dashboard/              # 用户仪表板
│   ├── credits/                # 积分购买页面
│   └── layout.tsx              # 根布局
├── components/                  # React 组件
│   ├── ui/                     # shadcn/ui 组件
│   ├── book/                   # 故事书相关组件
│   └── dashboard/              # 仪表板组件
├── hooks/                      # 自定义 React Hooks
│   ├── use-user.ts            # 用户状态管理
│   ├── use-credits.ts          # 积分管理
│   └── use-subscription.ts     # 订阅管理
├── utils/                      # 工具函数
│   ├── supabase/              # Supabase 客户端和工具
│   ├── creem/                 # Creem 支付工具
│   └── storage/               # 存储工具（TOS）
├── types/                      # TypeScript 类型定义
├── public/                     # 静态资源
│   ├── images/                # 图片资源
│   └── samples/               # 示例文件
└── supabase/                   # 数据库迁移脚本
    └── migrations/            # SQL 迁移文件
```

## 🔧 核心功能实现

### 故事生成流程

1. **用户输入**：提供故事主题、类型、目标读者等信息
2. **AI 生成**：调用 AI 模型生成故事内容（标题、摘要、场景、插图描述）
3. **图片生成**：根据插图描述生成对应的图片
4. **存储保存**：将故事数据保存到 Supabase 数据库
5. **展示阅读**：以精美的翻页形式展示故事书

### 支付与订阅

- **积分购买**：用户购买积分，用于生成故事
- **订阅服务**：月度/年度订阅，自动获得积分
- **Webhook 处理**：自动处理支付成功、订阅激活等事件
- **积分记录**：完整的积分交易历史记录

### SEO 优化

- **结构化数据**：Organization、WebPage、Article、FAQPage Schema
- **Breadcrumb 导航**：带 Schema.org 标记的面包屑导航
- **Sitemap**：自动生成的动态网站地图
- **robots.txt**：优化的搜索引擎爬虫规则
- **Meta 标签**：每个页面都有针对性的 SEO 元标签

## 📱 响应式设计

- **移动端优化**：完全响应式的移动端界面
- **平板适配**：针对平板设备的优化布局
- **桌面端体验**：大屏幕设备的最佳展示效果

## 🎯 主要页面

- **首页** (`/`) - 产品介绍和功能展示
- **创建故事** (`/create-story-book`) - AI 故事生成器
- **故事广场** (`/story-book`) - 浏览社区故事
- **故事详情** (`/story-book/[slug]`) - 阅读单个故事
- **积分中心** (`/credits`) - 购买积分和订阅
- **用户仪表板** (`/dashboard`) - 管理个人作品和账户

## 🔒 安全特性

- **Row Level Security (RLS)**：数据库级别的安全策略
- **Webhook 签名验证**：确保支付回调的安全性
- **环境变量保护**：敏感信息存储在环境变量中
- **OAuth 安全**：标准化的 OAuth 2.0 流程

## 📊 性能优化

- **Next.js Image 优化**：自动图片压缩和格式转换（WebP/AVIF）
- **CSS 优化**：关键 CSS 内联，延迟加载非关键样式
- **代码分割**：自动代码分割和懒加载
- **LCP 优化**：移除关键元素的动画延迟，提升首屏加载速度

## 🌐 部署

### Vercel 部署（推荐）

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量
4. 完成部署

### 其他平台

项目支持部署到任何支持 Next.js 的平台：
- Vercel
- Netlify
- Railway
- 自有服务器（需要 Node.js 环境）

## 📝 开发指南

### 添加新功能

1. 遵循现有的文件结构
2. 使用 TypeScript 确保类型安全
3. 遵循 Tailwind CSS 样式规范
4. 添加适当的错误处理
5. 更新相关文档

### 代码规范

- 使用 TypeScript 进行类型检查
- 组件使用函数式组件和 Hooks
- 变量和函数使用 camelCase，组件使用 PascalCase
- 保持代码简洁和可读性

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[添加您的许可证信息]

## 🔗 相关链接

- **官方网站**: [https://storyai.pro](https://storyai.pro)
- **Supabase**: [https://supabase.com](https://supabase.com)
- **Creem.io**: [https://creem.io](https://creem.io)
- **Next.js 文档**: [https://nextjs.org/docs](https://nextjs.org/docs)

## 📧 联系我们

如有问题或建议，请通过以下方式联系：

- 网站: [https://storyai.pro](https://storyai.pro)
- 邮箱: [添加您的联系邮箱]

---

**Story AI** - 用 AI 创造无限故事可能 ✨
