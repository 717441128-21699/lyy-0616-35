import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'
import usePortfolioStore from '../store/usePortfolioStore'
import {
  Globe, Copy, Check, ExternalLink, Unplug, ShieldCheck, XCircle,
  Eye, AlertTriangle, Calendar, Tag, ChevronRight, Sparkles,
  History, RotateCcw, ChevronDown, ChevronUp, Clock, FileText
} from 'lucide-react'

function checkMissingContent(portfolio, modules) {
  const missing = []
  const bio = portfolio.bio || {}
  const bioIsObject = typeof bio === 'object'

  if (!modules.bio) missing.push({ key: 'bio', label: '个人简介', section: '内容模块', reason: '已关闭显示', type: 'info' })
  if (modules.bio && (!bio || (bioIsObject && !bio.name))) {
    missing.push({ key: 'bio', label: '个人简介-姓名', section: '基础信息', reason: '未填写姓名', type: 'warning' })
  }
  if (modules.bio && (!bio || (bioIsObject && !bio.title))) {
    missing.push({ key: 'bio', label: '个人简介-职位', section: '基础信息', reason: '未填写职位头衔', type: 'warning' })
  }

  if (!modules.projects) missing.push({ key: 'projects', label: '项目经历', section: '内容模块', reason: '已关闭显示', type: 'info' })
  if (modules.projects && (!portfolio.projects || portfolio.projects.length === 0)) {
    missing.push({ key: 'projects', label: '项目经历', section: '作品内容', reason: '未添加任何项目', type: 'warning' })
  }

  if (!modules.skills) missing.push({ key: 'skills', label: '技能标签', section: '内容模块', reason: '已关闭显示', type: 'info' })
  if (modules.skills && (!portfolio.skills || portfolio.skills.length === 0)) {
    missing.push({ key: 'skills', label: '技能标签', section: '个人能力', reason: '未添加任何技能', type: 'info' })
  }

  if (!modules.workExperience) missing.push({ key: 'workExperience', label: '工作经历', section: '内容模块', reason: '已关闭显示', type: 'info' })
  if (modules.workExperience && (!portfolio.workExperience || portfolio.workExperience.length === 0)) {
    missing.push({ key: 'workExperience', label: '工作经历', section: '职业背景', reason: '未添加任何工作经历', type: 'warning' })
  }

  if (!modules.blog) missing.push({ key: 'blog', label: '博客文章', section: '内容模块', reason: '已关闭显示', type: 'info' })

  if (!modules.contact) missing.push({ key: 'contact', label: '联系方式', section: '内容模块', reason: '已关闭显示', type: 'info' })
  if (modules.contact) {
    const contact = portfolio.contact || {}
    const hasContact = contact.email || contact.phone || contact.github || contact.website
    if (!hasContact) {
      missing.push({ key: 'contact', label: '联系方式', section: '联系信息', reason: '未填写任何联系方式', type: 'info' })
    }
  }

  const seo = portfolio.seo || {}
  if (!seo.title || !seo.description) {
    missing.push({ key: 'seo', label: 'SEO 设置', section: '优化配置', reason: '未填写 SEO 标题或描述', type: 'info' })
  }

  return missing
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${min}`
}

export default function PublishPanel() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const portfolio = usePortfolioStore((s) => s.portfolio)
  const publish = usePortfolioStore((s) => s.publish)
  const unpublish = usePortfolioStore((s) => s.unpublish)
  const restoreVersion = usePortfolioStore((s) => s.restoreVersion)
  const updateDomain = usePortfolioStore((s) => s.updateDomain)

  const [customDomain, setCustomDomain] = useState(portfolio.domain.customDomain || '')
  const [verifying, setVerifying] = useState(false)
  const [verifyResult, setVerifyResult] = useState(null)
  const [copied, setCopied] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [showPublishConfirm, setShowPublishConfirm] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [publishSuccess, setPublishSuccess] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [restoreConfirmVersion, setRestoreConfirmVersion] = useState(null)

  const username = user?.username || ''
  const subdomain = `${username}.site`
  const publicUrl = `https://${subdomain}`
  const localPublicUrl = `/p/${username}`
  const previewUrl = `/preview/${username}`
  const isPublished = portfolio.isPublished
  const publishVersion = portfolio.publishVersion || 0
  const lastPublishedAt = portfolio.lastPublishedAt
  const modules = portfolio.modules || {}
  const publishHistory = portfolio.publishHistory || []
  const hasDraftChanges = isPublished && portfolio.publishedSnapshot && (
    JSON.stringify(portfolio.bio) !== JSON.stringify(portfolio.publishedSnapshot.bio) ||
    JSON.stringify(portfolio.projects) !== JSON.stringify(portfolio.publishedSnapshot.projects) ||
    JSON.stringify(portfolio.skills) !== JSON.stringify(portfolio.publishedSnapshot.skills) ||
    JSON.stringify(portfolio.workExperience) !== JSON.stringify(portfolio.publishedSnapshot.workExperience) ||
    JSON.stringify(portfolio.blogPosts) !== JSON.stringify(portfolio.publishedSnapshot.blogPosts) ||
    JSON.stringify(portfolio.contact) !== JSON.stringify(portfolio.publishedSnapshot.contact) ||
    JSON.stringify(portfolio.modules) !== JSON.stringify(portfolio.publishedSnapshot.modules) ||
    JSON.stringify(portfolio.theme) !== JSON.stringify(portfolio.publishedSnapshot.theme) ||
    JSON.stringify(portfolio.seo) !== JSON.stringify(portfolio.publishedSnapshot.seo)
  )

  const missingItems = checkMissingContent(portfolio, modules)
  const criticalMissing = missingItems.filter((m) => m.type === 'warning')
  const hasCriticalIssues = criticalMissing.length > 0

  const handlePublish = async () => {
    setPublishing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      publish(username)
      setPublishSuccess(true)
      setTimeout(() => setPublishSuccess(false), 3000)
    } finally {
      setPublishing(false)
      setShowPublishConfirm(false)
    }
  }

  const handleUnpublish = () => {
    unpublish(username)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(subdomain)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const handleRestoreVersion = (version) => {
    restoreVersion(username, version)
    setRestoreConfirmVersion(null)
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text dark:text-text-dark">发布管理</h2>
          <p className="text-text-muted dark:text-text-dark-muted mt-1">管理作品集的发布状态和域名配置</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(previewUrl)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-primary border border-primary hover:bg-primary/5 transition-colors"
          >
            <Eye size={16} />
            实时预览
          </button>
          {isPublished && (
            <button
              onClick={() => window.open(localPublicUrl, '_blank', 'noopener,noreferrer')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
            >
              <ExternalLink size={16} />
              访问公开页
            </button>
          )}
        </div>
      </div>

      {hasDraftChanges && (
        <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">草稿有未发布的更改</p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
              你在编辑区修改了内容，这些更改目前只在实时预览中可见。访客看到的仍然是上次发布的版本，确认发布后才会更新公开链接。
            </p>
          </div>
        </div>
      )}

      <section className="bg-surface dark:bg-surface-dark-alt rounded-xl border border-border dark:border-border-dark p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${isPublished ? 'bg-green-100 dark:bg-green-900/30' : 'bg-slate-100 dark:bg-slate-800'}`}>
              <Globe size={20} className={isPublished ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text dark:text-text-dark">
                发布状态
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${isPublished ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                  {isPublished ? <Check size={12} /> : <XCircle size={12} />}
                  {isPublished ? '已发布' : '未发布'}
                </span>
                {isPublished && publishVersion > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    <Tag size={12} />
                    版本 v{publishVersion}
                  </span>
                )}
                {isPublished && lastPublishedAt && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-text-muted dark:text-text-dark-muted">
                    <Calendar size={12} />
                    {formatDate(lastPublishedAt)}
                  </span>
                )}
                {hasDraftChanges && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    <FileText size={12} />
                    有未发布更改
                  </span>
                )}
              </div>
            </div>
          </div>
          {publishSuccess && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium animate-fade-in">
              <Check size={16} />
              发布成功！
            </div>
          )}
        </div>

        {isPublished ? (
          <div className="space-y-4 pt-2">
            <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">你的作品集已上线</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-blue-600 dark:text-blue-400 shrink-0">公开链接</span>
                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-sm font-mono text-blue-600 dark:text-blue-400 hover:underline truncate"
                  >
                    {publicUrl}
                  </a>
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                    {copiedLink ? '已复制' : '复制链接'}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-blue-600 dark:text-blue-400 shrink-0">本地访问</span>
                  <a
                    href={localPublicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-sm font-mono text-blue-600 dark:text-blue-400 hover:underline truncate"
                  >
                    {window.location.origin}{localPublicUrl}
                  </a>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => navigate(previewUrl)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-primary border border-primary hover:bg-primary/5 transition-colors"
              >
                <Eye size={16} />
                打开实时预览
              </button>
              <button
                onClick={handleUnpublish}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/30 transition-colors"
              >
                <Unplug size={16} />
                取消发布
              </button>
            </div>
            <p className="text-xs text-text-muted dark:text-text-dark-muted">
              取消发布后，公开链接将显示未发布页面，但编辑区和预览内容都会保留。
            </p>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {missingItems.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-text dark:text-text-dark flex items-center gap-1.5">
                  <AlertTriangle size={16} className="text-amber-500" />
                  发布前检查（{criticalMissing.length} 项待完善）：
                </p>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {missingItems.map((item, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                        item.type === 'warning'
                          ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
                          : 'bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span className={`shrink-0 ${item.type === 'warning' ? 'text-amber-500' : 'text-slate-400'}`}>
                        {item.type === 'warning' ? <AlertTriangle size={14} /> : <XCircle size={14} />}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-white dark:bg-slate-700 text-text-muted dark:text-text-dark-muted shrink-0">
                        {item.section}
                      </span>
                      <span className="font-medium text-text dark:text-text-dark">{item.label}</span>
                      <span className="text-text-muted dark:text-text-dark-muted ml-auto">
                        {item.reason}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => navigate(previewUrl)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-primary border border-primary hover:bg-primary/5 transition-colors"
              >
                <Eye size={16} />
                先预览效果
              </button>
              <button
                onClick={() => setShowPublishConfirm(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
              >
                <Sparkles size={16} />
                {hasCriticalIssues ? '仍要发布' : '立即发布'}
              </button>
            </div>
          </div>
        )}
      </section>

      {publishHistory.length > 0 && (
        <section className="bg-surface dark:bg-surface-dark-alt rounded-xl border border-border dark:border-border-dark p-5 space-y-4">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <History size={18} className="text-primary" />
              <h3 className="text-lg font-semibold text-text dark:text-text-dark">版本历史</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-text-muted dark:text-text-dark-muted">
                {publishHistory.length} 个版本
              </span>
            </div>
            {showHistory ? <ChevronUp size={18} className="text-text-muted dark:text-text-dark-muted" /> : <ChevronDown size={18} className="text-text-muted dark:text-text-dark-muted" />}
          </button>

          {showHistory && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {publishHistory.map((entry) => (
                <div
                  key={entry.version}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                    entry.version === publishVersion
                      ? 'border-primary/30 bg-primary/5 dark:bg-primary/10'
                      : 'border-border dark:border-border-dark hover:bg-surface-alt dark:hover:bg-surface-dark'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      entry.version === publishVersion
                        ? 'bg-primary text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-text-muted dark:text-text-dark-muted'
                    }`}>
                      {entry.version}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-text dark:text-text-dark">v{entry.version}</span>
                      {entry.version === publishVersion && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">当前版本</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-text-muted dark:text-text-dark-muted">
                      <Clock size={12} />
                      {formatDate(entry.publishedAt)}
                    </div>
                    <p className="mt-1.5 text-sm text-text-secondary dark:text-text-dark-secondary truncate">
                      {entry.summary}
                    </p>
                  </div>
                  {entry.version !== publishVersion && (
                    <button
                      onClick={() => setRestoreConfirmVersion(entry.version)}
                      className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 dark:text-amber-400 dark:bg-amber-900/20 dark:hover:bg-amber-900/30 transition-colors"
                    >
                      <RotateCcw size={12} />
                      恢复
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {restoreConfirmVersion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark max-w-md w-full shadow-2xl animate-fade-in">
            <div className="p-5 border-b border-border dark:border-border-dark">
              <h3 className="text-lg font-semibold text-text dark:text-text-dark">恢复到版本 v{restoreConfirmVersion}</h3>
              <p className="text-sm text-text-muted dark:text-text-dark-muted mt-1">
                这将用该版本的内容替换你当前的草稿，但你仍需重新发布才能更新公开链接
              </p>
            </div>
            <div className="p-5 flex gap-2 justify-end">
              <button
                onClick={() => setRestoreConfirmVersion(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted dark:text-text-dark-muted hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => handleRestoreVersion(restoreConfirmVersion)}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 transition-colors"
              >
                <RotateCcw size={16} />
                确认恢复
              </button>
            </div>
          </div>
        </div>
      )}

      {showPublishConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark max-w-md w-full shadow-2xl animate-fade-in">
            <div className="p-5 border-b border-border dark:border-border-dark">
              <h3 className="text-lg font-semibold text-text dark:text-text-dark">确认发布作品集</h3>
              <p className="text-sm text-text-muted dark:text-text-dark-muted mt-1">
                发布后，公开链接将展示当前草稿的快照，访客看到的是此版本的内容
              </p>
            </div>
            <div className="p-5">
              {hasCriticalIssues && (
                <div className="mb-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle size={14} />
                    仍有 {criticalMissing.length} 项内容待完善
                  </p>
                  <div className="mt-2 space-y-1">
                    {criticalMissing.slice(0, 3).map((item, i) => (
                      <p key={i} className="text-xs text-amber-700 dark:text-amber-400">
                        • {item.label}：{item.reason}
                      </p>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-2 text-sm text-text dark:text-text-dark">
                <p>发布内容包括：</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(modules).filter(([_, v]) => v).map(([key]) => {
                    const labels = { bio: '个人简介', projects: '项目经历', skills: '技能标签', workExperience: '工作经历', blog: '博客文章', contact: '联系方式' }
                    return (
                      <div key={key} className="flex items-center gap-2 text-sm">
                        <Check size={14} className="text-green-500" />
                        {labels[key] || key}
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="mt-5 flex gap-2 justify-end">
                <button
                  onClick={() => setShowPublishConfirm(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted dark:text-text-dark-muted hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handlePublish}
                  disabled={publishing}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {publishing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      发布中
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      确认发布
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
              <>
                <ShieldCheck size={16} />
                验证CNAME
              </>
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

      <section className="bg-gradient-to-r from-primary/10 to-transparent dark:from-primary/20 dark:to-transparent rounded-xl border border-primary/20 dark:border-primary/30 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-text dark:text-text-dark flex items-center gap-2">
              <Eye size={18} className="text-primary" />
              实时预览
            </h3>
            <p className="text-sm text-text-muted dark:text-text-dark-muted mt-1">
              预览当前草稿的效果，切换模块、模板、主题时会即时更新，不会计入访客统计，不会影响已发布的公开页面
            </p>
          </div>
          <button
            onClick={() => navigate(previewUrl)}
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
          >
            打开预览
            <ChevronRight size={16} />
          </button>
        </div>
      </section>
    </div>
  )
}
