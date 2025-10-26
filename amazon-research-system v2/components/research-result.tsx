"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, CheckCircle2, AlertCircle, Download, ExternalLink, Search, Loader2 } from "lucide-react"
import { useState } from "react"
import type { ResearchResultType } from "@/lib/types"
import { toast } from "sonner"

interface ResearchResultProps {
  result: ResearchResultType & { error?: string }
}

interface AmazonResearchData {
  title?: string
  price?: string
  rating?: string
  reviewCount?: string
  availability?: string
  imageUrl?: string
  brand?: string
  features?: string[]
  description?: string
  topProducts?: Array<{
    asin: string
    title: string
    price: string
    rating: string
    reviewCount: string
    imageUrl: string
    sponsored: boolean
  }>
}

export function ResearchResultComponent({ result }: ResearchResultProps) {
  const [copied, setCopied] = useState(false)
  const [isResearching, setIsResearching] = useState(false)
  const [researchData, setResearchData] = useState<AmazonResearchData | null>(null)
  const [researchProgress, setResearchProgress] = useState<{
    step: number
    total: number
    message: string
  } | null>(null)

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

  const handleStartResearch = async () => {
    setIsResearching(true)
    setResearchProgress({ step: 1, total: 5, message: "准备启动浏览器..." })
    toast.info("开始调研亚马逊数据...", { description: "这可能需要10-60秒" })

    try {
      // 模拟进度更新
      const progressUpdates = [
        { step: 1, total: 5, message: "正在启动无头浏览器..." },
        { step: 2, total: 5, message: "正在访问Amazon网站..." },
        { step: 3, total: 5, message: "正在加载产品页面..." },
        { step: 4, total: 5, message: "正在提取产品数据..." },
        { step: 5, total: 5, message: "正在整理调研结果..." },
      ]

      let currentStep = 0
      const progressInterval = setInterval(() => {
        if (currentStep < progressUpdates.length - 1) {
          currentStep++
          setResearchProgress(progressUpdates[currentStep])
        }
      }, 8000) // 每8秒更新一次进度

      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          searchQuery: result.search_query,
          asin: result.input_type === "asin" ? result.product_name?.match(/B[0-9A-Z]{9}/)?.[0] : undefined,
        }),
      })

      clearInterval(progressInterval)
      setResearchProgress({ step: 5, total: 5, message: "调研完成！" })

      if (!response.ok) {
        throw new Error("调研失败")
      }

      const data = await response.json()
      setResearchData(data.data)
      toast.success("调研完成！", { description: "已成功获取亚马逊产品数据" })
    } catch (error) {
      console.error("Research error:", error)
      toast.error("调研失败", { description: error instanceof Error ? error.message : "未知错误" })
      setResearchProgress(null)
    } finally {
      setIsResearching(false)
      setTimeout(() => setResearchProgress(null), 3000) // 3秒后清除进度显示
    }
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

        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleSearchAmazon} variant="outline" className="flex-1 sm:flex-none flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              在亚马逊搜索 / Search on Amazon
            </Button>
            <Button
              onClick={handleStartResearch}
              disabled={isResearching}
              className="flex-1 sm:flex-none flex items-center gap-2"
            >
              {isResearching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  调研中...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  确认并开始调研 / Start Research
                </>
              )}
            </Button>
          </div>

          {/* 进度显示 */}
          {researchProgress && (
            <Card className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-blue-700 dark:text-blue-300">
                    {researchProgress.message}
                  </span>
                  <span className="text-blue-600 dark:text-blue-400">
                    {researchProgress.step}/{researchProgress.total}
                  </span>
                </div>
                <div className="relative w-full h-2 bg-blue-100 dark:bg-blue-900/30 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-blue-500 dark:bg-blue-400 transition-all duration-500 ease-out"
                    style={{ width: `${(researchProgress.step / researchProgress.total) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>预计还需 {Math.max(0, (researchProgress.total - researchProgress.step) * 8)} 秒</span>
                </div>
              </div>
            </Card>
          )}
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

      {researchData && (
        <Card className="p-6 border-green-500/20 bg-green-50/50 dark:bg-green-950/20">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <h2 className="text-xl font-bold">亚马逊调研数据 / Amazon Research Data</h2>
          </div>

          {researchData.topProducts ? (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground mb-3">
                找到 {researchData.topProducts.length} 个相关产品（Top 5搜索结果）
              </div>
              {researchData.topProducts.map((product, index) => (
                <Card key={product.asin} className="p-4 bg-background">
                  <div className="flex gap-4">
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-24 h-24 object-contain rounded-md border"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-sm line-clamp-2">{product.title}</h3>
                        {product.sponsored && (
                          <Badge variant="secondary" className="text-xs">
                            Sponsored
                          </Badge>
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-sm">
                        {product.price && <span className="font-bold text-green-600">{product.price}</span>}
                        {product.rating && (
                          <span className="flex items-center gap-1">
                            ⭐ {product.rating}
                          </span>
                        )}
                        {product.reviewCount && <span className="text-muted-foreground">({product.reviewCount})</span>}
                      </div>
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs font-mono">
                          ASIN: {product.asin}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {researchData.imageUrl && (
                <div className="flex justify-center">
                  <img src={researchData.imageUrl} alt={researchData.title} className="max-w-xs rounded-lg border" />
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                {researchData.title && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">产品标题</h3>
                    <p className="text-sm">{researchData.title}</p>
                  </div>
                )}

                {researchData.price && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">价格</h3>
                    <p className="text-lg font-bold text-green-600">{researchData.price}</p>
                  </div>
                )}

                {researchData.rating && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">评分</h3>
                    <p className="text-sm">⭐ {researchData.rating}</p>
                  </div>
                )}

                {researchData.reviewCount && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">评论数</h3>
                    <p className="text-sm">{researchData.reviewCount}</p>
                  </div>
                )}

                {researchData.brand && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">品牌</h3>
                    <p className="text-sm">{researchData.brand}</p>
                  </div>
                )}

                {researchData.availability && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">库存状态</h3>
                    <p className="text-sm">{researchData.availability}</p>
                  </div>
                )}
              </div>

              {researchData.features && researchData.features.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">产品特点</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {researchData.features.map((feature, i) => (
                      <li key={i} className="text-muted-foreground">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {researchData.description && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">产品描述</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{researchData.description}</p>
                </div>
              )}
            </div>
          )}
        </Card>
      )}

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
