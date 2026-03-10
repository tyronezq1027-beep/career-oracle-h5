"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft } from "lucide-react"

interface BirthInfoFormProps {
  onSubmit: (data: { name: string; birthDate: string; birthHour: string }) => void
  onBack: () => void
}

const birthHours = [
  { value: "zi", label: "子时 (23:00-01:00)" },
  { value: "chou", label: "丑时 (01:00-03:00)" },
  { value: "yin", label: "寅时 (03:00-05:00)" },
  { value: "mao", label: "卯时 (05:00-07:00)" },
  { value: "chen", label: "辰时 (07:00-09:00)" },
  { value: "si", label: "巳时 (09:00-11:00)" },
  { value: "wu", label: "午时 (11:00-13:00)" },
  { value: "wei", label: "未时 (13:00-15:00)" },
  { value: "shen", label: "申时 (15:00-17:00)" },
  { value: "you", label: "酉时 (17:00-19:00)" },
  { value: "xu", label: "戌时 (19:00-21:00)" },
  { value: "hai", label: "亥时 (21:00-23:00)" },
  { value: "unknown", label: "不清楚" },
]

export function BirthInfoForm({ onSubmit, onBack }: BirthInfoFormProps) {
  const [name, setName] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [birthHour, setBirthHour] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && birthDate && birthHour) {
      onSubmit({ name, birthDate, birthHour })
    }
  }

  const isValid = name && birthDate && birthHour

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 self-start"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm">返回</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-3">
            时空信息采集
          </h2>
          <p className="text-muted-foreground text-sm">
            您的出生时空信息将用于精准测算
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name field */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <label className="block text-sm text-muted-foreground">
              您的称呼
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入您的姓名或昵称"
              className="w-full px-4 py-3 bg-card backdrop-blur-xl border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </motion.div>

          {/* Birth date field */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <label className="block text-sm text-muted-foreground">
              出生日期
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-3 bg-card backdrop-blur-xl border border-border rounded-lg text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all [color-scheme:dark]"
            />
          </motion.div>

          {/* Birth hour dropdown */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <label className="block text-sm text-muted-foreground">
              出生时辰
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-3 bg-card backdrop-blur-xl border border-border rounded-lg text-left text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all flex items-center justify-between"
              >
                <span className={birthHour ? "text-foreground" : "text-muted-foreground/50"}>
                  {birthHour
                    ? birthHours.find((h) => h.value === birthHour)?.label
                    : "请选择出生时辰"}
                </span>
                <ChevronLeft className={`w-5 h-5 text-muted-foreground transition-transform ${isDropdownOpen ? "rotate-90" : "-rotate-90"}`} />
              </button>
              
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-50 w-full mt-2 bg-popover backdrop-blur-xl border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto"
                >
                  {birthHours.map((hour) => (
                    <button
                      key={hour.value}
                      type="button"
                      onClick={() => {
                        setBirthHour(hour.value)
                        setIsDropdownOpen(false)
                      }}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-primary/10 hover:text-primary transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      {hour.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Submit button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="pt-4"
          >
            <button
              type="submit"
              disabled={!isValid}
              className={`w-full py-4 rounded-lg font-medium tracking-wide transition-all ${
                isValid
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              生成时空印记
            </button>
          </motion.div>
        </form>

        {/* Privacy note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-xs text-center text-muted-foreground/60"
        >
          您的信息将被严格保密，仅用于测算分析
        </motion.p>
      </motion.div>
    </div>
  )
}
