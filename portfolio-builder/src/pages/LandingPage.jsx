import { Link } from 'react-router-dom';
import { Layout, Palette, Globe, BarChart3, FileText, Search } from 'lucide-react';

const features = [
  {
    icon: Layout,
    title: '模块化管理',
    description: '拖拽式模块编排，自由组合项目经历、技能标签、教育背景等内容区块。',
  },
  {
    icon: Palette,
    title: '多套主题模板',
    description: '精心设计的主题模板，一键切换风格，让你的作品集脱颖而出。',
  },
  {
    icon: Globe,
    title: '一键发布',
    description: '一键生成在线作品集，即刻拥有专属链接，分享给全世界。',
  },
  {
    icon: BarChart3,
    title: '访客统计',
    description: '实时追踪页面访问数据，了解谁在关注你的作品集。',
  },
  {
    icon: FileText,
    title: 'PDF简历',
    description: '一键导出精美 PDF 简历，适配各类求职场景。',
  },
  {
    icon: Search,
    title: 'SEO优化',
    description: '内置搜索引擎优化，让你的作品集更容易被找到。',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              构建你的专属作品集
            </h1>
            <p className="mt-6 text-lg leading-8 text-indigo-100">
              FolioCraft 帮助你快速创建精美、专业的在线作品集。无需编码，拖拽即成，一键发布。
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/register"
                className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-indigo-600 shadow-lg shadow-indigo-900/30 transition hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                免费开始
              </Link>
              <Link
                to="/u/demo"
                className="text-sm font-semibold leading-6 text-white transition hover:text-indigo-100"
              >
                查看示例 <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-full h-24 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            强大功能，简单操作
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            一切你需要的工具，打造令人印象深刻的个人作品集。
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 lg:max-w-none lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              准备好展示自己了吗？
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              加入数千名创意人士，用 FolioCraft 打造你的专业作品集。
            </p>
            <div className="mt-8">
              <Link
                to="/register"
                className="rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                立即注册
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <p className="text-center text-sm text-gray-500">© 2026 FolioCraft. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
