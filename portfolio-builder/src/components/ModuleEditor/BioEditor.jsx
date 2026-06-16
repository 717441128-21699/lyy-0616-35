import { useState } from 'react'
import usePortfolioStore from '../../store/usePortfolioStore'

const defaultBio = { name: '', title: '', avatar: '', bio: '', location: '' }

export default function BioEditor() {
  const portfolio = usePortfolioStore((s) => s.portfolio)
  const updateBio = usePortfolioStore((s) => s.updateBio)

  const current = portfolio.bio || defaultBio
  const [form, setForm] = useState({ ...defaultBio, ...current })

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    updateBio(form)
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-6">基本信息</h2>

      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">姓名</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="你的姓名"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">职位头衔</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="例如：高级前端工程师"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">头像 URL</label>
          <input
            type="url"
            value={form.avatar}
            onChange={(e) => handleChange('avatar', e.target.value)}
            placeholder="https://example.com/avatar.jpg"
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
          />
          {form.avatar && (
            <div className="mt-3 flex items-center gap-3">
              <img
                src={form.avatar}
                alt="头像预览"
                className="h-12 w-12 rounded-full object-cover border border-slate-200"
                onError={(e) => { e.target.style.display = 'none' }}
              />
              <span className="text-xs text-slate-500">头像预览</span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">个人简介</label>
          <textarea
            value={form.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            placeholder="简要介绍自己..."
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">所在地</label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="例如：北京"
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
          />
        </div>

        <div className="pt-2">
          <button
            onClick={handleSave}
            className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  )
}
