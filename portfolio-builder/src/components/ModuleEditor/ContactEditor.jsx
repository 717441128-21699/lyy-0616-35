import { useState, useEffect } from 'react'
import usePortfolioStore from '../../store/usePortfolioStore'
import { Mail, Phone, MessageCircle, Code2, Briefcase, AtSign, Globe } from 'lucide-react'

const FIELDS = [
  { key: 'email', label: '邮箱', icon: Mail, type: 'email', placeholder: 'your@email.com' },
  { key: 'phone', label: '电话', icon: Phone, type: 'tel', placeholder: '+86 138-0000-0000' },
  { key: 'wechat', label: '微信', icon: MessageCircle, type: 'text', placeholder: '微信号' },
  { key: 'github', label: 'GitHub', icon: Code2, type: 'url', placeholder: 'https://github.com/username' },
  { key: 'linkedin', label: 'LinkedIn', icon: Briefcase, type: 'url', placeholder: 'https://linkedin.com/in/username' },
  { key: 'twitter', label: 'Twitter', icon: AtSign, type: 'url', placeholder: 'https://twitter.com/username' },
  { key: 'website', label: '个人网站', icon: Globe, type: 'url', placeholder: 'https://yoursite.com' },
]

export default function ContactEditor() {
  const { portfolio, updateContact } = usePortfolioStore()
  const [form, setForm] = useState({})

  useEffect(() => {
    setForm(portfolio.contact || {})
  }, [portfolio.contact])

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    updateContact(form)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text">联系方式</h2>
        <button
          onClick={handleSave}
          className="px-4 py-1.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition"
        >
          保存
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map(({ key, label, icon: Icon, type, placeholder }) => (
          <div key={key} className="relative">
            <label className="block text-sm font-medium text-text mb-1">{label}</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                <Icon size={16} />
              </div>
              <input
                type={type}
                value={form[key] || ''}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={placeholder}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
