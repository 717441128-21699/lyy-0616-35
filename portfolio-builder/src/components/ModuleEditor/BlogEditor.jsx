import { useState } from 'react'
import usePortfolioStore from '../../store/usePortfolioStore'
import { Plus, Pencil, Trash2, FileText } from 'lucide-react'

const emptyForm = {
  title: '',
  content: '',
  date: '',
  tags: '',
}

export default function BlogEditor() {
  const { portfolio, addBlogPost, updateBlogPost, deleteBlogPost } = usePortfolioStore()
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [isAdding, setIsAdding] = useState(false)

  const posts = portfolio.blogPosts || []

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleAdd = () => {
    setIsAdding(true)
    setEditingId(null)
    setForm(emptyForm)
  }

  const handleEdit = (post) => {
    setEditingId(post.id)
    setIsAdding(false)
    setForm({
      title: post.title || '',
      content: post.content || '',
      date: post.date || '',
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || ''),
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
      title: form.title,
      content: form.content,
      date: form.date,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    }
    if (isAdding) {
      addBlogPost(data)
    } else if (editingId) {
      updateBlogPost(editingId, data)
    }
    handleCancel()
  }

  const handleDelete = (id) => {
    deleteBlogPost(id)
    if (editingId === id) handleCancel()
  }

  const getExcerpt = (content, maxLen = 100) => {
    if (!content) return ''
    return content.length > maxLen ? content.slice(0, maxLen) + '…' : content
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text">博客文章</h2>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition"
        >
          <Plus size={16} />
          添加文章
        </button>
      </div>

      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit} className="p-4 bg-surface-alt rounded-xl border border-border space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">标题</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">日期</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">内容</label>
            <textarea
              value={form.content}
              onChange={(e) => handleChange('content', e.target.value)}
              rows={5}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">标签（逗号分隔）</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
              placeholder="React, 前端, 设计"
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
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

      {posts.length === 0 && !isAdding && (
        <div className="text-center py-12 text-text-muted">
          <FileText size={40} className="mx-auto mb-3 opacity-40" />
          <p>暂无博客文章，点击上方按钮添加</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-4 bg-surface-alt rounded-xl border border-border hover:border-primary/30 transition animate-fade-in"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-text truncate">{post.title}</h3>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleEdit(post)}
                  className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-1.5 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            {post.date && (
              <p className="text-xs text-primary mt-1">{post.date}</p>
            )}
            {post.content && (
              <p className="text-sm text-text-muted mt-2 leading-relaxed">{getExcerpt(post.content)}</p>
            )}
            {Array.isArray(post.tags) && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {post.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-block px-2 py-0.5 text-xs font-medium text-primary bg-primary/10 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
