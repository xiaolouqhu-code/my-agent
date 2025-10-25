"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, CheckCircle2, AlertCircle, Download, ExternalLink } from "lucide-react"
import { useState } from "react"
import type { ResearchResultType } from "@/lib/types"

interface ResearchResultProps {
  result: ResearchResultType & { error?: string }
}

export function ResearchResultComponent({ result }: ResearchResultProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `amazon-research-${result.product_name?.replace(/\s+/g, "-").toLowerCase() || "result"}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleSearchAmazon = () => {
    const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(result.search_query)}`
    window.open(searchUrl, "_blank")
  }

  if (result.error) {
    return (
      <Card className="p-6 border-destructive">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
          <div>
            <h3 className="font-semibold text-destructive mb-1">分析失败 / Analysis Failed</h3>
            <p className="text-sm text-muted-foreground">{result.error}</p>
          </div>
        </div>
      </Card>
    )
  }

  const confidenceColor =
    result.confidence >= 0.8 ? "text-green-500" : result.confidence >= 0.6 ? "text-yellow-500" : "text-orange-500"

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6 gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2 text-balance">{result.product_name}</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary">{result.input_type}</Badge>
              <Badge variant="outline">{result.product_type}</Badge>
              <span className={`text-sm font-semibold ${confidenceColor}`}>
                置信度: {(result.confidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy} className="flex items-center gap-2 bg-transparent">
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  复制
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex items-center gap-2 bg-transparent"
            >
              <Download className="w-4 h-4" />
              下载
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <Button onClick={handleSearchAmazon} className="w-full md:w-auto flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            在亚马逊搜索 / Search on Amazon
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">产品类型 (中文)</h3>
              <p className="text-base">{result.product_type_cn}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">产品说明</h3>
              <p className="text-base text-pretty leading-relaxed">{result.summary}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">类目路径 / Category Path</h3>
              <p className="text-sm font-mono bg-muted px-3 py-2 rounded-md">{result.category_path}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">关键词 / Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {result.keywords.map((keyword: string, i: number) => (
                  <Badge key={i} variant="secondary" className="font-mono">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">目标用户 / Target Users</h3>
              <div className="flex flex-wrap gap-2">
                {result.target_users.map((user: string, i: number) => (
                  <Badge key={i} variant="outline">
                    {user}
                  </Badge>
                ))}
              </div>
            </div>

            {result.compatible_with && result.compatible_with.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">兼容性 / Compatibility</h3>
                <div className="flex flex-wrap gap-2">
                  {result.compatible_with.map((item: string, i: number) => (
                    <Badge key={i} variant="outline" className="bg-accent/10">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">搜索查询 / Search Query</h3>
              <p className="text-sm font-mono bg-primary/10 text-primary p-3 rounded-md border border-primary/20">
                {result.search_query}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-muted/30">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-muted-foreground">完整 JSON 输出 / Full JSON Output</h3>
          <span className="text-xs text-muted-foreground">可直接用于 Playwright 调研爬虫</span>
        </div>
        <pre className="text-xs font-mono overflow-x-auto p-4 bg-background rounded-md border border-border leading-relaxed">
          {JSON.stringify(result, null, 2)}
        </pre>
      </Card>
    </div>
  )
}
