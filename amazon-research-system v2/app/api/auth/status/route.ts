import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = await cookies()
  const sellerspriteAuth = cookieStore.get("sellersprite_auth")

  return Response.json({
    sellersprite_ok: !!sellerspriteAuth,
  })
}
