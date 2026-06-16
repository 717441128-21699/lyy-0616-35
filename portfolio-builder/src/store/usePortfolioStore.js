import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const REGIONS = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '南京']

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
    },
  }
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
          const portfolio = {
            ...state.portfolio,
            isPublished: true,
            domain: {
              ...state.portfolio.domain,
              subdomain: `${username}.site`,
            },
          }
          return {
            portfolio,
            portfolios: { ...state.portfolios, [username]: portfolio },
          }
        }),

      unpublish: (username) =>
        set((state) => {
          const portfolio = {
            ...state.portfolio,
            isPublished: false,
            domain: {
              ...state.portfolio.domain,
              subdomain: '',
            },
          }
          return {
            portfolio,
            portfolios: username
              ? { ...state.portfolios, [username]: portfolio }
              : state.portfolios,
          }
        }),

      recordVisit: (username, region) => {
        const { portfolios } = get()
        const targetPortfolio = portfolios[username]
        if (!targetPortfolio) return

        const isUnique = Math.random() > 0.3
        const visitRegion = region || REGIONS[Math.floor(Math.random() * REGIONS.length)]
        const updatedRegions = targetPortfolio.analytics.regions.map((r) =>
          r.name === visitRegion ? { ...r, count: r.count + 1 } : r
        )
        const regionExists = updatedRegions.some((r) => r.name === visitRegion)
        if (!regionExists) {
          updatedRegions.push({ name: visitRegion, count: 1 })
        }

        const updatedPortfolio = {
          ...targetPortfolio,
          analytics: {
            pv: targetPortfolio.analytics.pv + 1,
            uv: targetPortfolio.analytics.uv + (isUnique ? 1 : 0),
            regions: updatedRegions,
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
