import { useState } from 'react'
import usePortfolioStore from '../store/usePortfolioStore'

const templates = [
  {
    templateId: 'modern',
    name: 'Modern',
    label: '现代风格',
    description: '简洁线条，专业大方',
    colors: ['#6366f1', '#3b82f6', '#8b5cf6'],
  },
  {
    templateId: 'minimal',
    name: 'Minimal',
    label: '极简风格',
    description: '简约纯粹，聚焦内容',
    colors: ['#64748b', '#94a3b8', '#cbd5e1'],
  },
  {
    templateId: 'creative',
    name: 'Creative',
    label: '创意风格',
    description: '大胆表现，个性鲜明',
    colors: ['#f43f5e', '#f59e0b', '#8b5cf6'],
  },
]

const colorSchemes = [
  { value: 'indigo', color: '#6366f1', label: '靛蓝' },
  { value: 'cyan', color: '#06b6d4', label: '青色' },
  { value: 'emerald', color: '#10b981', label: '翠绿' },
  { value: 'rose', color: '#f43f5e', label: '玫红' },
  { value: 'amber', color: '#f59e0b', label: '琥珀' },
  { value: 'violet', color: '#8b5cf6', label: '紫罗兰' },
]

const layouts = [
  { value: 'centered', label: '居中布局', icon: '⊞' },
  { value: 'sidebar', label: '侧边栏布局', icon: '▥' },
  { value: 'fullwidth', label: '全宽布局', icon: '☰' },
]

export default function ThemeSelector() {
  const theme = usePortfolioStore((s) => s.portfolio.theme)
  const updateTheme = usePortfolioStore((s) => s.updateTheme)
  const [hoveredTemplate, setHoveredTemplate] = useState(null)

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">模板选择</h2>
        <div className="grid grid-cols-3 gap-4">
          {templates.map((t) => {
            const isSelected = theme.templateId === t.templateId
            return (
              <button
                key={t.templateId}
                onClick={() => updateTheme({ templateId: t.templateId })}
                onMouseEnter={() => setHoveredTemplate(t.templateId)}
                onMouseLeave={() => setHoveredTemplate(null)}
                className={`rounded-lg border-2 p-4 text-left transition-all ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary bg-primary/5 dark:bg-primary/10'
                    : hoveredTemplate === t.templateId
                    ? 'border-slate-300 dark:border-slate-500 bg-slate-50 dark:bg-slate-700/50'
                    : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800'
                }`}
              >
                <div className="flex gap-1.5 mb-3">
                  {t.colors.map((c, i) => (
                    <span
                      key={i}
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <div className="font-medium text-sm text-slate-800 dark:text-slate-100">{t.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.label}</div>
                <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">{t.description}</div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">配色方案</h2>
        <div className="flex flex-wrap gap-4">
          {colorSchemes.map((cs) => {
            const isSelected = theme.colorScheme === cs.value
            return (
              <button
                key={cs.value}
                onClick={() => updateTheme({ colorScheme: cs.value })}
                className="flex flex-col items-center gap-2 group"
              >
                <span
                  className={`relative h-10 w-10 rounded-full transition-all flex items-center justify-center ${
                    isSelected ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-800' : 'group-hover:scale-110'
                  }`}
                  style={{
                    backgroundColor: cs.color,
                    ringColor: isSelected ? cs.color : undefined,
                  }}
                >
                  {isSelected && (
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                <span className={`text-xs ${isSelected ? 'text-slate-800 dark:text-slate-100 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                  {cs.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">布局选项</h2>
        <div className="flex gap-3">
          {layouts.map((l) => {
            const isSelected = theme.layout === l.value
            return (
              <button
                key={l.value}
                onClick={() => updateTheme({ layout: l.value })}
                className={`flex items-center gap-2 rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-all ${
                  isSelected
                    ? 'border-primary bg-primary text-white'
                    : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-500'
                }`}
              >
                <span className="text-base">{l.icon}</span>
                {l.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
