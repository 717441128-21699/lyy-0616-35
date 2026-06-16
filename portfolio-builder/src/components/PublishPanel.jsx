import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'
import usePortfolioStore from '../store/usePortfolioStore'
import { Globe, Copy, Check, ExternalLink, Unplug, ShieldCheck, XCircle } from 'lucide-react'

export default function PublishPanel() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const portfolio = usePortfolioStore((s) => s.portfolio)
  const publish = usePortfolioStore((s) => s.publish)
  const updateDomain = usePortfolioStore((s) => s.updateDomain)

  const [customDomain, setCustomDomain] = useState(portfolio.domain.customDomain || '')
  const [verifying, setVerifying] = useState(false)
  const [verifyResult, setVerifyResult] = useState(null)
  const [copied, setCopied] = useState(false)

  const username = user?.username || ''
  const subdomain = `${username}.site`
  const isPublished = portfolio.isPublished

  const handlePublish = () => {
    publish(username)
  }

  const handleUnpublish = () => {
    updateDomain({ subdomain: '' })
    usePortfolioStore.setState((state) => ({
      portfolio: { ...state.portfolio, isPublished: false },
    }))
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(subdomain)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCustomDomainChange = (e) => {
    const value = e.target.value
    setCustomDomain(value)
    updateDomain({ customDomain: value, cnameVerified: false })
    setVerifyResult(null)
  }

  const handleVerifyCNAME = () => {
    if (!customDomain.trim()) return
    setVerifying(true)
    setVerifyResult(null)
    setTimeout(() => {
      const success = Math.random() < 0.8
      if (success) {
        updateDomain({ cnameVerified: true })
        setVerifyResult('success')
      } else {
        updateDomain({ cnameVerified: false })
        setVerifyResult('failure')
      }
      setVerifying(false)
    }, 1500)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-text dark:text-text-dark">发布管理</h2>
        <p className="text-text-muted dark:text-text-dark-muted mt-1">管理作品集的发布状态和域名配置</p>
      </div>

      <section className="bg-surface dark:bg-surface-dark-alt rounded-xl border border-border dark:border-border-dark p-5 space-y-4">
        <h3 className="text-lg font-semibold text-text dark:text-text-dark flex items-center gap-2">
          <Globe size={20} className="text-primary" />
          发布状态
        </h3>
        {isPublished ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <Check size={14} />
                已发布
              </span>
            </div>
            <p className="text-sm text-text-muted dark:text-text-dark-muted">
              你的作品集已上线，可通过以下地址访问：
            </p>
            <a
              href={`https://${subdomain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-primary hover:underline font-medium"
            >
              {subdomain}
              <ExternalLink size={14} />
            </a>
            <div>
              <button
                onClick={handleUnpublish}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/30 transition-colors"
              >
                <Unplug size={16} />
                取消发布
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                <XCircle size={14} />
                未发布
              </span>
            </div>
            <p className="text-sm text-text-muted dark:text-text-dark-muted">
              点击下方按钮将你的作品集发布到互联网上
            </p>
            <button
              onClick={handlePublish}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
            >
              <Globe size={16} />
              发布作品集
            </button>
          </div>
        )}
      </section>

      <section className="bg-surface dark:bg-surface-dark-alt rounded-xl border border-border dark:border-border-dark p-5 space-y-4">
        <h3 className="text-lg font-semibold text-text dark:text-text-dark">专属子域名</h3>
        <p className="text-sm text-text-muted dark:text-text-dark-muted">
          发布后系统将自动生成你的专属子域名
        </p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={subdomain}
            className="flex-1 px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark text-text dark:text-text-dark text-sm font-mono focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-text-muted dark:text-text-dark-muted" />}
          </button>
        </div>
      </section>

      <section className="bg-surface dark:bg-surface-dark-alt rounded-xl border border-border dark:border-border-dark p-5 space-y-4">
        <h3 className="text-lg font-semibold text-text dark:text-text-dark">自定义域名</h3>
        <p className="text-sm text-text-muted dark:text-text-dark-muted">
          绑定你自己的域名，打造个性化品牌
        </p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="例如: www.myportfolio.com"
            value={customDomain}
            onChange={handleCustomDomainChange}
            className="flex-1 px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark text-text dark:text-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-text-muted/50 dark:placeholder:text-text-dark-muted/50"
          />
          <button
            onClick={handleVerifyCNAME}
            disabled={!customDomain.trim() || verifying}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {verifying ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                验证中
              </>
            ) : (
              '验证CNAME'
            )}
          </button>
        </div>

        {customDomain.trim() && !portfolio.domain.cnameVerified && (
          <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 text-sm text-blue-700 dark:text-blue-300">
            请在您的DNS设置中添加CNAME记录，将 <strong>{customDomain}</strong> 指向 <strong>{subdomain}</strong>
          </div>
        )}

        {verifyResult === 'failure' && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-600 dark:text-red-400">
            CNAME验证失败，请检查DNS配置是否正确并稍后重试
          </div>
        )}

        {portfolio.domain.cnameVerified && (
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-green-500" />
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              已验证
            </span>
          </div>
        )}
      </section>

      <section className="bg-surface dark:bg-surface-dark-alt rounded-xl border border-border dark:border-border-dark p-5 space-y-4">
        <h3 className="text-lg font-semibold text-text dark:text-text-dark">预览链接</h3>
        <p className="text-sm text-text-muted dark:text-text-dark-muted">
          在发布前预览你的作品集效果
        </p>
        <a
          href={`/u/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.preventDefault()
            navigate(`/u/${username}`)
          }}
          className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
        >
          <ExternalLink size={16} />
          /u/{username}
        </a>
      </section>
    </div>
  )
}
