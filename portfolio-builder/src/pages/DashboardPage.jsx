import { useState, useEffect } from 'react'
import useAuthStore from '../store/useAuthStore'
import usePortfolioStore from '../store/usePortfolioStore'
import Sidebar from '../components/Sidebar'
import BioEditor from '../components/ModuleEditor/BioEditor'
import ProjectsEditor from '../components/ModuleEditor/ProjectsEditor'
import SkillsEditor from '../components/ModuleEditor/SkillsEditor'
import WorkExperienceEditor from '../components/ModuleEditor/WorkExperienceEditor'
import BlogEditor from '../components/ModuleEditor/BlogEditor'
import ContactEditor from '../components/ModuleEditor/ContactEditor'
import ThemeSelector from '../components/ThemeSelector'
import PublishPanel from '../components/PublishPanel'
import AnalyticsPanel from '../components/AnalyticsPanel'
import SEOSettings from '../components/SEOSettings'
import ModuleToggle from '../components/ModuleToggle'
import PDFResume from '../components/PDFResume'

const SECTION_META = [
  { key: 'bio', label: '个人简介', field: 'bio' },
  { key: 'projects', label: '项目经历', field: 'projects' },
  { key: 'skills', label: '技能标签', field: 'skills' },
  { key: 'work', label: '工作经历', field: 'workExperience' },
  { key: 'blog', label: '博客文章', field: 'blogPosts' },
  { key: 'contact', label: '联系方式', field: 'contact' },
  { key: 'theme', label: '主题设置' },
  { key: 'publish', label: '发布管理' },
  { key: 'analytics', label: '访客统计' },
  { key: 'pdf', label: 'PDF简历' },
  { key: 'seo', label: 'SEO设置' },
]

function hasContent(portfolio, field) {
  if (!field) return false
  const value = portfolio[field]
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'string') return value.trim().length > 0
  if (typeof value === 'object') return Object.keys(value).length > 0
  return !!value
}

function OverviewSection({ portfolio, onSectionChange }) {
  const completed = SECTION_META.filter((s) => s.field && hasContent(portfolio, s.field))
  const total = SECTION_META.filter((s) => s.field).length
  const percent = total > 0 ? Math.round((completed.length / total) * 100) : 0

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-text dark:text-text-dark">总览</h2>
        <p className="text-text-muted dark:text-text-dark-muted mt-1">欢迎回来，完善你的个人作品集</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface dark:bg-surface-dark-alt rounded-xl border border-border dark:border-border-dark p-5">
          <p className="text-sm text-text-muted dark:text-text-dark-muted">完成度</p>
          <p className="text-3xl font-bold text-primary mt-1">{percent}%</p>
          <div className="w-full h-2 bg-surface-alt dark:bg-surface-dark rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
        <div className="bg-surface dark:bg-surface-dark-alt rounded-xl border border-border dark:border-border-dark p-5">
          <p className="text-sm text-text-muted dark:text-text-dark-muted">已填充模块</p>
          <p className="text-3xl font-bold text-text dark:text-text-dark mt-1">{completed.length}/{total}</p>
        </div>
        <div className="bg-surface dark:bg-surface-dark-alt rounded-xl border border-border dark:border-border-dark p-5">
          <p className="text-sm text-text-muted dark:text-text-dark-muted">发布状态</p>
          <p className={`text-3xl font-bold mt-1 ${portfolio.isPublished ? 'text-green-500' : 'text-text-muted dark:text-text-dark-muted'}`}>
            {portfolio.isPublished ? '已发布' : '未发布'}
          </p>
        </div>
      </div>

      <div className="bg-surface dark:bg-surface-dark-alt rounded-xl border border-border dark:border-border-dark p-5">
        <h3 className="text-sm font-semibold text-text dark:text-text-dark mb-3">模块状态</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SECTION_META.filter((s) => s.field).map((s) => {
            const filled = hasContent(portfolio, s.field)
            return (
              <button
                key={s.key}
                onClick={() => onSectionChange(s.key)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-alt dark:hover:bg-surface-dark transition-colors text-left"
              >
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${filled ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                <span className="text-sm text-text dark:text-text-dark">{s.label}</span>
                <span className={`text-xs ml-auto ${filled ? 'text-green-500' : 'text-text-muted dark:text-text-dark-muted'}`}>
                  {filled ? '已填写' : '未填写'}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState('overview')
  const portfolio = usePortfolioStore((s) => s.portfolio)
  const updateTheme = usePortfolioStore((s) => s.updateTheme)

  const darkMode = portfolio.theme.darkMode

  const handleToggleDarkMode = () => {
    updateTheme({ darkMode: !darkMode })
  }

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      document.body.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.body.classList.remove('dark')
    }
  }, [darkMode])

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection portfolio={portfolio} onSectionChange={setActiveSection} />
      case 'bio':
        return <BioEditor />
      case 'projects':
        return <ProjectsEditor />
      case 'skills':
        return <SkillsEditor />
      case 'work':
        return <WorkExperienceEditor />
      case 'blog':
        return <BlogEditor />
      case 'contact':
        return <ContactEditor />
      case 'theme':
        return <ThemeSelector />
      case 'publish':
        return <PublishPanel />
      case 'analytics':
        return <AnalyticsPanel />
      case 'pdf':
        return <PDFResume />
      case 'seo':
        return <SEOSettings />
      default:
        return <OverviewSection portfolio={portfolio} onSectionChange={setActiveSection} />
    }
  }

  return (
    <div className="flex h-screen bg-surface-alt dark:bg-surface-dark">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {renderSection()}
        </div>
      </main>
    </div>
  )
}
