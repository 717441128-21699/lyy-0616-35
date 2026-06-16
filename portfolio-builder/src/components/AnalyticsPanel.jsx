import { useEffect, useMemo } from 'react'
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
} from 'recharts'

const PIE_COLORS = [
  '#6366f1', '#818cf8', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899',
]

const MOCK_TREND = Array.from({ length: 7 }, (_, i) => ({
  day: `Day ${i + 1}`,
  pv: Math.floor(Math.random() * 80) + 20,
}))

export default function AnalyticsPanel() {
  const portfolio = usePortfolioStore((s) => s.portfolio)
  const recordVisit = usePortfolioStore((s) => s.recordVisit)
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
  }, [])

  const { pv, uv, regions } = portfolio.analytics

  const displayRegions = useMemo(() => {
    if (regions && regions.length > 0) return regions
    return [
      { name: '北京', count: 12 },
      { name: '上海', count: 9 },
      { name: '广州', count: 7 },
      { name: '深圳', count: 6 },
      { name: '杭州', count: 5 },
      { name: '成都', count: 4 },
      { name: '武汉', count: 3 },
      { name: '南京', count: 2 },
    ]
  }, [regions])

  const avgRatio = uv > 0 ? (pv / uv).toFixed(2) : '—'

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-lg font-bold text-text dark:text-text-dark">概览数据</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface dark:bg-surface-dark-alt border border-border dark:border-border-dark rounded-xl p-5">
          <p className="text-sm text-text-muted dark:text-text-dark-muted mb-1">总访问量 (PV)</p>
          <p className="text-3xl font-bold text-primary">{pv || 0}</p>
        </div>
        <div className="bg-surface dark:bg-surface-dark-alt border border-border dark:border-border-dark rounded-xl p-5">
          <p className="text-sm text-text-muted dark:text-text-dark-muted mb-1">独立访客 (UV)</p>
          <p className="text-3xl font-bold text-secondary">{uv || 0}</p>
        </div>
        <div className="bg-surface dark:bg-surface-dark-alt border border-border dark:border-border-dark rounded-xl p-5">
          <p className="text-sm text-text-muted dark:text-text-dark-muted mb-1">平均 PV/UV</p>
          <p className="text-3xl font-bold text-accent">{avgRatio}</p>
        </div>
      </div>

      <div className="bg-surface dark:bg-surface-dark-alt border border-border dark:border-border-dark rounded-xl p-5">
        <h3 className="text-base font-semibold text-text dark:text-text-dark mb-4">地域分布</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={displayRegions} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <XAxis
              dataKey="name"
              tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--color-border)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--color-border)' }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                borderRadius: 8,
                fontSize: 13,
              }}
            />
            <Bar dataKey="count" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface dark:bg-surface-dark-alt border border-border dark:border-border-dark rounded-xl p-5">
          <h3 className="text-base font-semibold text-text dark:text-text-dark mb-4">访客趋势（过去7天）</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={MOCK_TREND} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <XAxis
                dataKey="day"
                tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--color-border)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--color-border)' }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  borderRadius: 8,
                  fontSize: 13,
                }}
              />
              <Bar dataKey="pv" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-surface dark:bg-surface-dark-alt border border-border dark:border-border-dark rounded-xl p-5">
          <h3 className="text-base font-semibold text-text dark:text-text-dark mb-4">地域占比</h3>
          <ResponsiveContainer width="100%" height={250}>
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
        </div>
      </div>
    </div>
  )
}
