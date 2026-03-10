"use client"

import { useState } from "react"
import { AstrolabeBackground } from "@/components/astrolabe-background"
import { LandingPage } from "@/components/landing-page"
import { BirthInfoForm } from "@/components/birth-info-form"
import { QuizPage } from "@/components/quiz-page"
import { ResultsPage, type ReportData } from "@/components/results-page"
import { FullReportPage } from "@/components/full-report-page"

type AppState = "landing" | "birth-info" | "quiz" | "results" | "full-report"

interface UserData {
  name: string
  birthDate: string
  birthHour: string
}

export default function Home() {
  const [appState, setAppState] = useState<AppState>("landing")
  const [userData, setUserData] = useState<UserData | null>(null)
  const [quizAnswers, setQuizAnswers] = useState<number[]>([])
  const [reportData, setReportData] = useState<ReportData | null>(null)

  const handleStart = () => {
    setAppState("birth-info")
  }

  const handleBirthInfoSubmit = (data: UserData) => {
    setUserData(data)
    setAppState("quiz")
  }

  const handleQuizComplete = (answers: number[]) => {
    setQuizAnswers(answers)
    setAppState("results")
  }

  const handleUnlock = (data: ReportData) => {
    setReportData(data)
    setAppState("full-report")
  }

  const handleBackToLanding = () => {
    setAppState("landing")
  }

  const handleBackToBirthInfo = () => {
    setAppState("birth-info")
  }

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Cosmic background */}
      <AstrolabeBackground />

      {/* Content */}
      <div className="relative z-10">
        {appState === "landing" && <LandingPage onStart={handleStart} />}

        {appState === "birth-info" && (
          <BirthInfoForm
            onSubmit={handleBirthInfoSubmit}
            onBack={handleBackToLanding}
          />
        )}

        {appState === "quiz" && userData && (
          <QuizPage onComplete={handleQuizComplete} onBack={handleBackToBirthInfo} />
        )}

        {appState === "results" && userData && (
          <ResultsPage
            userData={userData}
            quizAnswers={quizAnswers}
            onUnlock={handleUnlock}
          />
        )}

        {appState === "full-report" && userData && reportData && (
          <FullReportPage userData={userData} reportData={reportData} />
        )}
      </div>
    </main>
  )
}
