"use client"

import { motion } from "framer-motion"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts"
import { Star, ChevronDown } from "lucide-react"
import { useState } from "react"
import type { ReportData } from "./results-page"

interface FullReportPageProps {
  userData: {
    name: string
    birthDate: string
    birthHour: string
  }
  reportData: ReportData
}

function getBirthHourLabel(value: string): string {
  const hours: Record<string, string> = {
    zi: "子时",
    chou: "丑时",
    yin: "寅时",
    mao: "卯时",
    chen: "辰时",
    si: "巳时",
    wu: "午时",
    wei: "未时",
    shen: "申时",
    you: "酉时",
    xu: "戌时",
    hai: "亥时",
    unknown: "时辰不详",
  }
  return hours[value] || value
}

/** Recharts 雷达图需要 fullMark，且使用 subject/score */
function toRadarChartData(
  data: Array<{ subject: string; score: number }>
): Array<{ subject: string; score: number; fullMark: 100 }> {
  return data.map((d) => ({ ...d, fullMark: 100 }))
}

export function FullReportPage({ userData, reportData }: FullReportPageProps) {
  const hasRadar = (reportData.radarData?.length ?? 0) > 0
  const [expandedSection, setExpandedSection] = useState<string | null>(
    hasRadar ? "radar" : (reportData.paidReport?.length ? "paid-0" : null)
  )

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const radarChartData = toRadarChartData(reportData.radarData ?? [])
  const paidReport = reportData.paidReport ?? []

  return (
    <div className="min-h-screen px-6 py-8 pb-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-xs text-primary font-medium">完整报告已解锁</span>
          </div>
          <h1 className="font-serif text-2xl text-foreground mb-2">
            {userData.name}的职业天命解码
          </h1>
          <p className="text-sm text-muted-foreground">
            时空印记：{userData.birthDate} · {getBirthHourLabel(userData.birthHour)}
          </p>
        </motion.div>

        {/* Radar Chart Section */}
        {radarChartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card backdrop-blur-xl border border-border rounded-2xl mb-4 overflow-hidden"
          >
            <button
              onClick={() => toggleSection("radar")}
              className="w-full p-6 flex items-center justify-between hover:bg-[#D4AF37]/5 transition-colors"
            >
              <h3 className="font-serif text-lg text-foreground flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                职业能力雷达图
              </h3>
              <ChevronDown
                className={`w-5 h-5 text-muted-foreground transition-transform ${
                  expandedSection === "radar" ? "rotate-180" : ""
                }`}
              />
            </button>
            {expandedSection === "radar" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="px-6 pb-6"
              >
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarChartData}>
                      <PolarGrid stroke="rgba(212, 175, 55, 0.2)" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: "#8b8b9a", fontSize: 12 }}
                      />
                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={{ fill: "#8b8b9a", fontSize: 10 }}
                      />
                      <Radar
                        name="能力值"
                        dataKey="score"
                        stroke="#D4AF37"
                        fill="#D4AF37"
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {radarChartData.map((item) => (
                    <div
                      key={item.subject}
                      className="text-center p-2 bg-secondary/30 rounded-lg border border-[#D4AF37]/20"
                    >
                      <p className="text-xs text-muted-foreground truncate">{item.subject}</p>
                      <p className="text-lg font-medium text-[#D4AF37]">{item.score}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Paid Report Accordions */}
        {paidReport.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="bg-card backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl mb-4 overflow-hidden"
          >
            <button
              onClick={() => toggleSection(`paid-${index}`)}
              className="w-full p-6 flex items-center justify-between hover:bg-[#D4AF37]/5 transition-colors text-left"
            >
              <h3 className="font-serif text-lg text-foreground flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                {item.title}
              </h3>
              <ChevronDown
                className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${
                  expandedSection === `paid-${index}` ? "rotate-180" : ""
                }`}
              />
            </button>
            {expandedSection === `paid-${index}` && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="px-6 pb-6"
              >
                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {item.content}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8 pt-8 border-t border-border"
        >
          <p className="text-xs text-muted-foreground mb-2">
            报告生成时间：{new Date().toLocaleDateString("zh-CN")}
          </p>
          <p className="text-xs text-muted-foreground">
            Career Oracle | 天赋与赛道解码
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
