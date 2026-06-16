import { useState } from 'react'
import usePortfolioStore from '../../store/usePortfolioStore'
import { Plus, Pencil, Trash2, Briefcase } from 'lucide-react'

const emptyForm = {
  company: '',
  position: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
}

export default function WorkExperienceEditor() {
  const { portfolio, addWorkExperience, updateWorkExperience, deleteWorkExperience } = usePortfolioStore()
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [isAdding, setIsAdding] = useState(false)

  const experiences = portfolio.workExperience || []

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleAdd = () => {
    setIsAdding(true)
    setEditingId(null)
    setForm(emptyForm)
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setIsAdding(false)
    setForm({
      company: item.company || '',
      position: item.position || '',
      startDate: item.startDate || '',
      endDate: item.endDate || '',
      current: item.current || false,
      description: item.description || '',
    })
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      company: form.company,
      position: form.position,
      startDate: form.startDate,
      endDate: form.current ? '' : form.endDate,
      current: form.current,
      description: form.description,
    }
    if (isAdding) {
      addWorkExperience(data)
    } else if (editingId) {
      updateWorkExperience(editingId, data)
    }
    handleCancel()
  }

  const handleDelete = (id) => {
    deleteWorkExperience(id)
    if (editingId === id) handleCancel()
  }

  const formatDateRange = (item) => {
    const start = item.startDate || ''
    const end = item.current ? '至今' : (item.endDate || '')
    return start && end ? `${start} — ${end}` : start || end
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text">工作经历</h2>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition"
        >
          <Plus size={16} />
          添加经历
        </button>
      </div>

      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit} className="p-4 bg-surface-alt rounded-xl border border-border space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">公司</label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => handleChange('company', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">职位</label>
              <input
                type="text"
                value={form.position}
                onChange={(e) => handleChange('position', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">开始时间</label>
              <input
                type="month"
                value={form.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">结束时间</label>
              <div className="space-y-2">
                <input
                  type="month"
                  value={form.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  disabled={form.current}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <label className="inline-flex items-center gap-2 text-sm text-text-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.current}
                    onChange={(e) => handleChange('current', e.target.checked)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary/50"
                  />
                  至今
                </label>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">描述</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition resize-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-text-muted bg-surface border border-border rounded-lg hover:bg-surface-alt transition"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition"
            >
              {isAdding ? '添加' : '保存'}
            </button>
          </div>
        </form>
      )}

      {experiences.length === 0 && !isAdding && (
        <div className="text-center py-12 text-text-muted">
          <Briefcase size={40} className="mx-auto mb-3 opacity-40" />
          <p>暂无工作经历，点击上方按钮添加</p>
        </div>
      )}

      <div className="relative">
        {experiences.length > 1 && (
          <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-border" />
        )}
        <div className="space-y-4">
          {experiences.map((item) => (
            <div key={item.id} className="relative pl-8 animate-slide-in">
              <div className="absolute left-0 top-2 w-6 h-6 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <div className="p-4 bg-surface-alt rounded-xl border border-border hover:border-primary/30 transition">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-text truncate">{item.company}</h3>
                    <p className="text-sm text-text-muted mt-0.5">{item.position}</p>
                    <p className="text-xs text-primary mt-1">{formatDateRange(item)}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {item.description && (
                  <p className="mt-2 text-sm text-text-muted leading-relaxed">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
