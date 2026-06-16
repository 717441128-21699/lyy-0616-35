import { useState } from 'react'
import usePortfolioStore from '../../store/usePortfolioStore'

const SUGGESTED_SKILLS = [
  'JavaScript', 'React', 'Node.js', 'Python', 'CSS', 'TypeScript', 'Vue', 'Go', 'Docker', 'Figma',
]

export default function SkillsEditor() {
  const portfolio = usePortfolioStore((s) => s.portfolio)
  const addSkill = usePortfolioStore((s) => s.addSkill)
  const removeSkill = usePortfolioStore((s) => s.removeSkill)

  const [input, setInput] = useState('')

  const skills = portfolio.skills || []

  const handleAdd = (skill) => {
    const trimmed = (skill || input).trim()
    if (trimmed && !skills.includes(trimmed)) {
      addSkill(trimmed)
    }
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  const handleRemove = (skill) => {
    removeSkill(skill)
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-6">技能标签</h2>

      <div className="flex items-center gap-2 mb-5">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入技能名称，按 Enter 添加"
          className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
        />
        <button
          onClick={() => handleAdd()}
          disabled={!input.trim()}
          className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          添加
        </button>
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700"
            >
              {skill}
              <button
                onClick={() => handleRemove(skill)}
                className="ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-600 transition"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div>
        <h3 className="text-sm font-medium text-slate-600 mb-3">推荐技能</h3>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_SKILLS.map((skill) => {
            const alreadyAdded = skills.includes(skill)
            return (
              <button
                key={skill}
                onClick={() => !alreadyAdded && handleAdd(skill)}
                disabled={alreadyAdded}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  alreadyAdded
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
                }`}
              >
                + {skill}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
