"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Loader2, Search, Link2, FileText } from "lucide-react"
import { ResearchResultComponent } from "./research-result"

type InputType = "asin" | "url" | "text"

export function ResearchForm() {
  const [inputType, setInputType] = useState<InputType>("asin")
  const [input, setInput] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

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
    </div>
  )
}
