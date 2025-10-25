import { ResearchForm } from "@/components/research-form"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 text-balance">流金亚马逊智能调研系统</h1>
          <p className="text-xl text-muted-foreground text-balance">Amazon Research Intelligence System</p>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-pretty">
            输入 ASIN、产品链接或文本描述，系统将自动分析并生成标准化的调研数据
          </p>
        </div>

        <ResearchForm />
      </main>
    </div>
  )
}
