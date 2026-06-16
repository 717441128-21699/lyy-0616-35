import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { login, isLoading, error } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(username, password)
    if (useAuthStore.getState().isAuthenticated) {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20">
      <div className="w-full max-w-md mx-4 bg-surface rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-text mb-2">登录</h1>
        <p className="text-text-muted text-center mb-8">欢迎回来，请登录你的账号</p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isLoading ? '登录中...' : '登录'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          还没有账号？{' '}
          <Link to="/register" className="text-primary hover:text-primary-dark font-medium transition">
            立即注册
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
