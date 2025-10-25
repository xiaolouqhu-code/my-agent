export interface ResearchResultType {
  input_type: "asin" | "makerworld" | "url" | "text" | "image"
  product_name: string
  product_type: string
  product_type_cn: string
  summary: string
  keywords: string[]
  category_path: string
  target_users: string[]
  compatible_with?: string[]
  search_query: string
  confidence: number
}

export interface AnalysisRequest {
  input: string
  inputType: "asin" | "url" | "text"
}

export interface AnalysisResponse extends ResearchResultType {
  error?: string
}
