import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

/** 与 quiz-page 一致的题目，用于将答题索引转为可读文本 */
const QUIZ_QUESTIONS = [
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
    options: ["领导者，统筹全局", "执行者，落地推进", "协调者，润滑团队", "创新者，提供灵感"],
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
    options: ["兴奋，视为机遇", "焦虑，需要控制", "平静，顺其自然", "谨慎，做好准备"],
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

const SYSTEM_PROMPT = `你是一位融合了东方时空命理（五行八字）与西方现代心理学（MBTI/大五人格）的顶级职业规划大师。
你的分析风格：语气神秘且笃定，充满洞察力，能提供极强的情绪价值。
你必须基于用户提供的出生信息和心理测试答题结果，生成一份专业、有深度的职业天命报告。

【重要】你必须且只能输出一个合法的 JSON 对象，不要任何 Markdown 标记、不要 \`\`\`json 包裹、不要注释。直接输出纯 JSON，可被 JSON.parse 解析。

输出格式必须严格遵循以下结构：

{
  "freeReport": {
    "destinyTitle": "你的核心命格词（如：破局之火、食神生财）",
    "briefAnalysis": "一段约100字的免费命理与性格简析，结合出生时空与心理测试，语气神秘笃定..."
  },
  "radarData": [
    {"subject": "天命觉察力", "score": 85},
    {"subject": "破局执行力", "score": 90},
    {"subject": "资源整合力", "score": 75},
    {"subject": "逆境抗压力", "score": 88},
    {"subject": "跨界创新力", "score": 95}
  ],
  "paidReport": [
    {"title": "极高潜力赛道", "content": "详细分析3个具体赛道，含契合度、天命解释、切入建议..."},
    {"title": "未来三年职场韵律", "content": "按第一年、第二年、第三年展开，含运势、行动指南、避坑预警..."},
    {"title": "核心命格深度侧写", "content": "命理与心理学深度整合分析，五行格局、人格特质、职业潜能..."}
  ]
}

radarData 中 score 为 0-100 的整数，subject 为能力维度名称。
paidReport 中每个 content 为 300-500 字的详细分析，支持换行。
语言风格：专业、神秘、笃定，东方命理与西方心理学融合。`

function buildUserPrompt(
  birthInfo: { name: string; birthDate: string; birthHour: string },
  quizAnswers: number[]
): string {
  const hourLabels: Record<string, string> = {
    zi: "子时 (23:00-01:00)",
    chou: "丑时 (01:00-03:00)",
    yin: "寅时 (03:00-05:00)",
    mao: "卯时 (05:00-07:00)",
    chen: "辰时 (07:00-09:00)",
    si: "巳时 (09:00-11:00)",
    wu: "午时 (11:00-13:00)",
    wei: "未时 (13:00-15:00)",
    shen: "申时 (15:00-17:00)",
    you: "酉时 (17:00-19:00)",
    xu: "戌时 (19:00-21:00)",
    hai: "亥时 (21:00-23:00)",
    unknown: "时辰不详",
  }

  const quizText = quizAnswers
    .map((optionIndex, qIndex) => {
      const q = QUIZ_QUESTIONS[qIndex]
      if (!q) return ""
      const selected = q.options[optionIndex] ?? "（未作答）"
      return `Q${qIndex + 1}. ${q.question}\n选择：${selected}`
    })
    .filter(Boolean)
    .join("\n\n")

  return `## 用户出生信息
- 姓名：${birthInfo.name}
- 出生日期：${birthInfo.birthDate}
- 出生时辰：${hourLabels[birthInfo.birthHour] ?? birthInfo.birthHour}

## 心理测试答题记录
${quizText}

---
请基于以上信息，输出符合格式要求的 JSON 对象。`
}

/** API 返回的完整报告结构 */
export interface ReportPayload {
  freeReport: {
    destinyTitle: string
    briefAnalysis: string
  }
  radarData: Array<{ subject: string; score: number }>
  paidReport: Array<{ title: string; content: string }>
}

function parseReportJson(raw: string): ReportPayload {
  let cleaned = raw.trim()
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    cleaned = jsonMatch[0]
  }
  const parsed = JSON.parse(cleaned) as ReportPayload

  if (!parsed.freeReport || !parsed.radarData || !parsed.paidReport) {
    throw new Error("AI 返回的 JSON 结构不完整")
  }

  return {
    freeReport: {
      destinyTitle: String(parsed.freeReport.destinyTitle ?? "天命解析"),
      briefAnalysis: String(parsed.freeReport.briefAnalysis ?? ""),
    },
    radarData: Array.isArray(parsed.radarData)
      ? parsed.radarData.map((r: { subject?: string; score?: number }) => ({
          subject: String(r?.subject ?? "维度"),
          score: Math.min(100, Math.max(0, Number(r?.score) || 50)),
        }))
      : [],
    paidReport: Array.isArray(parsed.paidReport)
      ? parsed.paidReport.map((p: { title?: string; content?: string }) => ({
          title: String(p?.title ?? "章节"),
          content: String(p?.content ?? ""),
        }))
      : [],
  }
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "服务配置错误：未设置 GEMINI_API_KEY" },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { birthInfo, quizAnswers } = body as {
      birthInfo?: { name: string; birthDate: string; birthHour: string }
      quizAnswers?: number[]
    }

    if (!birthInfo || !quizAnswers) {
      return NextResponse.json(
        { error: "请求参数缺失：需要 birthInfo 和 quizAnswers" },
        { status: 400 }
      )
    }

    const userPrompt = buildUserPrompt(birthInfo, quizAnswers)

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    })

    const result = await model.generateContent(userPrompt)
    const response = result.response
    const text = response.text()

    if (!text) {
      return NextResponse.json(
        { error: "AI 未返回有效内容，请重试" },
        { status: 500 }
      )
    }

    let payload: ReportPayload
    try {
      payload = parseReportJson(text)
    } catch (parseError) {
      console.error("[generate-report] JSON 解析失败:", parseError)
      return NextResponse.json(
        { error: "报告解析失败，请重试" },
        { status: 500 }
      )
    }

    return NextResponse.json(payload)
  } catch (error) {
    console.error("[generate-report]", error)
    const message = error instanceof Error ? error.message : "生成报告失败"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
