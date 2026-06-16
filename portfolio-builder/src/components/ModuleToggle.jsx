import usePortfolioStore from '../store/usePortfolioStore'

const MODULES = [
  { key: 'bio', label: '个人简介', description: '展示你的姓名、头像和自我介绍' },
  { key: 'projects', label: '项目经历', description: '展示你参与的项目和成果' },
  { key: 'skills', label: '技能标签', description: '展示你掌握的技术和技能' },
  { key: 'workExperience', label: '工作经历', description: '展示你的工作履历和职业发展' },
  { key: 'blog', label: '博客文章', description: '展示你撰写的文章和技术分享' },
  { key: 'contact', label: '联系方式', description: '展示你的邮箱、社交账号等联系信息' },
]

function Toggle({ enabled, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${
        enabled ? 'bg-primary' : 'bg-gray-300 dark:bg-slate-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

export default function ModuleToggle() {
  const portfolio = usePortfolioStore((s) => s.portfolio)
  const toggleModule = usePortfolioStore((s) => s.toggleModule)

  const modules = portfolio.modules || {}

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-text dark:text-text-dark">模块开关</h2>

      <div className="space-y-3">
        {MODULES.map(({ key, label, description }) => (
          <div
            key={key}
            className="flex items-center justify-between p-4 bg-surface dark:bg-surface-dark-alt rounded-xl border border-border dark:border-border-dark"
          >
            <div className="min-w-0 mr-4">
              <p className="text-sm font-medium text-text dark:text-text-dark">{label}</p>
              <p className="text-xs text-text-muted dark:text-text-dark-muted mt-0.5">{description}</p>
            </div>
            <Toggle
              enabled={!!modules[key]}
              onChange={() => toggleModule(key)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
