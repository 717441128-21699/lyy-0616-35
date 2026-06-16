import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User,
  FolderKanban,
  Tags,
  Clock,
  BookOpen,
  Mail,
  Palette,
  Globe,
  BarChart3,
  FileText,
  Search,
  LogOut,
  Sun,
  Moon,
  Eye,
  ToggleLeft,
} from 'lucide-react'
import useAuthStore from '../store/useAuthStore'

const NAV_ITEMS = [
  { key: 'overview', label: '📋 总览', icon: Eye },
  { key: 'bio', label: '👤 个人简介', icon: User },
  { key: 'projects', label: '📁 项目经历', icon: FolderKanban },
  { key: 'skills', label: '🏷 技能标签', icon: Tags },
  { key: 'work', label: '💼 工作经历', icon: Clock },
  { key: 'blog', label: '📝 博客文章', icon: BookOpen },
  { key: 'contact', label: '📧 联系方式', icon: Mail },
  { key: 'theme', label: '🎨 主题设置', icon: Palette },
  { key: 'publish', label: '🌐 发布管理', icon: Globe },
  { key: 'analytics', label: '📊 访客统计', icon: BarChart3 },
  { key: 'pdf', label: '📄 PDF简历', icon: FileText },
  { key: 'seo', label: '🔍 SEO设置', icon: Search },
]

export default function Sidebar({ activeSection, onSectionChange, darkMode, onToggleDarkMode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleNavClick = (key) => {
    onSectionChange(key)
    setMobileOpen(false)
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border dark:border-border-dark">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg shrink-0">
            {user?.username?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <span className="text-sm font-semibold text-text dark:text-text-dark truncate">
            {user?.username || 'User'}
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.key
          return (
            <button
              key={item.key}
              onClick={() => handleNavClick(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-muted dark:text-text-dark-muted hover:bg-surface-alt dark:hover:bg-surface-dark-alt'
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="p-3 border-t border-border dark:border-border-dark space-y-2">
        <button
          onClick={onToggleDarkMode}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-muted dark:text-text-dark-muted hover:bg-surface-alt dark:hover:bg-surface-dark-alt transition-colors duration-150"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          <span>{darkMode ? '浅色模式' : '深色模式'}</span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
        >
          <LogOut size={18} />
          <span>退出登录</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-surface dark:bg-surface-dark shadow-lg border border-border dark:border-border-dark"
      >
        <ToggleLeft size={20} className="text-text dark:text-text-dark" />
      </button>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-screen w-64 bg-surface dark:bg-surface-dark border-r border-border dark:border-border-dark transform transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
