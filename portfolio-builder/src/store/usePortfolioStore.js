import { create } from 'zustand'
import { persist } from 'zustand/middleware'

function createEmptyPortfolio() {
  return {
    bio: '',
    projects: [],
    skills: [],
    workExperience: [],
    blogPosts: [],
    contact: '',
    modules: {
      bio: true,
      projects: true,
      skills: true,
      workExperience: true,
      blog: true,
      contact: true,
    },
    theme: {
      templateId: 'modern',
      colorScheme: 'indigo',
      darkMode: false,
      layout: 'centered',
    },
    seo: {
      title: '',
      description: '',
    },
    domain: {
      subdomain: '',
      customDomain: '',
      cnameVerified: false,
    },
    isPublished: false,
    analytics: {
      pv: 0,
      uv: 0,
      regions: [],
      recentVisits: [],
      trend: [],
      visitorIds: [],
    },
    publishVersion: 0,
    lastPublishedAt: null,
    publishedSnapshot: null,
    publishHistory: [],
  }
}

function generatePublishSummary(portfolio) {
  const modules = portfolio.modules || {}
  const parts = []
  const bio = portfolio.bio || {}
  if (modules.bio && bio.name) parts.push(`简介: ${bio.name}`)
  if (modules.projects && portfolio.projects?.length) parts.push(`${portfolio.projects.length} 个项目`)
  if (modules.skills && portfolio.skills?.length) parts.push(`${portfolio.skills.length} 项技能`)
  if (modules.workExperience && portfolio.workExperience?.length) parts.push(`${portfolio.workExperience.length} 段经历`)
  if (modules.blog && portfolio.blogPosts?.length) parts.push(`${portfolio.blogPosts.length} 篇文章`)
  if (modules.contact) {
    const c = portfolio.contact || {}
    const filled = Object.keys(c).filter((k) => c[k]).length
    if (filled > 0) parts.push(`${filled} 项联系方式`)
  }
  return parts.join('、') || '空作品集'
}

const usePortfolioStore = create(
  persist(
    (set, get) => ({
      currentUsername: null,
      portfolio: createEmptyPortfolio(),
      portfolios: {},

      initForUser: (username) => {
        const { portfolios } = get()
        const existing = portfolios[username]
        const portfolio = existing || createEmptyPortfolio()
        set({
          currentUsername: username,
          portfolio,
          portfolios: existing ? portfolios : { ...portfolios, [username]: portfolio },
        })
      },

      getPortfolioByUsername: (username) => {
        const { portfolios } = get()
        return portfolios[username] || null
      },

      getPublishedSnapshot: (username) => {
        const { portfolios } = get()
        const p = portfolios[username]
        if (!p || !p.isPublished || !p.publishedSnapshot) return null
        return p.publishedSnapshot
      },

      saveCurrent: () => {
        const { currentUsername, portfolio, portfolios } = get()
        if (!currentUsername) return
        set({
          portfolios: { ...portfolios, [currentUsername]: portfolio },
        })
      },

      updateBio: (bio) =>
        set((state) => {
          const portfolio = { ...state.portfolio, bio }
          return {
            portfolio,
            portfolios: state.currentUsername
              ? { ...state.portfolios, [state.currentUsername]: portfolio }
              : state.portfolios,
          }
        }),

      addProject: (project) =>
        set((state) => {
          const portfolio = {
            ...state.portfolio,
            projects: [...state.portfolio.projects, { ...project, id: crypto.randomUUID() }],
          }
          return {
            portfolio,
            portfolios: state.currentUsername
              ? { ...state.portfolios, [state.currentUsername]: portfolio }
              : state.portfolios,
          }
        }),

      updateProject: (id, data) =>
        set((state) => {
          const portfolio = {
            ...state.portfolio,
            projects: state.portfolio.projects.map((p) =>
              p.id === id ? { ...p, ...data } : p
            ),
          }
          return {
            portfolio,
            portfolios: state.currentUsername
              ? { ...state.portfolios, [state.currentUsername]: portfolio }
              : state.portfolios,
          }
        }),

      deleteProject: (id) =>
        set((state) => {
          const portfolio = {
            ...state.portfolio,
            projects: state.portfolio.projects.filter((p) => p.id !== id),
          }
          return {
            portfolio,
            portfolios: state.currentUsername
              ? { ...state.portfolios, [state.currentUsername]: portfolio }
              : state.portfolios,
          }
        }),

      addSkill: (skill) =>
        set((state) => {
          if (state.portfolio.skills.includes(skill)) return state
          const portfolio = {
            ...state.portfolio,
            skills: [...state.portfolio.skills, skill],
          }
          return {
            portfolio,
            portfolios: state.currentUsername
              ? { ...state.portfolios, [state.currentUsername]: portfolio }
              : state.portfolios,
          }
        }),

      removeSkill: (skill) =>
        set((state) => {
          const portfolio = {
            ...state.portfolio,
            skills: state.portfolio.skills.filter((s) => s !== skill),
          }
          return {
            portfolio,
            portfolios: state.currentUsername
              ? { ...state.portfolios, [state.currentUsername]: portfolio }
              : state.portfolios,
          }
        }),

      addWorkExperience: (experience) =>
        set((state) => {
          const portfolio = {
            ...state.portfolio,
            workExperience: [
              ...state.portfolio.workExperience,
              { ...experience, id: crypto.randomUUID() },
            ],
          }
          return {
            portfolio,
            portfolios: state.currentUsername
              ? { ...state.portfolios, [state.currentUsername]: portfolio }
              : state.portfolios,
          }
        }),

      updateWorkExperience: (id, data) =>
        set((state) => {
          const portfolio = {
            ...state.portfolio,
            workExperience: state.portfolio.workExperience.map((w) =>
              w.id === id ? { ...w, ...data } : w
            ),
          }
          return {
            portfolio,
            portfolios: state.currentUsername
              ? { ...state.portfolios, [state.currentUsername]: portfolio }
              : state.portfolios,
          }
        }),

      deleteWorkExperience: (id) =>
        set((state) => {
          const portfolio = {
            ...state.portfolio,
            workExperience: state.portfolio.workExperience.filter((w) => w.id !== id),
          }
          return {
            portfolio,
            portfolios: state.currentUsername
              ? { ...state.portfolios, [state.currentUsername]: portfolio }
              : state.portfolios,
          }
        }),

      addBlogPost: (post) =>
        set((state) => {
          const portfolio = {
            ...state.portfolio,
            blogPosts: [...state.portfolio.blogPosts, { ...post, id: crypto.randomUUID() }],
          }
          return {
            portfolio,
            portfolios: state.currentUsername
              ? { ...state.portfolios, [state.currentUsername]: portfolio }
              : state.portfolios,
          }
        }),

      updateBlogPost: (id, data) =>
        set((state) => {
          const portfolio = {
            ...state.portfolio,
            blogPosts: state.portfolio.blogPosts.map((b) =>
              b.id === id ? { ...b, ...data } : b
            ),
          }
          return {
            portfolio,
            portfolios: state.currentUsername
              ? { ...state.portfolios, [state.currentUsername]: portfolio }
              : state.portfolios,
          }
        }),

      deleteBlogPost: (id) =>
        set((state) => {
          const portfolio = {
            ...state.portfolio,
            blogPosts: state.portfolio.blogPosts.filter((b) => b.id !== id),
          }
          return {
            portfolio,
            portfolios: state.currentUsername
              ? { ...state.portfolios, [state.currentUsername]: portfolio }
              : state.portfolios,
          }
        }),

      updateContact: (contact) =>
        set((state) => {
          const portfolio = { ...state.portfolio, contact }
          return {
            portfolio,
            portfolios: state.currentUsername
              ? { ...state.portfolios, [state.currentUsername]: portfolio }
              : state.portfolios,
          }
        }),

      toggleModule: (moduleKey) =>
        set((state) => {
          const portfolio = {
            ...state.portfolio,
            modules: {
              ...state.portfolio.modules,
              [moduleKey]: !state.portfolio.modules[moduleKey],
            },
          }
          return {
            portfolio,
            portfolios: state.currentUsername
              ? { ...state.portfolios, [state.currentUsername]: portfolio }
              : state.portfolios,
          }
        }),

      updateTheme: (theme) =>
        set((state) => {
          const portfolio = {
            ...state.portfolio,
            theme: { ...state.portfolio.theme, ...theme },
          }
          return {
            portfolio,
            portfolios: state.currentUsername
              ? { ...state.portfolios, [state.currentUsername]: portfolio }
              : state.portfolios,
          }
        }),

      updateSEO: (seo) =>
        set((state) => {
          const portfolio = {
            ...state.portfolio,
            seo: { ...state.portfolio.seo, ...seo },
          }
          return {
            portfolio,
            portfolios: state.currentUsername
              ? { ...state.portfolios, [state.currentUsername]: portfolio }
              : state.portfolios,
          }
        }),

      updateDomain: (domain) =>
        set((state) => {
          const portfolio = {
            ...state.portfolio,
            domain: { ...state.portfolio.domain, ...domain },
          }
          return {
            portfolio,
            portfolios: state.currentUsername
              ? { ...state.portfolios, [state.currentUsername]: portfolio }
              : state.portfolios,
          }
        }),

      publish: (username) =>
        set((state) => {
          const currentPortfolio = state.portfolios[username] || state.portfolio
          const newVersion = (currentPortfolio.publishVersion || 0) + 1
          const now = new Date().toISOString()
          const snapshot = {
            bio: currentPortfolio.bio,
            projects: currentPortfolio.projects,
            skills: currentPortfolio.skills,
            workExperience: currentPortfolio.workExperience,
            blogPosts: currentPortfolio.blogPosts,
            contact: currentPortfolio.contact,
            modules: { ...currentPortfolio.modules },
            theme: { ...currentPortfolio.theme },
            seo: { ...currentPortfolio.seo },
          }
          const summary = generatePublishSummary(currentPortfolio)
          const historyEntry = {
            version: newVersion,
            publishedAt: now,
            summary,
            snapshot: JSON.parse(JSON.stringify(snapshot)),
          }
          const existingHistory = currentPortfolio.publishHistory || []
          const portfolio = {
            ...currentPortfolio,
            isPublished: true,
            publishVersion: newVersion,
            lastPublishedAt: now,
            publishedSnapshot: snapshot,
            publishHistory: [historyEntry, ...existingHistory].slice(0, 20),
            domain: {
              ...currentPortfolio.domain,
              subdomain: `${username}.site`,
            },
          }
          return {
            portfolio: username === state.currentUsername ? portfolio : state.portfolio,
            portfolios: { ...state.portfolios, [username]: portfolio },
          }
        }),

      unpublish: (username) =>
        set((state) => {
          const currentPortfolio = state.portfolios[username] || state.portfolio
          const portfolio = {
            ...currentPortfolio,
            isPublished: false,
            domain: {
              ...currentPortfolio.domain,
              subdomain: '',
            },
          }
          return {
            portfolio: username === state.currentUsername ? portfolio : state.portfolio,
            portfolios: username
              ? { ...state.portfolios, [username]: portfolio }
              : state.portfolios,
          }
        }),

      restoreVersion: (username, version) => {
        const { portfolios } = get()
        const targetPortfolio = portfolios[username]
        if (!targetPortfolio) return

        const history = targetPortfolio.publishHistory || []
        const entry = history.find((h) => h.version === version)
        if (!entry || !entry.snapshot) return

        const restored = {
          ...targetPortfolio,
          bio: entry.snapshot.bio,
          projects: JSON.parse(JSON.stringify(entry.snapshot.projects)),
          skills: [...entry.snapshot.skills],
          workExperience: JSON.parse(JSON.stringify(entry.snapshot.workExperience)),
          blogPosts: JSON.parse(JSON.stringify(entry.snapshot.blogPosts)),
          contact: { ...entry.snapshot.contact },
          modules: { ...entry.snapshot.modules },
          theme: { ...entry.snapshot.theme },
          seo: { ...entry.snapshot.seo },
        }

        set({
          portfolios: { ...portfolios, [username]: restored },
          portfolio: username === get().currentUsername ? restored : get().portfolio,
        })
      },

      recordVisit: (username, visitorId) => {
        const { portfolios } = get()
        const targetPortfolio = portfolios[username]
        if (!targetPortfolio) return

        const existingVisitorIds = targetPortfolio.analytics.visitorIds || []
        const isUnique = !existingVisitorIds.includes(visitorId)
        const now = new Date()
        const dayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

        const updatedVisitorIds = isUnique
          ? [...existingVisitorIds, visitorId].slice(-500)
          : existingVisitorIds

        const updatedRegions = [...(targetPortfolio.analytics.regions || [])]

        const recentVisit = {
          id: crypto.randomUUID(),
          region: '未知来源',
          timestamp: now.toISOString(),
          isUnique,
        }
        const existingRecent = targetPortfolio.analytics.recentVisits || []
        const updatedRecent = [recentVisit, ...existingRecent].slice(0, 50)

        const existingTrend = targetPortfolio.analytics.trend || []
        const dayIndex = existingTrend.findIndex((d) => d.date === dayKey)
        let updatedTrend
        if (dayIndex >= 0) {
          updatedTrend = existingTrend.map((d, i) =>
            i === dayIndex ? { ...d, pv: d.pv + 1, uv: d.uv + (isUnique ? 1 : 0) } : d
          )
        } else {
          updatedTrend = [...existingTrend, { date: dayKey, pv: 1, uv: isUnique ? 1 : 0 }].slice(-7)
        }

        const updatedPortfolio = {
          ...targetPortfolio,
          analytics: {
            pv: targetPortfolio.analytics.pv + 1,
            uv: targetPortfolio.analytics.uv + (isUnique ? 1 : 0),
            regions: updatedRegions,
            recentVisits: updatedRecent,
            trend: updatedTrend,
            visitorIds: updatedVisitorIds,
          },
        }

        set({
          portfolios: { ...portfolios, [username]: updatedPortfolio },
          portfolio: username === get().currentUsername ? updatedPortfolio : get().portfolio,
        })
      },
    }),
    {
      name: 'folio_builder_data',
      partialize: (state) => ({
        portfolios: state.portfolios,
        currentUsername: state.currentUsername,
        portfolio: state.portfolio,
      }),
    }
  )
)

export default usePortfolioStore
