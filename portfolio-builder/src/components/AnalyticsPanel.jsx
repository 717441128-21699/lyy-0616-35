import { useMemo } from 'react'
import usePortfolioStore from '../store/usePortfolioStore'
import useAuthStore from '../store/useAuthStore'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts'
import {
  BarChart3,
  Users,
  Eye,
  MapPin,
  Clock,
  Activity,
  Zap,
  Inbox,
  ArrowRightCircle,
  Globe2
} from 'lucide-react'

const PIE_COLORS = [
  '#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6',
]

const SOURCE_COLORS = [
  '#6366f1', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6',
]

function formatTime(timestamp) {
  if (!timestamp) return ''
  const d = new Date(timestamp)
  const now = new Date()
  const diffMs = now - d
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return '刚刚'
  if (diffMins < 60) return `${diffMins} 分钟前`
  if (diffHours < 24) return `${diffHours} 小时前`
  if (diffDays < 7) return `${diffDays} 天前`

  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${month}-${day} ${hour}:${min}`
}

function formatDateForDisplay(dateStr) {
  if (!dateStr) return ''
  const parts = dateStr.split('-')
  if (parts.length === 3) {
    return `${parts[1]}-${parts[2]}`
  }
  return dateStr
}

function getSourceIcon(sourceName) {
  if (!sourceName) return <Globe2 size={14} />
  if (sourceName.includes('复制')) return <ArrowRightCircle size={14} />
  if (sourceName.includes('站内')) return <Activity size={14} />
  if (sourceName.includes('直接')) return <Eye size={14} />
  return <Globe2 size={14} />
}

export default function AnalyticsPanel() {
  const portfolio = usePortfolioStore((s) => s.portfolio)
  const user = useAuthStore((s) => s.user)

  const { pv = 0, uv = 0, regions = [], recentVisits = [], trend = [], sources = [] } = portfolio.analytics || {}

  const avgRatio = uv > 0 ? (pv / uv).toFixed(2) : '—'

  const hasData = pv > 0 || uv > 0 || recentVisits.length > 0

  const displayRegions = useMemo(() => {
    if (!regions || regions.length === 0) return []
    return [...regions].sort((a, b) => b.count - a.count)
  }, [regions])

  const displaySources = useMemo(() => {
    if (!sources || sources.length === 0) return []
    return [...sources].sort((a, b) => b.count - a.count)
  }, [sources])

  const displayTrend = useMemo(() => {
    if (!trend || trend.length === 0) return []
    return trend.map((d) => ({
      ...d,
      label: formatDateForDisplay(d.date),
    }))
  }, [trend])

  const displayRecent = useMemo(() => {
    if (!recentVisits || recentVisits.length === 0) return []
    return recentVisits.slice(0, 20)
  }, [recentVisits])

  const hasRegionData = displayRegions.length > 0
  const hasSourceData = displaySources.length > 0
  const hasTrendData = displayTrend.length > 0

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text dark:text-text-dark">访客统计</h2>
          <p className="text-text-muted dark:text-text-dark-muted mt-1">
            实时查看你的作品集访问数据
          </p>
        </div>
        {hasData && (
          <div className="flex items-center gap-2 text-sm text-text-muted dark:text-text-dark-muted">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
              <Activity size={12} />
              数据实时更新
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface dark:bg-surface-dark-alt border border-border dark:border-border-dark rounded-xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-text-muted dark:text-text-dark-muted mb-1">总访问量 (PV)</p>
              <p className="text-3xl font-bold text-primary">{pv}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-primary/10 dark:bg-primary/20">
              <Eye size={20} className="text-primary" />
            </div>
          </div>
          <p className="mt-2 text-xs text-text-muted dark:text-text-dark-muted">
            所有页面浏览次数总计
          </p>
        </div>
        <div className="bg-surface dark:bg-surface-dark-alt border border-border dark:border-border-dark rounded-xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-text-muted dark:text-text-dark-muted mb-1">独立访客 (UV)</p>
              <p className="text-3xl font-bold text-secondary">{uv}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-cyan-50 dark:bg-cyan-900/20">
              <Users size={20} className="text-cyan-600 dark:text-cyan-400" />
            </div>
          </div>
          <p className="mt-2 text-xs text-text-muted dark:text-text-dark-muted">
            同一浏览器不重复计数
          </p>
        </div>
        <div className="bg-surface dark:bg-surface-dark-alt border border-border dark:border-border-dark rounded-xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-text-muted dark:text-text-dark-muted mb-1">平均 PV/UV</p>
              <p className="text-3xl font-bold text-accent">{avgRatio}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20">
              <Zap size={20} className="text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <p className="mt-2 text-xs text-text-muted dark:text-text-dark-muted">
            每位访客平均浏览页面数
          </p>
        </div>
      </div>

      {!hasData ? (
        <div className="bg-surface dark:bg-surface-dark-alt border border-border dark:border-border-dark rounded-xl p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Inbox size={32} className="text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-text dark:text-text-dark mb-2">
            暂无访问数据
          </h3>
          <p className="text-text-muted dark:text-text-dark-muted text-sm max-w-md mx-auto mb-4">
            还没有访客访问过你的作品集。发布并分享你的公开链接后，访问数据将在这里实时展示。
          </p>
          {portfolio.isPublished && user && (
            <p className="text-sm text-primary">
              公开链接：<span className="font-mono">{user.username}.site</span>
            </p>
          )}
          {!portfolio.isPublished && (
            <p className="text-sm text-amber-600 dark:text-amber-400">
              你的作品集尚未发布，请先前往发布管理页面发布。
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="bg-surface dark:bg-surface-dark-alt border border-border dark:border-border-dark rounded-xl p-5">
            <h3 className="text-base font-semibold text-text dark:text-text-dark mb-4 flex items-center gap-2">
              <BarChart3 size={16} className="text-primary" />
              访客趋势（最近 {displayTrend.length} 天）
            </h3>
            {hasTrendData ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={displayTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                    axisLine={{ stroke: 'var(--color-border)' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                    axisLine={{ stroke: 'var(--color-border)' }}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      borderRadius: 8,
                      fontSize: 13,
                    }}
                  />
                  <Bar dataKey="pv" name="PV" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="uv" name="UV" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[260px] flex flex-col items-center justify-center text-text-muted dark:text-text-dark-muted">
                <Clock size={28} className="mb-2 opacity-50" />
                <p className="text-sm">暂无趋势数据</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-surface dark:bg-surface-dark-alt border border-border dark:border-border-dark rounded-xl p-5">
              <h3 className="text-base font-semibold text-text dark:text-text-dark mb-4 flex items-center gap-2">
                <ArrowRightCircle size={16} className="text-primary" />
                访问来源分布
              </h3>
              {hasSourceData ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={displaySources}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {displaySources.map((_, index) => (
                        <Cell key={index} fill={SOURCE_COLORS[index % SOURCE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-surface)',
                        borderColor: 'var(--color-border)',
                        borderRadius: 8,
                        fontSize: 13,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[280px] flex flex-col items-center justify-center text-text-muted dark:text-text-dark-muted">
                  <ArrowRightCircle size={28} className="mb-2 opacity-50" />
                  <p className="text-sm">暂无来源数据</p>
                </div>
              )}
            </div>

            <div className="bg-surface dark:bg-surface-dark-alt border border-border dark:border-border-dark rounded-xl p-5">
              <h3 className="text-base font-semibold text-text dark:text-text-dark mb-4 flex items-center gap-2">
                <MapPin size={16} className="text-primary" />
                地域分布
              </h3>
              {hasRegionData ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={displayRegions}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {displayRegions.map((_, index) => (
                        <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-surface)',
                        borderColor: 'var(--color-border)',
                        borderRadius: 8,
                        fontSize: 13,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[280px] flex flex-col items-center justify-center text-text-muted dark:text-text-dark-muted space-y-2">
                  <MapPin size={28} className="opacity-50" />
                  <p className="text-sm">暂无地域数据</p>
                  <p className="text-xs">访问地域需要获取IP地址定位，目前仅记录访问量</p>
                </div>
              )}
            </div>
          </div>

          {hasSourceData && (
            <div className="bg-surface dark:bg-surface-dark-alt border border-border dark:border-border-dark rounded-xl p-5">
              <h3 className="text-base font-semibold text-text dark:text-text-dark mb-4 flex items-center gap-2">
                <ArrowRightCircle size={16} className="text-primary" />
                来源明细
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {displaySources.map((s, i) => (
                  <div key={s.name} className="flex items-center justify-between p-3 rounded-lg bg-surface-alt dark:bg-surface-dark border border-border dark:border-border-dark">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: SOURCE_COLORS[i % SOURCE_COLORS.length] }}
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-text-muted dark:text-text-dark-muted">
                          {getSourceIcon(s.name)}
                        </span>
                        <span className="text-sm font-medium text-text dark:text-text-dark">
                          {s.name}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-text dark:text-text-dark">{s.count}</span>
                      <span className="text-xs text-text-muted dark:text-text-dark-muted">次</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-surface dark:bg-surface-dark-alt border border-border dark:border-border-dark rounded-xl p-5">
            <h3 className="text-base font-semibold text-text dark:text-text-dark mb-4 flex items-center gap-2">
              <Clock size={16} className="text-primary" />
              最近访问
              {displayRecent.length > 0 && (
                <span className="ml-auto text-xs text-text-muted dark:text-text-dark-muted font-normal">
                  共 {recentVisits.length || 0} 条记录
                </span>
              )}
            </h3>
            {displayRecent.length > 0 ? (
              <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
                {displayRecent.map((visit) => (
                  <div
                    key={visit.id}
                    className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-surface-alt dark:hover:bg-surface-dark transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${visit.isUnique ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`} />
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <ArrowRightCircle size={13} className="text-text-muted dark:text-text-dark-muted shrink-0" />
                          <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-text-muted dark:text-text-dark-muted shrink-0">
                            {visit.source || '未知来源'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 min-w-0">
                          <MapPin size={13} className="text-text-muted dark:text-text-dark-muted shrink-0" />
                          <span className="text-sm text-text-secondary dark:text-text-dark-secondary truncate">
                            {visit.region || '未知来源'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-4">
                      {visit.isUnique && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 dark:bg-primary/20 text-primary">
                          新访客
                        </span>
                      )}
                      <span className="text-xs text-text-muted dark:text-text-dark-muted font-mono whitespace-nowrap">
                        {formatTime(visit.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[200px] flex flex-col items-center justify-center text-text-muted dark:text-text-dark-muted">
                <Clock size={28} className="mb-2 opacity-50" />
                <p className="text-sm">暂无访问记录</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
