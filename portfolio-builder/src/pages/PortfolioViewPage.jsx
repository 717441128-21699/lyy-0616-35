import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Mail, Phone, Code2, Briefcase, AtSign, Globe,
  MapPin, Calendar, ExternalLink, ArrowUp, Sun, Moon, MessageCircle, Eye
} from 'lucide-react'
import usePortfolioStore from '../store/usePortfolioStore'

const COLOR_MAP = {
  indigo: { bg: 'bg-indigo-600', text: 'text-indigo-600', bgLight: 'bg-indigo-50', textDark: 'text-indigo-700', border: 'border-indigo-600', hoverBg: 'hover:bg-indigo-700', ring: 'ring-indigo-500', gradient: 'from-indigo-600 via-indigo-500 to-purple-500', bgSoft: 'bg-indigo-100', borderLight: 'border-indigo-200' },
  cyan: { bg: 'bg-cyan-600', text: 'text-cyan-600', bgLight: 'bg-cyan-50', textDark: 'text-cyan-700', border: 'border-cyan-600', hoverBg: 'hover:bg-cyan-700', ring: 'ring-cyan-500', gradient: 'from-cyan-600 via-cyan-500 to-teal-500', bgSoft: 'bg-cyan-100', borderLight: 'border-cyan-200' },
  emerald: { bg: 'bg-emerald-600', text: 'text-emerald-600', bgLight: 'bg-emerald-50', textDark: 'text-emerald-700', border: 'border-emerald-600', hoverBg: 'hover:bg-emerald-700', ring: 'ring-emerald-500', gradient: 'from-emerald-600 via-emerald-500 to-green-500', bgSoft: 'bg-emerald-100', borderLight: 'border-emerald-200' },
  rose: { bg: 'bg-rose-600', text: 'text-rose-600', bgLight: 'bg-rose-50', textDark: 'text-rose-700', border: 'border-rose-600', hoverBg: 'hover:bg-rose-700', ring: 'ring-rose-500', gradient: 'from-rose-600 via-rose-500 to-pink-500', bgSoft: 'bg-rose-100', borderLight: 'border-rose-200' },
  amber: { bg: 'bg-amber-600', text: 'text-amber-600', bgLight: 'bg-amber-50', textDark: 'text-amber-700', border: 'border-amber-600', hoverBg: 'hover:bg-amber-700', ring: 'ring-amber-500', gradient: 'from-amber-600 via-amber-500 to-orange-500', bgSoft: 'bg-amber-100', borderLight: 'border-amber-200' },
  violet: { bg: 'bg-violet-600', text: 'text-violet-600', bgLight: 'bg-violet-50', textDark: 'text-violet-700', border: 'border-violet-600', hoverBg: 'hover:bg-violet-700', ring: 'ring-violet-500', gradient: 'from-violet-600 via-violet-500 to-purple-500', bgSoft: 'bg-violet-100', borderLight: 'border-violet-200' },
}

const CONTACT_FIELDS = [
  { key: 'email', icon: Mail, label: '邮箱' },
  { key: 'phone', icon: Phone, label: '电话' },
  { key: 'wechat', icon: MessageCircle, label: '微信' },
  { key: 'github', icon: Code2, label: 'GitHub' },
  { key: 'linkedin', icon: Briefcase, label: 'LinkedIn' },
  { key: 'twitter', icon: AtSign, label: 'Twitter' },
  { key: 'website', icon: Globe, label: '网站' },
]

function formatDateRange(item) {
  const start = item.startDate || ''
  const end = item.current ? '至今' : (item.endDate || '')
  return start && end ? `${start} — ${end}` : start || end
}

function UnpublishedPage({ username }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center animate-fade-in">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
            <Eye size={40} className="text-slate-400 dark:text-slate-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            作品集暂未发布
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-mono text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
              {username}
            </span>
          </p>
          <p className="text-slate-500 dark:text-slate-400 mt-4">
            该用户的作品集尚未发布或不存在。
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
        >
          返回首页
        </Link>
      </div>
    </div>
  )
}

export default function PortfolioViewPage() {
  const { username } = useParams()
  const getPortfolioByUsername = usePortfolioStore((s) => s.getPortfolioByUsername)
  const recordVisit = usePortfolioStore((s) => s.recordVisit)
  const [showTop, setShowTop] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [visitRecorded, setVisitRecorded] = useState(false)

  const portfolioData = getPortfolioByUsername(username)
  const portfolio = portfolioData || {}
  const exists = !!portfolioData
  const isPublished = portfolio.isPublished

  useEffect(() => {
    if (exists && isPublished && !visitRecorded) {
      recordVisit(username)
      setVisitRecorded(true)
    }
  }, [exists, isPublished, visitRecorded, username, recordVisit])

  const bio = portfolio.bio || {}
  const projects = portfolio.projects || []
  const skills = portfolio.skills || []
  const workExperience = portfolio.workExperience || []
  const blogPosts = portfolio.blogPosts || []
  const contact = portfolio.contact || {}
  const modules = portfolio.modules || {}
  const theme = portfolio.theme || {}
  const seo = portfolio.seo || {}

  const templateId = theme.templateId || 'modern'
  const colorScheme = theme.colorScheme || 'indigo'
  const layout = theme.layout || 'centered'
  const c = COLOR_MAP[colorScheme] || COLOR_MAP.indigo

  useEffect(() => {
    document.title = seo.title || `${bio.name || username} - 个人作品集`
    let meta = document.querySelector('meta[name="description"]')
    if (meta) {
      meta.setAttribute('content', seo.description || '')
    } else {
      meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = seo.description || ''
      document.head.appendChild(meta)
    }
  }, [seo.title, seo.description, bio.name, username])

  useEffect(() => {
    setIsDark(theme.darkMode || false)
  }, [theme.darkMode])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleDark = () => {
    setIsDark((d) => !d)
  }

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const baseBg = isDark ? 'bg-gray-950' : 'bg-white'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const textMuted = isDark ? 'text-gray-500' : 'text-gray-400'
  const cardBg = isDark ? 'bg-gray-900' : 'bg-white'
  const cardBorder = isDark ? 'border-gray-800' : 'border-gray-200'
  const surfaceBg = isDark ? 'bg-gray-900/50' : 'bg-gray-50'

  if (!exists || !isPublished) {
    return <UnpublishedPage username={username} />
  }

  const heroSection = () => {
    if (!modules.bio && !bio.name) return null
    if (templateId === 'modern') {
      return (
        <section className="relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-95`} />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
          <div className="relative mx-auto px-6 py-20 sm:py-28">
            <div className="flex flex-col items-center text-center">
              {bio.avatar && (
                <img src={bio.avatar} alt={bio.name} className="h-28 w-28 rounded-full border-4 border-white/30 object-cover shadow-2xl mb-6" onError={(e) => { e.target.style.display = 'none' }} />
              )}
              {!bio.avatar && (
                <div className="h-28 w-28 rounded-full border-4 border-white/30 bg-white/20 flex items-center justify-center shadow-2xl mb-6 text-4xl font-bold text-white">
                  {(bio.name || 'U')[0]}
                </div>
              )}
              <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">{bio.name || username}</h1>
              {bio.title && <p className="mt-3 text-xl text-white/80 font-light">{bio.title}</p>}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-white/70 text-sm">
                {bio.location && <span className="flex items-center gap-1.5"><MapPin size={15} />{bio.location}</span>}
                {bio.email && <span className="flex items-center gap-1.5"><Mail size={15} />{bio.email}</span>}
              </div>
              {bio.bio && <p className="mt-6 max-w-2xl text-white/70 leading-relaxed">{bio.bio}</p>}
            </div>
          </div>
        </section>
      )
    }
    if (templateId === 'minimal') {
      return (
        <section className="pt-20 pb-12">
          <div className="text-center">
            <h1 className={`text-4xl sm:text-5xl font-light tracking-tight ${textPrimary}`}>{bio.name || username}</h1>
            {bio.title && <p className={`mt-3 text-lg ${textSecondary} font-light`}>{bio.title}</p>}
            {bio.location && (
              <p className={`mt-2 flex items-center justify-center gap-1.5 text-sm ${textMuted}`}>
                <MapPin size={14} />{bio.location}
              </p>
            )}
            {bio.bio && <p className={`mt-6 max-w-xl mx-auto leading-relaxed ${textSecondary}`}>{bio.bio}</p>}
          </div>
          <div className={`mt-10 h-px ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`} />
        </section>
      )
    }
    return (
      <section className="relative overflow-hidden pt-16 pb-14">
        <div className={`absolute top-0 left-0 w-64 h-64 ${c.bgSoft} rounded-full -translate-x-1/2 -translate-y-1/2 opacity-60`} />
        <div className={`absolute bottom-0 right-0 w-80 h-80 ${c.bgSoft} rounded-full translate-x-1/3 translate-y-1/3 opacity-40`} />
        <div className="absolute top-10 right-10 w-20 h-20 rotate-45 border-4 opacity-20" style={{ borderColor: 'currentColor' }} />
        <div className="relative text-center">
          {bio.avatar && (
            <img src={bio.avatar} alt={bio.name} className="mx-auto h-32 w-32 rounded-2xl border-4 object-cover shadow-xl mb-6 rotate-3 hover:rotate-0 transition-transform duration-300" onError={(e) => { e.target.style.display = 'none' }} />
          )}
          {!bio.avatar && (
            <div className={`mx-auto h-32 w-32 rounded-2xl ${c.bg} flex items-center justify-center shadow-xl mb-6 text-5xl font-black text-white rotate-3 hover:rotate-0 transition-transform duration-300`}>
              {(bio.name || 'U')[0]}
            </div>
          )}
          <h1 className={`text-5xl sm:text-6xl font-black ${textPrimary} tracking-tight`}>{bio.name || username}</h1>
          {bio.title && <p className={`mt-2 text-xl ${c.text} font-bold`}>{bio.title}</p>}
          {bio.location && (
            <p className={`mt-3 flex items-center justify-center gap-1.5 text-sm ${textSecondary}`}>
              <MapPin size={15} className={c.text} />{bio.location}
            </p>
          )}
          {bio.bio && <p className={`mt-6 max-w-2xl mx-auto leading-relaxed ${textSecondary}`}>{bio.bio}</p>}
        </div>
      </section>
    )
  }

  const projectsSection = () => {
    if (!modules.projects || projects.length === 0) return null
    const cardClass = templateId === 'modern'
      ? `rounded-xl shadow-lg overflow-hidden ${cardBg} border ${cardBorder} hover:shadow-xl transition-shadow duration-300`
      : templateId === 'minimal'
      ? `rounded-lg border ${cardBorder} overflow-hidden ${cardBg} transition-colors duration-200`
      : `rounded-xl overflow-hidden ${cardBg} border-l-4 ${c.border} shadow-md hover:rotate-[-0.5deg] hover:shadow-xl transition-all duration-300`
    return (
      <section className="py-14">
        <h2 className={`text-2xl font-bold ${textPrimary} mb-8 ${templateId === 'creative' ? 'inline-block relative' : ''}`}>
          项目作品
          {templateId === 'creative' && <span className={`absolute -bottom-1 left-0 h-1 w-full ${c.bg} rounded-full`} />}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {projects.map((p) => (
            <div key={p.id} className={cardClass}>
              <div className={`h-44 w-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'} overflow-hidden`}>
                {p.coverImage ? (
                  <img src={p.coverImage} alt={p.title} className="h-full w-full object-cover hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.style.display = 'none' }} />
                ) : (
                  <div className={`h-full w-full flex items-center justify-center text-4xl font-bold ${isDark ? 'text-gray-700' : 'text-gray-300'}`}>
                    {(p.title || 'P')[0]}
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className={`text-lg font-semibold ${textPrimary}`}>{p.title}</h3>
                {p.description && <p className={`mt-2 text-sm ${textSecondary} line-clamp-2`}>{p.description}</p>}
                {p.link && (
                  <a href={p.link} target="_blank" rel="noopener noreferrer" className={`mt-3 inline-flex items-center gap-1 text-sm ${c.text} hover:underline font-medium`}>
                    <ExternalLink size={14} />查看项目
                  </a>
                )}
                {p.tags && p.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.tags.map((tag, i) => (
                      <span key={i} className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full ${templateId === 'creative' ? `${c.bgSoft} ${c.textDark} -rotate-1` : templateId === 'minimal' ? `${isDark ? 'border-gray-700 text-gray-400' : 'border-gray-300 text-gray-600'} border` : `${c.bgLight} ${c.textDark}`}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  const skillsSection = () => {
    if (!modules.skills || skills.length === 0) return null
    const tagClass = templateId === 'modern'
      ? `px-4 py-1.5 rounded-full text-sm font-medium ${c.bg} text-white shadow-sm hover:shadow-md transition-shadow`
      : templateId === 'minimal'
      ? `px-4 py-1.5 rounded-full text-sm font-medium border ${isDark ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-700'} hover:${isDark ? 'bg-gray-800' : 'bg-gray-100'} transition-colors`
      : `px-4 py-1.5 rounded-full text-sm font-bold ${c.bgSoft} ${c.textDark} -rotate-2 hover:rotate-0 skew-x-[-3deg] transition-transform inline-block`
    return (
      <section className="py-14">
        <h2 className={`text-2xl font-bold ${textPrimary} mb-8 ${templateId === 'creative' ? 'inline-block relative' : ''}`}>
          技能特长
          {templateId === 'creative' && <span className={`absolute -bottom-1 left-0 h-1 w-full ${c.bg} rounded-full`} />}
        </h2>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill, i) => (
            <span key={i} className={tagClass}>{skill}</span>
          ))}
        </div>
      </section>
    )
  }

  const workSection = () => {
    if (!modules.workExperience || workExperience.length === 0) return null
    return (
      <section className="py-14">
        <h2 className={`text-2xl font-bold ${textPrimary} mb-8 ${templateId === 'creative' ? 'inline-block relative' : ''}`}>
          工作经历
          {templateId === 'creative' && <span className={`absolute -bottom-1 left-0 h-1 w-full ${c.bg} rounded-full`} />}
        </h2>
        <div className="relative">
          {workExperience.length > 1 && (
            <div className={`absolute left-[11px] top-3 bottom-3 w-0.5 ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`} />
          )}
          <div className="space-y-6">
            {workExperience.map((item) => (
              <div key={item.id} className="relative pl-8">
                <div className={`absolute left-0 top-2 w-6 h-6 rounded-full ${c.bgLight} border-2 ${c.border} flex items-center justify-center`}>
                  <div className={`w-2 h-2 rounded-full ${c.bg}`} />
                </div>
                <div className={`p-5 rounded-xl ${surfaceBg} border ${cardBorder}`}>
                  <h3 className={`font-semibold ${textPrimary}`}>{item.company}</h3>
                  <p className={`text-sm ${textSecondary} mt-0.5`}>{item.position}</p>
                  <p className={`text-xs ${c.text} mt-1 flex items-center gap-1`}>
                    <Calendar size={12} />{formatDateRange(item)}
                  </p>
                  {item.description && <p className={`mt-3 text-sm ${textSecondary} leading-relaxed`}>{item.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  const blogSection = () => {
    if (!modules.blog || blogPosts.length === 0) return null
    return (
      <section className="py-14">
        <h2 className={`text-2xl font-bold ${textPrimary} mb-8 ${templateId === 'creative' ? 'inline-block relative' : ''}`}>
          博客文章
          {templateId === 'creative' && <span className={`absolute -bottom-1 left-0 h-1 w-full ${c.bg} rounded-full`} />}
        </h2>
        {templateId === 'minimal' ? (
          <div className="space-y-4">
            {blogPosts.map((post) => (
              <div key={post.id} className={`p-5 rounded-lg border ${cardBorder} ${cardBg} transition-colors`}>
                <h3 className={`font-semibold ${textPrimary}`}>{post.title}</h3>
                <div className={`mt-1 flex items-center gap-2 text-xs ${textMuted}`}>
                  {post.date && <span className="flex items-center gap-1"><Calendar size={12} />{post.date}</span>}
                </div>
                {post.content && <p className={`mt-3 text-sm ${textSecondary} line-clamp-2`}>{post.content.length > 120 ? post.content.slice(0, 120) + '…' : post.content}</p>}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {post.tags.map((tag, i) => (
                      <span key={i} className={`px-2 py-0.5 text-xs font-medium ${c.bgLight} ${c.textDark} rounded-full`}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : templateId === 'creative' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {blogPosts.map((post, idx) => (
              <div key={post.id} className={`p-6 rounded-xl ${cardBg} border ${cardBorder} ${idx % 2 === 0 ? 'border-t-4' : 'border-b-4'} ${c.border} shadow-sm hover:shadow-lg transition-shadow`}>
                <h3 className={`font-bold text-lg ${textPrimary}`}>{post.title}</h3>
                {post.date && <p className={`mt-1 text-xs ${c.text} flex items-center gap-1`}><Calendar size={12} />{post.date}</p>}
                {post.content && <p className={`mt-3 text-sm ${textSecondary} line-clamp-3`}>{post.content}</p>}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag, i) => (
                      <span key={i} className={`px-2.5 py-0.5 text-xs font-bold ${c.bgSoft} ${c.textDark} rounded-full -rotate-1 inline-block`}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {blogPosts.map((post) => (
              <div key={post.id} className={`p-6 rounded-xl ${cardBg} border ${cardBorder} shadow-sm hover:shadow-md transition-shadow`}>
                <h3 className={`font-semibold ${textPrimary}`}>{post.title}</h3>
                {post.date && <p className={`mt-2 text-xs ${c.text} flex items-center gap-1`}><Calendar size={12} />{post.date}</p>}
                {post.content && <p className={`mt-3 text-sm ${textSecondary} line-clamp-3`}>{post.content}</p>}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {post.tags.map((tag, i) => (
                      <span key={i} className={`px-2.5 py-0.5 text-xs font-medium ${c.bgLight} ${c.textDark} rounded-full`}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    )
  }

  const contactSection = () => {
    if (!modules.contact) return null
    const filledFields = CONTACT_FIELDS.filter((f) => contact[f.key])
    if (filledFields.length === 0) return null
    if (templateId === 'modern') {
      return (
        <section className="py-14">
          <h2 className={`text-2xl font-bold ${textPrimary} mb-8`}>联系方式</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filledFields.map(({ key, icon: Icon, label }) => (
              <div key={key} className={`flex items-center gap-4 p-4 rounded-xl ${surfaceBg} border ${cardBorder} transition-colors`}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${c.bgLight}`}>
                  <Icon size={18} className={c.text} />
                </div>
                <div>
                  <p className={`text-xs ${textMuted}`}>{label}</p>
                  <p className={`text-sm font-medium ${textPrimary}`}>
                    {['github', 'linkedin', 'twitter', 'website'].includes(key) ? (
                      <a href={contact[key]} target="_blank" rel="noopener noreferrer" className={`hover:underline ${c.text}`}>{contact[key]}</a>
                    ) : (
                      contact[key]
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )
    }
    if (templateId === 'minimal') {
      return (
        <section className="py-14">
          <h2 className={`text-2xl font-bold ${textPrimary} mb-8`}>联系方式</h2>
          <div className="space-y-3">
            {filledFields.map(({ key, icon: Icon, label }) => (
              <div key={key} className={`flex items-center gap-3 py-2 ${textSecondary}`}>
                <Icon size={16} className={c.text} />
                <span className={`text-sm ${textMuted}`}>{label}:</span>
                {['github', 'linkedin', 'twitter', 'website'].includes(key) ? (
                  <a href={contact[key]} target="_blank" rel="noopener noreferrer" className={`text-sm ${textPrimary} hover:underline`}>{contact[key]}</a>
                ) : (
                  <span className={`text-sm ${textPrimary}`}>{contact[key]}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )
    }
    return (
      <section className="py-14">
        <h2 className={`text-2xl font-bold ${textPrimary} mb-8 inline-block relative`}>
          联系方式
          <span className={`absolute -bottom-1 left-0 h-1 w-full ${c.bg} rounded-full`} />
        </h2>
        <div className={`p-8 rounded-2xl ${c.gradient} text-white shadow-lg`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {filledFields.map(({ key, icon: Icon, label }) => (
              <div key={key} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/20">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-xs text-white/70">{label}</p>
                  {['github', 'linkedin', 'twitter', 'website'].includes(key) ? (
                    <a href={contact[key]} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:underline">{contact[key]}</a>
                  ) : (
                    <p className="text-sm font-medium">{contact[key]}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  const pageContent = (
    <>
      {heroSection()}
      {projectsSection()}
      {skillsSection()}
      {workSection()}
      {blogSection()}
      {contactSection()}
    </>
  )

  const layoutWrap = (content) => {
    if (layout === 'sidebar') {
      return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className={`lg:w-72 shrink-0 ${cardBg} rounded-2xl border ${cardBorder} p-6 h-fit lg:sticky lg:top-8 self-start`}>
              <div className="text-center">
                {bio.avatar ? (
                  <img src={bio.avatar} alt={bio.name} className="mx-auto h-20 w-20 rounded-full object-cover border-2 border-gray-200 mb-3" onError={(e) => { e.target.style.display = 'none' }} />
                ) : (
                  <div className={`mx-auto h-20 w-20 rounded-full ${c.bg} flex items-center justify-center text-2xl font-bold text-white mb-3`}>
                    {(bio.name || 'U')[0]}
                  </div>
                )}
                <h2 className={`font-bold ${textPrimary}`}>{bio.name || username}</h2>
                {bio.title && <p className={`text-sm ${textSecondary} mt-1`}>{bio.title}</p>}
                {bio.location && <p className={`text-xs ${textMuted} mt-1 flex items-center justify-center gap-1`}><MapPin size={12} />{bio.location}</p>}
              </div>
              {bio.bio && <p className={`mt-4 text-sm ${textSecondary} leading-relaxed`}>{bio.bio}</p>}
              {modules.contact && CONTACT_FIELDS.some((f) => contact[f.key]) && (
                <div className={`mt-6 pt-4 border-t ${cardBorder}`}>
                  <div className="space-y-2.5">
                    {CONTACT_FIELDS.filter((f) => contact[f.key]).map(({ key, icon: Icon }) => (
                      <div key={key} className="flex items-center gap-2.5">
                        <Icon size={14} className={c.text} />
                        {['github', 'linkedin', 'twitter', 'website'].includes(key) ? (
                          <a href={contact[key]} target="_blank" rel="noopener noreferrer" className={`text-xs ${textSecondary} hover:${c.text} transition-colors truncate`}>{contact[key]}</a>
                        ) : (
                          <span className={`text-xs ${textSecondary} truncate`}>{contact[key]}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </aside>
            <main className="flex-1 min-w-0">
              {projectsSection()}
              {skillsSection()}
              {workSection()}
              {blogSection()}
            </main>
          </div>
        </div>
      )
    }
    if (layout === 'fullwidth') {
      return <div className="px-4 sm:px-8 lg:px-16 py-8">{content}</div>
    }
    return <div className="mx-auto max-w-4xl px-6 py-8">{content}</div>
  }

  return (
    <div className={`min-h-screen ${baseBg} transition-colors duration-300`}>
      {layout === 'sidebar' ? layoutWrap(pageContent) : layoutWrap(pageContent)}

      <footer className={`border-t ${cardBorder} ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'} mt-8`}>
        <div className="mx-auto max-w-7xl px-6 py-8 text-center">
          <Link to="/" className={`text-sm ${textMuted} hover:${c.text} transition-colors`}>
            Built with FolioCraft
          </Link>
        </div>
      </footer>

      <button
        onClick={toggleDark}
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full ${c.bg} text-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200`}
        aria-label="Toggle dark mode"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {showTop && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-20 right-6 z-50 w-12 h-12 rounded-full ${cardBg} border ${cardBorder} shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 ${textSecondary}`}
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  )
}
