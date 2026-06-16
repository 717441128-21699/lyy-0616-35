import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const REGIONS = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '南京']

const usePortfolioStore = create(
  persist(
    (set, get) => ({
      portfolio: {
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
      },

      updateBio: (bio) =>
        set((state) => ({
          portfolio: { ...state.portfolio, bio },
        })),

      addProject: (project) =>
        set((state) => ({
          portfolio: {
            ...state.portfolio,
            projects: [...state.portfolio.projects, { ...project, id: crypto.randomUUID() }],
          },
        })),

      updateProject: (id, data) =>
        set((state) => ({
          portfolio: {
            ...state.portfolio,
            projects: state.portfolio.projects.map((p) =>
              p.id === id ? { ...p, ...data } : p
            ),
          },
        })),

      deleteProject: (id) =>
        set((state) => ({
          portfolio: {
            ...state.portfolio,
            projects: state.portfolio.projects.filter((p) => p.id !== id),
          },
        })),

      addSkill: (skill) =>
        set((state) => ({
          portfolio: {
            ...state.portfolio,
            skills: [...state.portfolio.skills, skill],
          },
        })),

      removeSkill: (skill) =>
        set((state) => ({
          portfolio: {
            ...state.portfolio,
            skills: state.portfolio.skills.filter((s) => s !== skill),
          },
        })),

      addWorkExperience: (experience) =>
        set((state) => ({
          portfolio: {
            ...state.portfolio,
            workExperience: [
              ...state.portfolio.workExperience,
              { ...experience, id: crypto.randomUUID() },
            ],
          },
        })),

      updateWorkExperience: (id, data) =>
        set((state) => ({
          portfolio: {
            ...state.portfolio,
            workExperience: state.portfolio.workExperience.map((w) =>
              w.id === id ? { ...w, ...data } : w
            ),
          },
        })),

      deleteWorkExperience: (id) =>
        set((state) => ({
          portfolio: {
            ...state.portfolio,
            workExperience: state.portfolio.workExperience.filter((w) => w.id !== id),
          },
        })),

      addBlogPost: (post) =>
        set((state) => ({
          portfolio: {
            ...state.portfolio,
            blogPosts: [...state.portfolio.blogPosts, { ...post, id: crypto.randomUUID() }],
          },
        })),

      updateBlogPost: (id, data) =>
        set((state) => ({
          portfolio: {
            ...state.portfolio,
            blogPosts: state.portfolio.blogPosts.map((b) =>
              b.id === id ? { ...b, ...data } : b
            ),
          },
        })),

      deleteBlogPost: (id) =>
        set((state) => ({
          portfolio: {
            ...state.portfolio,
            blogPosts: state.portfolio.blogPosts.filter((b) => b.id !== id),
          },
        })),

      updateContact: (contact) =>
        set((state) => ({
          portfolio: { ...state.portfolio, contact },
        })),

      toggleModule: (moduleKey) =>
        set((state) => ({
          portfolio: {
            ...state.portfolio,
            modules: {
              ...state.portfolio.modules,
              [moduleKey]: !state.portfolio.modules[moduleKey],
            },
          },
        })),

      updateTheme: (theme) =>
        set((state) => ({
          portfolio: {
            ...state.portfolio,
            theme: { ...state.portfolio.theme, ...theme },
          },
        })),

      updateSEO: (seo) =>
        set((state) => ({
          portfolio: {
            ...state.portfolio,
            seo: { ...state.portfolio.seo, ...seo },
          },
        })),

      updateDomain: (domain) =>
        set((state) => ({
          portfolio: {
            ...state.portfolio,
            domain: { ...state.portfolio.domain, ...domain },
          },
        })),

      publish: (username) =>
        set((state) => ({
          portfolio: {
            ...state.portfolio,
            isPublished: true,
            domain: {
              ...state.portfolio.domain,
              subdomain: `${username}.site`,
            },
          },
        })),

      recordVisit: (region) => {
        const { portfolio } = get()
        const isUnique = Math.random() > 0.3
        const visitRegion = region || REGIONS[Math.floor(Math.random() * REGIONS.length)]
        const updatedRegions = portfolio.analytics.regions.map((r) =>
          r.name === visitRegion ? { ...r, count: r.count + 1 } : r
        )
        const regionExists = updatedRegions.some((r) => r.name === visitRegion)
        if (!regionExists) {
          updatedRegions.push({ name: visitRegion, count: 1 })
        }
        set({
          portfolio: {
            ...portfolio,
            analytics: {
              pv: portfolio.analytics.pv + 1,
              uv: portfolio.analytics.uv + (isUnique ? 1 : 0),
              regions: updatedRegions,
            },
          },
        })
      },
    }),
    {
      name: 'portfolio_data',
      partialize: (state) => ({ portfolio: state.portfolio }),
    }
  )
)

export default usePortfolioStore
