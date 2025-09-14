---
title: 技术架构
hideInfo: true
---
## 服务

**即刻短文**：自部署接口，从TelegramChannel获取内容并返回数据。

**服务状态**：自部署接口，云函数定时获取服务状态，并返回数据。

## 开发

::card-list

- 内容与服务
  - **内容管理**：Nuxt Content v3
  - **部署平台**：Netlify
  - **评论系统**：Twikoo
  - **图床**：Bitiful、SMMS
  - **评论数据库**：MongoDB
  - **包管理器**：pnpm
- 工具库
  - **日期处理**：date-fns
  - **轮播图**：Embla Carousel
  - **订阅源生成**：Fast XML Parser
  - **域名解析**：parse-domain
  - **动态代码高亮**：Plain Shiki
  - **实用算法片段库**：Radash
  - **悬浮组件库**：Vue Tippy
- 依赖模块
  - **图标管理**：Nuxt Icon
  - **颜色模式**：Nuxt Color Mode
  - **SEO优化**：Nuxt SEO
  - **状态管理**：Pinia
  - **Vue 实用功能库**：VueUse
  - **代码质量**：ESLint + Stylelint
  - | **代码压缩**：Terser |
    | :------------------------: |
