import { useState } from 'react'
import usePortfolioStore from '../store/usePortfolioStore'

export default function SEOSettings() {
  const portfolio = usePortfolioStore((s) => s.portfolio)
  const updateSEO = usePortfolioStore((s) => s.updateSEO)

  const seo = portfolio.seo || { title: '', description: '' }
  const [title, setTitle] = useState(seo.title)
  const [description, setDescription] = useState(seo.description)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    updateSEO({ title, description })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const previewTitle = title || '页面标题'
  const previewDescription = description || '页面描述将显示在这里...'
  const previewUrl = portfolio.domain?.subdomain
    ? `https://${portfolio.domain.subdomain}`
    : 'https://yourname.site'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text dark:text-text-dark">SEO 设置</h2>
        <button
          onClick={handleSave}
          className="px-4 py-1.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition"
        >
          {saved ? '已保存' : '保存'}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text dark:text-text-dark mb-1">页面标题</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="输入页面标题，建议 50 字符以内"
            className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface dark:bg-surface-dark-alt text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
          />
          <p className="mt-1 text-xs text-text-muted dark:text-text-dark-muted">{title.length}/60 字符</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-text dark:text-text-dark mb-1">页面描述</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="输入页面描述，建议 160 字符以内"
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface dark:bg-surface-dark-alt text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition resize-none"
          />
          <p className={`mt-1 text-xs ${description.length > 160 ? 'text-red-500' : 'text-text-muted dark:text-text-dark-muted'}`}>
            {description.length}/160 字符 {description.length > 160 && '(超出建议长度)'}
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-text dark:text-text-dark mb-3">搜索引擎预览</h3>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-border dark:border-border-dark p-5 max-w-xl">
          <p className="text-blue-700 dark:text-blue-400 text-lg font-medium truncate hover:underline cursor-pointer">
            {previewTitle}
          </p>
          <p className="text-green-700 dark:text-green-400 text-sm mt-0.5 truncate">
            {previewUrl}
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">
            {previewDescription}
          </p>
        </div>
      </div>
    </div>
  )
}
