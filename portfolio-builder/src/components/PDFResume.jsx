import { useState } from 'react'
import usePortfolioStore from '../store/usePortfolioStore'
import useAuthStore from '../store/useAuthStore'
import jsPDF from 'jspdf'

export default function PDFResume() {
  const portfolio = usePortfolioStore((s) => s.portfolio)
  const user = useAuthStore((s) => s.user)
  const [generating, setGenerating] = useState(false)

  const bio = portfolio.bio || {}
  const contact = portfolio.contact || {}
  const skills = portfolio.skills || []
  const workExperience = portfolio.workExperience || []
  const projects = portfolio.projects || []

  const generatePDF = () => {
    setGenerating(true)
    try {
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const margin = 20
      const contentWidth = pageWidth - margin * 2
      let y = 20

      doc.setFontSize(22)
      doc.setFont('helvetica', 'bold')
      doc.text(bio.name || user?.username || 'Your Name', margin, y)
      y += 8

      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100)
      doc.text(bio.title || '', margin, y)
      y += 6

      const contactParts = [
        contact.email,
        contact.phone,
        contact.github,
        contact.website,
      ].filter(Boolean)
      if (contactParts.length > 0) {
        doc.setFontSize(10)
        doc.text(contactParts.join(' | '), margin, y)
        y += 8
      }

      doc.setDrawColor(200)
      doc.line(margin, y, pageWidth - margin, y)
      y += 8

      if (bio.bio) {
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(0)
        doc.text('About', margin, y)
        y += 6
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        const bioLines = doc.splitTextToSize(bio.bio, contentWidth)
        doc.text(bioLines, margin, y)
        y += bioLines.length * 5 + 6
      }

      if (skills.length > 0) {
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(0)
        doc.text('Skills', margin, y)
        y += 6
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        const skillsText = skills.join(', ')
        const skillLines = doc.splitTextToSize(skillsText, contentWidth)
        doc.text(skillLines, margin, y)
        y += skillLines.length * 5 + 6
      }

      if (workExperience.length > 0) {
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(0)
        doc.text('Work Experience', margin, y)
        y += 6

        workExperience.forEach((exp) => {
          if (y > 270) {
            doc.addPage()
            y = 20
          }
          doc.setFontSize(11)
          doc.setFont('helvetica', 'bold')
          doc.text(exp.position || '', margin, y)
          y += 5
          doc.setFontSize(10)
          doc.setFont('helvetica', 'normal')
          doc.setTextColor(80)
          const dateRange = `${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}`
          doc.text(`${exp.company || ''}  ${dateRange}`, margin, y)
          y += 5
          if (exp.description) {
            doc.setTextColor(0)
            const descLines = doc.splitTextToSize(exp.description, contentWidth)
            doc.text(descLines, margin, y)
            y += descLines.length * 5
          }
          doc.setTextColor(0)
          y += 4
        })
      }

      if (projects.length > 0) {
        if (y > 250) {
          doc.addPage()
          y = 20
        }
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(0)
        doc.text('Projects', margin, y)
        y += 6

        projects.forEach((proj) => {
          if (y > 270) {
            doc.addPage()
            y = 20
          }
          doc.setFontSize(11)
          doc.setFont('helvetica', 'bold')
          doc.text(proj.title || '', margin, y)
          y += 5
          if (proj.description) {
            doc.setFontSize(10)
            doc.setFont('helvetica', 'normal')
            doc.setTextColor(0)
            const projLines = doc.splitTextToSize(proj.description, contentWidth)
            doc.text(projLines, margin, y)
            y += projLines.length * 5
          }
          doc.setTextColor(0)
          y += 4
        })
      }

      const username = user?.username || 'resume'
      doc.save(`${username}-resume.pdf`)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text dark:text-text-dark">PDF 简历</h2>
        <div className="flex gap-2">
          <button
            onClick={generatePDF}
            disabled={generating}
            className="px-4 py-1.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
          >
            {generating ? '生成中...' : '生成PDF'}
          </button>
          <button
            onClick={generatePDF}
            disabled={generating}
            className="px-4 py-1.5 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/5 transition disabled:opacity-50"
          >
            下载PDF
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-border dark:border-border-dark p-6 max-w-2xl">
        <div className="border-b border-gray-200 dark:border-slate-700 pb-4 mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {bio.name || user?.username || '姓名'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{bio.title || '职位标题'}</p>
          <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
            {contact.email && <span>{contact.email}</span>}
            {contact.phone && <span>{contact.phone}</span>}
            {contact.github && <span>{contact.github}</span>}
            {contact.website && <span>{contact.website}</span>}
          </div>
        </div>

        {bio.bio && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">简介</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">{bio.bio}</p>
          </div>
        )}

        {skills.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">技能</h4>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {workExperience.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">工作经历</h4>
            {workExperience.map((exp) => (
              <div key={exp.id} className="mb-3 last:mb-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{exp.position}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {exp.company} · {exp.startDate} - {exp.current ? '至今' : exp.endDate}
                </p>
                {exp.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {projects.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">项目经历</h4>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-3 last:mb-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{proj.title}</p>
                {proj.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">{proj.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
