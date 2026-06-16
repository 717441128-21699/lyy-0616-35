import { useState } from 'react'
import usePortfolioStore from '../../store/usePortfolioStore'

const emptyProject = { title: '', description: '', coverImage: '', link: '', tags: '' }

export default function ProjectsEditor() {
  const portfolio = usePortfolioStore((s) => s.portfolio)
  const addProject = usePortfolioStore((s) => s.addProject)
  const updateProject = usePortfolioStore((s) => s.updateProject)
  const deleteProject = usePortfolioStore((s) => s.deleteProject)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ ...emptyProject })
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  const projects = portfolio.projects || []

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleAdd = () => {
    setForm({ ...emptyProject })
    setEditingId(null)
    setShowForm(true)
  }

  const handleEdit = (project) => {
    setForm({
      title: project.title || '',
      description: project.description || '',
      coverImage: project.coverImage || '',
      link: project.link || '',
      tags: Array.isArray(project.tags) ? project.tags.join(', ') : (project.tags || ''),
    })
    setEditingId(project.id)
    setShowForm(true)
  }

  const handleSave = () => {
    const data = {
      title: form.title,
      description: form.description,
      coverImage: form.coverImage,
      link: form.link,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    }

    if (editingId) {
      updateProject(editingId, data)
    } else {
      addProject(data)
    }

    setShowForm(false)
    setEditingId(null)
    setForm({ ...emptyProject })
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setForm({ ...emptyProject })
  }

  const handleDelete = (id) => {
    deleteProject(id)
    setDeleteConfirmId(null)
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-800">项目经历</h2>
        <button
          onClick={handleAdd}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition"
        >
          添加项目
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-lg border border-indigo-200 bg-indigo-50/50 p-5">
          <h3 className="text-sm font-semibold text-indigo-800 mb-4">
            {editingId ? '编辑项目' : '添加项目'}
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">项目名称</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="项目名称"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">封面图 URL</label>
                <input
                  type="url"
                  value={form.coverImage}
                  onChange={(e) => handleChange('coverImage', e.target.value)}
                  placeholder="https://example.com/cover.jpg"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">项目描述</label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="简要描述项目..."
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">项目链接</label>
                <input
                  type="url"
                  value={form.link}
                  onChange={(e) => handleChange('link', e.target.value)}
                  placeholder="https://example.com"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">标签</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => handleChange('tags', e.target.value)}
                  placeholder="用逗号分隔，如：React, Node.js"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleSave}
                className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition"
              >
                保存
              </button>
              <button
                onClick={handleCancel}
                className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {projects.length === 0 && !showForm && (
        <div className="py-10 text-center text-sm text-slate-400">暂无项目，点击上方按钮添加</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition"
          >
            {project.coverImage && (
              <div className="h-36 w-full overflow-hidden bg-slate-100">
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="h-full w-full object-cover"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-slate-800 text-sm">{project.title}</h3>
              {project.description && (
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">{project.description}</p>
              )}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs text-indigo-600 hover:underline"
                >
                  {project.link}
                </a>
              )}
              {project.tags && project.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="inline-block rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3">
                <button
                  onClick={() => handleEdit(project)}
                  className="rounded-md px-3 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition"
                >
                  编辑
                </button>
                {deleteConfirmId === project.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-red-500">确认删除？</span>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="rounded-md px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                    >
                      确认
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="rounded-md px-3 py-1 text-xs font-medium text-slate-500 hover:bg-slate-50 transition"
                    >
                      取消
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmId(project.id)}
                    className="rounded-md px-3 py-1 text-xs font-medium text-red-500 hover:bg-red-50 transition"
                  >
                    删除
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
