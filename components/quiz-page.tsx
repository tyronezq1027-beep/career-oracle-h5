"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft } from "lucide-react"

interface QuizPageProps {
  onComplete: (answers: number[]) => void
  onBack: () => void
}

const questions = [
  {
    question: "在面对突发的职场危机时，您的第一反应通常是？",
    options: [
      "立即分析问题根源，制定解决方案",
      "先稳定情绪，观察形势再做决定",
      "寻求团队或上级的支持与建议",
      "相信直觉，果断采取行动",
    ],
  },
  {
    question: "您更倾向于哪种工作环境？",
    options: [
      "充满变动与挑战的创业氛围",
      "稳定有序的大型企业",
      "自由灵活的远程办公",
      "专注深耕的专业领域",
    ],
  },
  {
    question: "在团队合作中，您通常扮演什么角色？",
    options: [
      "领导者，统筹全局",
      "执行者，落地推进",
      "协调者，润滑团队",
      "创新者，提供灵感",
    ],
  },
  {
    question: "面对新知识或技能时，您的学习方式是？",
    options: [
      "系统学习，深入理解原理",
      "边做边学，实践出真知",
      "向他人请教，快速掌握要点",
      "广泛涉猎，建立知识网络",
    ],
  },
  {
    question: "您对「成功」的定义更接近？",
    options: [
      "财务自由，掌控人生",
      "专业权威，受人尊敬",
      "平衡生活，身心健康",
      "创造价值，影响世界",
    ],
  },
  {
    question: "当工作与个人生活发生冲突时，您会？",
    options: [
      "优先完成工作任务",
      "视具体情况灵活调整",
      "尽量保护个人时间",
      "寻找两全其美的方案",
    ],
  },
  {
    question: "您更享受哪种类型的工作成果？",
    options: [
      "可量化的业绩指标",
      "创造性的作品产出",
      "团队的认可与信任",
      "个人能力的持续成长",
    ],
  },
  {
    question: "在做重要决定时，您更依赖？",
    options: [
      "数据分析与逻辑推演",
      "内心感受与直觉判断",
      "他人意见与集体智慧",
      "过往经验与成功案例",
    ],
  },
  {
    question: "您对职场竞争的态度是？",
    options: [
      "积极竞争，追求第一",
      "良性竞争，共同进步",
      "专注自我，不与人比",
      "合作共赢，资源整合",
    ],
  },
  {
    question: "您理想中的上级应该是？",
    options: [
      "专业能力强，值得学习",
      "善于授权，给予空间",
      "关心下属，有人情味",
      "愿景清晰，带领方向",
    ],
  },
  {
    question: "面对不确定性时，您的心理状态是？",
    options: [
      "兴奋，视为机遇",
      "焦虑，需要控制",
      "平静，顺其自然",
      "谨慎，做好准备",
    ],
  },
  {
    question: "您更看重工作中的哪种回报？",
    options: [
      "丰厚的薪资待遇",
      "广阔的发展空间",
      "良好的工作氛围",
      "社会价值与意义",
    ],
  },
  {
    question: "您处理人际冲突的方式通常是？",
    options: [
      "直接沟通，解决问题",
      "冷静退让，避免升级",
      "寻求中间人调解",
      "分析原因，对症下药",
    ],
  },
  {
    question: "您对工作创新的态度是？",
    options: [
      "积极主动，持续创新",
      "稳中求变，渐进改良",
      "遵循规范，稳健执行",
      "开放接受，随机应变",
    ],
  },
  {
    question: "您希望五年后的自己是？",
    options: [
      "某领域的专家大牛",
      "团队的核心管理者",
      "自由的创业者/自由职业者",
      "平衡事业与生活的幸福人",
    ],
  },
]

export function QuizPage({ onComplete, onBack }: QuizPageProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  const handleSelectOption = (optionIndex: number) => {
    setSelectedOption(optionIndex)
  }

  const handleNext = () => {
    if (selectedOption === null) return

    const newAnswers = [...answers, selectedOption]
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption(null)
    } else {
      onComplete(newAnswers)
    }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 self-start"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm">返回</span>
      </motion.button>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">心理学测试</span>
          <span className="text-sm text-primary font-medium">
            {currentQuestion + 1}/{questions.length}
          </span>
        </div>
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="font-serif text-xl md:text-2xl text-foreground mb-8 leading-relaxed">
              {questions[currentQuestion].question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleSelectOption(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 backdrop-blur-xl transition-all duration-200 active:scale-[0.98] ${
                    selectedOption === index
                      ? "bg-[#D4AF37]/20 border-[#D4AF37] text-foreground shadow-[0_0_0_1px_rgba(212,175,55,0.3)]"
                      : "bg-card/80 border-border text-foreground hover:border-[#D4AF37]/40"
                  }`}
                >
                  <span className="flex items-start gap-3">
                    <span
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs transition-colors ${
                        selectedOption === index
                          ? "border-[#D4AF37] bg-[#D4AF37] text-primary-foreground"
                          : "border-muted-foreground/40"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-sm leading-relaxed">{option}</span>
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Next button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={handleNext}
          disabled={selectedOption === null}
          whileTap={selectedOption !== null ? { scale: 0.95 } : {}}
          className={`mt-8 w-full py-4 rounded-lg font-medium tracking-wide transition-all border-2 active:scale-95 ${
            selectedOption !== null
              ? "bg-primary text-primary-foreground hover:bg-primary/90 border-[#D4AF37]/50 hover:border-[#D4AF37]/80 hover:bg-[#D4AF37]/90"
              : "bg-muted text-muted-foreground cursor-not-allowed border-transparent"
          }`}
        >
          {currentQuestion < questions.length - 1 ? "下一题" : "生成印记"}
        </motion.button>
      </div>
    </div>
  )
}
