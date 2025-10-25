"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Loader2, Search, Link2, FileText, LogOut } from "lucide-react"
import { ResearchResultComponent } from "./research-result"
import { SellerSpriteLoginDialog } from "./sellersprite-login-dialog"
import { useToast } from "@/hooks/use-toast"

type InputType = "asin" | "url" | "text"

export function ResearchForm() {
  const [inputType, setInputType] = useState<InputType>("asin")
  const [input, setInput] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/auth/status")
      const data = await response.json()
      setIsLoggedIn(data.sellersprite_ok || false)
    } catch (error) {
      console.error("[v0] Auth check error:", error)
      setIsLoggedIn(false)
    } finally {
      setIsCheckingAuth(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/sellersprite", { method: "DELETE" })
      setIsLoggedIn(false)
      toast({
        title: "已退出登录",
        description: "卖家精灵账号已退出",
      })
    } catch (error) {
      console.error("[v0] Logout error:", error)
    }
  }

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
    toast({
      title: "登录成功",
      description: "卖家精灵登录成功,已保存登录态",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    if (!isLoggedIn) {
      setShowLoginDialog(true)
      return
    }

    setIsAnalyzing(true)
    setResult(null)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, inputType }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("[v0] Analysis error:", error)
      setResult({ error: "Analysis failed. Please try again." })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const placeholders = {
    asin: "B0C1234ABC",
    url: "https://makerworld.com/en/models/492838",
    text: "3D打印的M18电池支架",
  }

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isCheckingAuth && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isLoggedIn ? "bg-green-500" : "bg-yellow-500"}`} />
                <span className="text-sm">{isLoggedIn ? "卖家精灵已登录" : "未登录卖家精灵"}</span>
              </div>
              {isLoggedIn && (
                <Button type="button" variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  退出登录
                </Button>
              )}
            </div>
          )}

          <div className="space-y-4">
            <Label className="text-base font-semibold">输入类型 / Input Type</Label>
            <Tabs value={inputType} onValueChange={(v) => setInputType(v as InputType)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="asin" className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  ASIN
                </TabsTrigger>
                <TabsTrigger value="url" className="flex items-center gap-2">
                  <Link2 className="w-4 h-4" />
                  URL
                </TabsTrigger>
                <TabsTrigger value="text" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  文本
                </TabsTrigger>
              </TabsList>

              <TabsContent value={inputType} className="mt-4">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={placeholders[inputType]}
                  className="min-h-32 font-mono text-sm"
                  disabled={isAnalyzing}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={isAnalyzing || !input.trim()} className="flex-1" size="lg">
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  分析中...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  开始分析 / Analyze
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>

      {result && <ResearchResultComponent result={result} />}

      <SellerSpriteLoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  )
}
