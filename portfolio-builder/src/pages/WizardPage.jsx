import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Briefcase, Palette } from 'lucide-react'
import useAuthStore from '../store/useAuthStore'
import usePortfolioStore from '../store/usePortfolioStore'

const STEPS = [
  { label: '基本信息', icon: User },
  { label: '职业方向', icon: Briefcase },
  { label: '选择模板', icon: Palette },
]

const CAREER_OPTIONS = [
  '前端开发',
  '后端开发',
  '全栈开发',
  'UI/UX 设计',
  '产品经理',
  '数据分析师',
  '移动端开发',
  'DevOps',
]

const YEARS_OPTIONS = [
  { value: '0-1', label: '0-1 年' },
  { value: '1-3', label: '1-3 年' },
  { value: '3-5', label: '3-5 年' },
  { value: '5-10', label: '5-10 年' },
  { value: '10+', label: '10 年以上' },
]

const TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern',
    description: '现代简约风格，适合技术从业者，清晰的模块化布局，强调内容可读性。',
    colors: ['bg-indigo-500', 'bg-slate-800', 'bg-white'],
    colorLabels: ['主色', '文字', '背景'],
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: '极简留白设计，专注核心信息呈现，适合资深人士展示专业形象。',
    colors: ['bg-gray-900', 'bg-gray-100', 'bg-white'],
    colorLabels: ['主色', '辅助', '背景'],
  },
  {
    id: 'creative',
    name: 'Creative',
    description: '创意多彩风格，适合设计师和创意工作者，大胆的视觉表现力。',
    colors: ['bg-pink-500', 'bg-violet-500', 'bg-amber-400'],
    colorLabels: ['主色', '辅助', '点缀'],
  },
]

export default function WizardPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    name: '',
    title: '',
    bio: '',
    location: '',
    careerDirection: '',
    yearsOfExperience: '',
    skillInput: '',
    skills: [],
    templateId: 'modern',
  })
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { updateBio, addSkill, updateTheme } = usePortfolioStore()

  useState(() => {
    if (user?.careerDirection) {
      setForm((prev) => ({ ...prev, careerDirection: user.careerDirection }))
    }
  })

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const handleSkillKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && form.skillInput.trim()) {
      e.preventDefault()
      const skill = form.skillInput.trim().replace(/,$/,'')
      if (skill && !form.skills.includes(skill)) {
        update('skills', [...form.skills, skill])
      }
      update('skillInput', '')
    }
  }

  const removeSkill = (skill) => {
    update('skills', form.skills.filter((s) => s !== skill))
  }

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(step + 1)
  }

  const handlePrev = () => {
    if (step > 0) setStep(step - 1)
  }

  const handleFinish = () => {
    updateBio({ name: form.name, title: form.title, bio: form.bio, location: form.location })
    form.skills.forEach((skill) => addSkill(skill))
    updateTheme({ templateId: form.templateId })
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            {STEPS.map((s, i) => {
              const Icon = s.icon
              const isActive = i === step
              const isCompleted = i < step
              return (
                <div key={i} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                          : isCompleted
                          ? 'bg-indigo-100 text-indigo-600'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <span
                      className={`mt-1.5 text-xs font-medium ${
                        isActive ? 'text-indigo-600' : isCompleted ? 'text-indigo-500' : 'text-slate-400'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`w-16 sm:w-24 h-0.5 mx-2 mb-5 transition-colors duration-300 ${
                        i < step ? 'bg-indigo-400' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
          <p className="text-center text-sm text-slate-500 mt-2">
            第 {step + 1} 步，共 {STEPS.length} 步
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8">
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-slate-800">基本信息</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">姓名</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="请输入你的姓名"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">职位头衔</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                  placeholder="例如：高级前端工程师"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">个人简介</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => update('bio', e.target.value)}
                  placeholder="简要介绍自己，让别人快速了解你..."
                  rows={4}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">所在地</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => update('location', e.target.value)}
                  placeholder="例如：北京"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-slate-800">职业方向</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">职业方向</label>
                <select
                  value={form.careerDirection}
                  onChange={(e) => update('careerDirection', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition bg-white"
                >
                  <option value="">请选择职业方向</option>
                  {CAREER_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">工作经验</label>
                <select
                  value={form.yearsOfExperience}
                  onChange={(e) => update('yearsOfExperience', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition bg-white"
                >
                  <option value="">请选择工作年限</option>
                  {YEARS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">核心技能</label>
                <input
                  type="text"
                  value={form.skillInput}
                  onChange={(e) => update('skillInput', e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="输入技能后按 Enter 或逗号添加"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                />
                {form.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {form.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="text-indigo-400 hover:text-indigo-600 transition"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-slate-800">选择模板</h2>
              <div className="grid gap-4">
                {TEMPLATES.map((tpl) => {
                  const selected = form.templateId === tpl.id
                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => update('templateId', tpl.id)}
                      className={`text-left rounded-xl border-2 p-5 transition-all duration-200 ${
                        selected
                          ? 'border-indigo-500 bg-indigo-50/50 shadow-md shadow-indigo-100'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`font-semibold text-base ${selected ? 'text-indigo-700' : 'text-slate-800'}`}>
                            {tpl.name}
                          </h3>
                          <p className="text-sm text-slate-500 mt-1 leading-relaxed">{tpl.description}</p>
                        </div>
                        {selected && (
                          <span className="ml-3 shrink-0 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 mt-3">
                        {tpl.colors.map((color, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <div className={`w-5 h-5 rounded-full ${color} border border-slate-200`} />
                            <span className="text-xs text-slate-400">{tpl.colorLabels[i]}</span>
                          </div>
                        ))}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={handlePrev}
              disabled={step === 0}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${
                step === 0
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              上一步
            </button>
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-md shadow-indigo-200"
              >
                下一步
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-md shadow-indigo-200"
              >
                完成
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
