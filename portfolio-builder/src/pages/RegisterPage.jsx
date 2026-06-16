import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

const CAREER_OPTIONS = [
  { value: '', label: '请选择职业方向' },
  { value: '前端开发', label: '前端开发' },
  { value: '后端开发', label: '后端开发' },
  { value: '全栈开发', label: '全栈开发' },
  { value: '移动开发', label: '移动开发' },
  { value: 'UI设计', label: 'UI设计' },
  { value: '数据科学', label: '数据科学' },
  { value: '产品经理', label: '产品经理' },
  { value: '其他', label: '其他' },
]

const RegisterPage = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [careerDirection, setCareerDirection] = useState('')
  const [validationError, setValidationError] = useState('')
  const navigate = useNavigate()
  const { register, isLoading, error } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setValidationError('')

    if (!username || !email || !password || !confirmPassword || !careerDirection) {
      setValidationError('所有字段均为必填')
      return
    }
    if (password !== confirmPassword) {
      setValidationError('两次输入的密码不一致')
      return
    }

    await register(username, email, password, careerDirection)
    if (useAuthStore.getState().isAuthenticated) {
      navigate('/wizard')
    }
  }

  const displayError = validationError || error

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20">
      <div className="w-full max-w-md mx-4 bg-surface rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-text mb-2">注册</h1>
        <p className="text-text-muted text-center mb-8">创建账号，开始构建你的作品集</p>

        {displayError && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            {displayError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface-alt text-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
              placeholder="请输入用户名"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface-alt text-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
              placeholder="请输入邮箱"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface-alt text-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
              placeholder="请输入密码"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">确认密码</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface-alt text-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
              placeholder="请再次输入密码"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">职业方向</label>
            <select
              value={careerDirection}
              onChange={(e) => setCareerDirection(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface-alt text-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
              required
            >
              {CAREER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isLoading ? '注册中...' : '注册'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          已有账号？{' '}
          <Link to="/login" className="text-primary hover:text-primary-dark font-medium transition">
            立即登录
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
