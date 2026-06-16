import { useState, useRef } from 'react'
import usePortfolioStore from '../store/usePortfolioStore'
import useAuthStore from '../store/useAuthStore'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { FileDown, Loader2 } from 'lucide-react'

export default function PDFResume() {
  const portfolio = usePortfolioStore((s) => s.portfolio)
  const user = useAuthStore((s) => s.user)
  const [generating, setGenerating] = useState(false)
  const resumeRef = useRef(null)

  const bio = portfolio.bio || {}
  const contact = portfolio.contact || {}
  const skills = portfolio.skills || []
  const workExperience = portfolio.workExperience || []
  const projects = portfolio.projects || []

  const generatePDF = async () => {
    if (!resumeRef.current) return
    setGenerating(true)
    try {
      const element = resumeRef.current
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      })

      const imgData = canvas.toDataURL('image/png')
      const imgWidth = canvas.width
      const imgHeight = canvas.height

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const ratio = pageWidth / imgWidth
      const heightPerPage = imgHeight * ratio

      let position = 0
      let remainingHeight = imgHeight

      while (remainingHeight > 0) {
        const currentHeight = Math.min(remainingHeight, pageHeight / ratio)
        const sourceCanvas = document.createElement('canvas')
        sourceCanvas.width = imgWidth
        sourceCanvas.height = currentHeight
        const ctx = sourceCanvas.getContext('2d')
        ctx.drawImage(
          canvas,
          0, position, imgWidth, currentHeight,
          0, 0, imgWidth, currentHeight
        )
        const sourceImg = sourceCanvas.toDataURL('image/png')

        if (position > 0) {
          pdf.addPage()
        }
        pdf.addImage(sourceImg, 'PNG', 0, 0, pageWidth, currentHeight * ratio)
        position += currentHeight
        remainingHeight -= currentHeight
      }

      const username = user?.username || 'resume'
      pdf.save(`${username}-简历.pdf`)
    } catch (err) {
      console.error('PDF generation failed:', err)
    } finally {
      setGenerating(false)
    }
  }

  const contactItems = []
  if (contact.email) contactItems.push({ label: '邮箱', value: contact.email })
  if (contact.phone) contactItems.push({ label: '电话', value: contact.phone })
  if (contact.wechat) contactItems.push({ label: '微信', value: contact.wechat })
  if (contact.github) contactItems.push({ label: 'GitHub', value: contact.github })
  if (contact.website) contactItems.push({ label: '网站', value: contact.website })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text dark:text-text-dark">PDF 简历</h2>
          <p className="text-sm text-text-muted dark:text-text-dark-muted mt-1">
            生成与作品集内容同步的 PDF 版简历，可用于邮件投递
          </p>
        </div>
        <button
          onClick={generatePDF}
          disabled={generating}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition disabled:opacity-60"
        >
          {generating ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />}
          {generating ? '生成中...' : '下载 PDF 简历'}
        </button>
      </div>

      <div className="bg-surface-alt dark:bg-surface-dark-alt rounded-xl border border-border dark:border-border-dark p-4 sm:p-6">
        <p className="text-xs text-text-muted dark:text-text-dark-muted mb-3">简历预览（下载后效果相同）</p>
        <div className="overflow-auto max-h-[70vh] bg-white rounded-lg shadow-inner border border-gray-200">
          <div
            ref={resumeRef}
            className="bg-white text-gray-900 p-10 w-[210mm] min-h-[297mm] mx-auto"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif' }}
          >
            <header className="pb-5 border-b-2 border-indigo-600 mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                {typeof bio === 'object' ? (bio.name || user?.username || '姓名') : (user?.username || '姓名')}
              </h1>
              {typeof bio === 'object' && bio.title && (
                <p className="text-base text-gray-600 mt-1 font-medium">{bio.title}</p>
              )}
              {contactItems.length > 0 && (
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-gray-500">
                  {contactItems.map((item, i) => (
                    <span key={i}>{item.value}</span>
                  ))}
                </div>
              )}
              {typeof bio === 'object' && bio.location && (
                <p className="text-sm text-gray-500 mt-1">{bio.location}</p>
              )}
            </header>

            {typeof bio === 'object' && bio.bio && (
              <section className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="w-1 h-5 bg-indigo-600 rounded-full" />
                  个人简介
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {bio.bio}
                </p>
              </section>
            )}

            {skills.length > 0 && (
              <section className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-1 h-5 bg-indigo-600 rounded-full" />
                  技能特长
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {workExperience.length > 0 && (
              <section className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-1 h-5 bg-indigo-600 rounded-full" />
                  工作经历
                </h2>
                <div className="space-y-4">
                  {workExperience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">{exp.position || '职位'}</h3>
                          <p className="text-sm text-gray-600 font-medium">{exp.company || '公司'}</p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap shrink-0 mt-0.5">
                          {exp.startDate || ''} — {exp.current ? '至今' : (exp.endDate || '')}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="text-sm text-gray-700 mt-2 leading-relaxed whitespace-pre-line">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {projects.length > 0 && (
              <section className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-1 h-5 bg-indigo-600 rounded-full" />
                  项目经历
                </h2>
                <div className="space-y-4">
                  {projects.map((proj) => (
                    <div key={proj.id}>
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-base font-semibold text-gray-900">{proj.title || '项目'}</h3>
                        {proj.link && (
                          <span className="text-xs text-indigo-600 whitespace-nowrap shrink-0 mt-0.5">
                            {proj.link}
                          </span>
                        )}
                      </div>
                      {proj.tags && proj.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {proj.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {proj.description && (
                        <p className="text-sm text-gray-700 mt-2 leading-relaxed whitespace-pre-line">
                          {proj.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            <footer className="pt-4 mt-auto border-t border-gray-200 text-center text-xs text-gray-400">
              由 FolioCraft 生成
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}
