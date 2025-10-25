import { cookies } from "next/headers"

// Simple encryption/decryption (in production, use proper encryption)
function encryptCredentials(email: string, password: string): string {
  // In production, use proper encryption like crypto.subtle or a library
  const data = JSON.stringify({ email, password })
  return Buffer.from(data).toString("base64")
}

function decryptCredentials(encrypted: string): { email: string; password: string } | null {
  try {
    const data = Buffer.from(encrypted, "base64").toString("utf-8")
    return JSON.parse(data)
  } catch {
    return null
  }
}

export async function POST(req: Request) {
  try {
    const { email, password, remember } = await req.json()

    if (!email || !password) {
      return Response.json({ error: "邮箱和密码不能为空" }, { status: 400 })
    }

    // TODO: In production, validate credentials with actual SellerSprite API
    // For now, we'll simulate a successful login
    console.log("[v0] SellerSprite login attempt:", { email, remember })

    // Simulate API validation (replace with actual API call)
    const isValid = true // Replace with actual validation

    if (!isValid) {
      return Response.json({ error: "登录失败,请检查账号或密码" }, { status: 401 })
    }

    // Store encrypted credentials if remember is true
    if (remember) {
      const encrypted = encryptCredentials(email, password)
      const cookieStore = await cookies()
      cookieStore.set("sellersprite_auth", encrypted, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      })
    }

    return Response.json({
      success: true,
      message: "卖家精灵登录成功,已保存登录态",
    })
  } catch (error) {
    console.error("[v0] SellerSprite login error:", error)
    return Response.json({ error: "登录失败,请稍后重试" }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete("sellersprite_auth")

    return Response.json({
      success: true,
      message: "已退出登录",
    })
  } catch (error) {
    console.error("[v0] SellerSprite logout error:", error)
    return Response.json({ error: "退出登录失败" }, { status: 500 })
  }
}
