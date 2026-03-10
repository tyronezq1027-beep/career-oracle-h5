"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, Check, Sparkles, X, QrCode } from "lucide-react"

export interface ReportData {
  freeReport: { destinyTitle: string; briefAnalysis: string }
  radarData: Array<{ subject: string; score: number }>
  paidReport: Array<{ title: string; content: string }>
}

interface ResultsPageProps {
  userData: {
    name: string
    birthDate: string
    birthHour: string
  }
  quizAnswers: number[]
  onUnlock: (reportData: ReportData) => void
}

export function ResultsPage({ userData, quizAnswers, onUnlock }: ResultsPageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [isPaymentLoading, setIsPaymentLoading] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)

  useEffect(() => {
    let cancelled = false

    const fetchReport = async () => {
      try {
        const res = await fetch("/api/generate-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            birthInfo: userData,
            quizAnswers,
          }),
        })

        const data = await res.json()

        if (cancelled) return

        if (!res.ok) {
          throw new Error(data.error || "生成报告失败")
        }

        if (data.freeReport && data.radarData && data.paidReport) {
          setReportData(data)
        } else {
          throw new Error("未返回有效报告结构")
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : "生成报告失败，请重试")
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchReport()
    return () => {
      cancelled = true
    }
  }, [userData, quizAnswers])

  const handlePaymentClick = () => {
    setIsPaymentLoading(true)
    setTimeout(() => {
      setIsPaymentLoading(false)
      setShowQRModal(true)
    }, 1500)
  }

  const handleConfirmPayment = () => {
    setShowQRModal(false)
    if (reportData) {
      onUnlock(reportData)
    }
  }

  if (isLoading) {
    return (
      <ReportGeneratingState
        message="正在拨动命运齿轮，编织你的天命报告..."
        subtext="星辰与心象交汇，请稍候"
      />
    )
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <p className="text-destructive mb-4">{loadError}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-lg bg-primary/20 text-primary border border-primary/40"
        >
          重新加载
        </button>
      </div>
    )
  }

  const freeReport = reportData?.freeReport

  return (
    <div className="min-h-screen px-6 py-8 pb-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center"
          >
            <Sparkles className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="font-serif text-2xl text-foreground mb-2">
            {userData.name}，您的解析已完成
          </h1>
          <p className="text-sm text-muted-foreground">
            基于您的时空印记与心理测试综合分析
          </p>
        </div>

        {/* Section 1: 时空命格初探 - freeReport */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-5"
        >
          <div className="bg-card backdrop-blur-xl border border-border rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <h3 className="text-sm font-medium text-primary tracking-wider">
                时空命格初探
              </h3>
            </div>
            
            {freeReport?.destinyTitle && (
              <p className="text-foreground leading-relaxed text-sm mb-3">
                您的核心命格为
                <span className="text-primary font-medium">「{freeReport.destinyTitle}」</span>
              </p>
            )}
            
            <p className="text-foreground leading-relaxed text-sm">
              {freeReport?.briefAnalysis || "正在解析您的命理与性格特质..."}
            </p>
          </div>
        </motion.div>

        {/* Section 2: 核心人格侧写 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-5"
        >
          <div className="bg-card backdrop-blur-xl border border-border rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#4a6fa5] animate-pulse" />
              <h3 className="text-sm font-medium text-[#4a6fa5] tracking-wider">
                核心人格侧写
              </h3>
            </div>
            
            <p className="text-foreground leading-relaxed text-sm">
              基于您的心理测试与命理交叉分析，您的职业特质已初步显现。解锁完整报告可查看五维能力雷达图与详细人格侧写。
            </p>
          </div>
        </motion.div>

        {/* Section 3: 近期职场天命预警 (with blur fade) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative mb-6"
        >
          <div className="bg-card backdrop-blur-xl border border-border rounded-2xl p-6 shadow-lg overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#c9a959] animate-pulse" />
              <h3 className="text-sm font-medium text-[#c9a959] tracking-wider">
                近期职场天命预警
              </h3>
              <span className="ml-auto px-2 py-0.5 text-[10px] bg-destructive/20 text-destructive rounded-full">
                重要
              </span>
            </div>
            
            {/* Clear content at the top */}
            <p className="text-foreground leading-relaxed text-sm">
              结合目前的时空流年，在接下来的
              <span className="text-primary font-medium"> 6 个月</span>
              内，您将面临一个至关重要的事业分水岭。根据您的命盘走势，
              <span className="text-[#c9a959] font-medium">2026年下半年</span>
              将是您职业生涯的关键转折点。
            </p>

            {/* Gradually blurring content */}
            <div className="relative mt-4">
              <div className="space-y-3">
                <p className="text-foreground leading-relaxed text-sm" style={{ filter: 'blur(1px)' }}>
                  如果踏入以下两个行业，您的天赋将被严重消耗，甚至面临职业倦怠与心理危机的双重打击：
                </p>
                <p className="text-foreground leading-relaxed text-sm" style={{ filter: 'blur(2.5px)' }}>
                  第一个致命陷阱行业是「传统制造业中层管理」，这个领域会严重压制您的创新天赋...
                </p>
                <p className="text-foreground leading-relaxed text-sm" style={{ filter: 'blur(4px)' }}>
                  第二个需要规避的领域是「高度流程化的金融后台运营」，您的ENTP特质在此类环境中...
                </p>
                <p className="text-foreground leading-relaxed text-sm" style={{ filter: 'blur(6px)' }}>
                  而您真正应该抓住的三大黄金赛道分别是：1) 新消费品牌的从0到1阶段...
                </p>
                <p className="text-foreground leading-relaxed text-sm" style={{ filter: 'blur(8px)' }}>
                  未来三年的具体行动节奏建议：第一年聚焦于核心能力的深度打磨...
                </p>
              </div>

              {/* Strong gradient overlay for blur effect */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(to bottom, transparent 0%, rgba(5,5,5,0.3) 20%, rgba(5,5,5,0.7) 50%, rgba(5,5,5,0.95) 80%, rgba(5,5,5,1) 100%)'
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Paywall Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="relative z-10"
        >
          <div className="bg-card/95 backdrop-blur-xl border border-primary/30 rounded-2xl p-6 shadow-2xl shadow-primary/10">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-foreground mb-1">
                  专属深度报告已生成
                </h3>
                <p className="text-xs text-muted-foreground">
                  3000字深度职业发展与避坑指南
                </p>
              </div>
            </div>

            {/* Features list */}
            <ul className="space-y-2 mb-6">
              {[
                "完整命盘展示与深度解读",
                "职业能力五维雷达图分析",
                "3个极高潜力的具体行业赛道",
                "未来3年职场发展节奏规划",
                "2个必须规避的致命职业陷阱",
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* WeChat Pay button */}
            <motion.button
              whileHover={{ scale: isPaymentLoading ? 1 : 1.02 }}
              whileTap={{ scale: isPaymentLoading ? 1 : 0.98 }}
              onClick={handlePaymentClick}
              disabled={isPaymentLoading}
              className="w-full py-4 rounded-xl font-medium tracking-wide flex items-center justify-center gap-2 shadow-lg transition-all duration-300 disabled:cursor-not-allowed"
              style={{
                background: isPaymentLoading 
                  ? 'linear-gradient(135deg, #1a3a2a 0%, #0d2818 100%)' 
                  : 'linear-gradient(135deg, #1d4a32 0%, #0f3320 100%)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                boxShadow: '0 4px 20px rgba(29, 74, 50, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
              }}
            >
              {isPaymentLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-[#4ade80]/30 border-t-[#4ade80] rounded-full"
                  />
                  <span className="text-[#4ade80]/90">正在唤起安全支付通道...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#4ade80">
                    <path d="M9.5 4C5.36 4 2 6.69 2 10c0 1.89 1.08 3.56 2.78 4.66l-.7 2.11 2.47-1.23c.87.23 1.81.36 2.8.38-.19-.64-.29-1.31-.29-2C9.06 10.13 13 7 17.5 7c.39 0 .77.02 1.14.07C17.67 5.22 13.89 4 9.5 4zm-2.75 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm5.5 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm5.25 1c-3.86 0-7 2.69-7 6s3.14 6 7 6c.79 0 1.55-.11 2.26-.31l2.23 1.11-.63-1.89c1.45-.96 2.39-2.4 2.39-4.01 0-3.31-3.14-6-7-6zm-2.25 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm4.5 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                  </svg>
                  <span className="text-[#4ade80]">微信支付</span>
                  <span className="text-primary font-bold">¥19.9</span>
                  <span className="text-[#4ade80]">解锁报告</span>
                </>
              )}
            </motion.button>

            <p className="mt-4 text-xs text-center text-muted-foreground">
              已有 12,847 人解锁 · 支持7天无理由退款
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* QR Code Payment Modal */}
      <AnimatePresence>
        {showQRModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
            onClick={() => setShowQRModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm bg-card border border-primary/30 rounded-2xl p-6 shadow-2xl"
              style={{
                boxShadow: '0 0 60px rgba(212, 175, 55, 0.15), 0 0 30px rgba(0, 0, 0, 0.5)'
              }}
            >
              {/* Close button */}
              <button
                onClick={() => setShowQRModal(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal header */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/20 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl text-foreground mb-1">
                  命运解析付费通道
                </h3>
                <p className="text-xs text-muted-foreground">
                  扫码支付后即可查看完整报告
                </p>
              </div>

              {/* QR Code placeholder */}
              <div className="relative mx-auto w-48 h-48 mb-6 bg-white rounded-xl flex items-center justify-center">
                <div className="absolute inset-2 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
                  <QrCode className="w-16 h-16 text-gray-400 mb-2" />
                  <span className="text-xs text-gray-500">支付二维码</span>
                </div>
                {/* Decorative corner elements */}
                <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-primary rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-primary rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-primary rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-primary rounded-br-lg" />
              </div>

              {/* Payment info */}
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground mb-2">
                  请使用微信扫码支付
                </p>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-2xl font-bold text-primary">¥19.9</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  解锁您的 3000 字专属天命报告
                </p>
              </div>

              {/* Demo button for testing */}
              <button
                onClick={handleConfirmPayment}
                disabled={!reportData}
                className="w-full py-3 bg-muted text-muted-foreground rounded-xl text-sm hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                已完成支付（演示）
              </button>

              {/* Cancel button */}
              <button
                onClick={() => setShowQRModal(false)}
                className="w-full mt-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                取消支付
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ReportGeneratingState({
  message,
  subtext,
}: {
  message: string
  subtext: string
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <div className="relative w-28 h-28 mx-auto mb-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-[#D4AF37]/40"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
            className="absolute inset-3 rounded-full border border-[#D4AF37]/25"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="absolute inset-6 rounded-full border border-[#D4AF37]/50"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-4 h-4 rounded-full bg-[#D4AF37]"
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="font-serif text-xl text-foreground mb-2">{message}</p>
          <p className="text-sm text-muted-foreground">{subtext}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 space-y-4"
        >
          {[
            "读取星辰轨迹...",
            "交织命理与心象...",
            "编织专属天命报告...",
          ].map((text, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.6 }}
              className="flex items-center gap-3 text-sm text-muted-foreground"
            >
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.4 }}
                className="w-2 h-2 rounded-full bg-[#D4AF37]"
              />
              <span>{text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
