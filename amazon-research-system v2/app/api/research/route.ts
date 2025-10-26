import { chromium } from "playwright"

// Helper function for random delays (human-like behavior)
function randomDelay(min: number, max: number): Promise<void> {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min
  return new Promise(resolve => setTimeout(resolve, delay))
}

// Simulate human-like mouse movements
async function simulateHumanBehavior(page: any) {
  // Random mouse movements
  const x = Math.floor(Math.random() * 1000) + 100
  const y = Math.floor(Math.random() * 600) + 100
  await page.mouse.move(x, y)
  await randomDelay(500, 1500)

  // Random scrolling
  const scrollAmount = Math.floor(Math.random() * 300) + 100
  await page.evaluate((amount) => {
    window.scrollBy(0, amount)
  }, scrollAmount)
  await randomDelay(800, 2000)
}

export async function POST(req: Request) {
  try {
    const { searchQuery, asin } = await req.json()

    if (!searchQuery && !asin) {
      return Response.json({ error: "Missing searchQuery or asin" }, { status: 400 })
    }

    console.log("[v0] Starting Amazon research:", { searchQuery, asin })

    // Random delay before starting (1-3 seconds)
    await randomDelay(1000, 3000)

    // Launch browser
    const browser = await chromium.launch({
      headless: true,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-features=IsolateOrigins,site-per-process',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
      ]
    })

    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      viewport: { width: 1920, height: 1080 },
      locale: 'en-US',
      timezoneId: 'America/New_York',
      hasTouch: false,
      javaScriptEnabled: true,
    })

    const page = await context.newPage()

    // Hide automation indicators with enhanced stealth
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      })

      // Override chrome property
      Object.defineProperty(navigator, 'chrome', {
        get: () => ({
          runtime: {},
        }),
      })

      // Override permissions
      const originalQuery = window.navigator.permissions.query
      window.navigator.permissions.query = (parameters: any) => (
        parameters.name === 'notifications' ?
          Promise.resolve({ state: 'denied' } as PermissionStatus) :
          originalQuery(parameters)
      )

      // Override plugins
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5],
      })
    })

    let productData: any = {}

    if (asin) {
      // Direct ASIN lookup
      const url = `https://www.amazon.com/dp/${asin}`
      console.log("[v0] Fetching product page:", url)

      try {
        // Random delay before navigation (2-4 seconds)
        await randomDelay(2000, 4000)

        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 })

        // Simulate human behavior after page load
        await randomDelay(2000, 4000)
        await simulateHumanBehavior(page)

        // Wait for product title to ensure page loaded
        await page.waitForSelector("#productTitle", { timeout: 10000 }).catch(() => {
          console.log("[v0] Product title not found, continuing anyway")
        })

        // Additional random delay and scrolling
        await randomDelay(1500, 3000)
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight / 2)
        })
        await randomDelay(1000, 2000)
      } catch (error) {
        console.log("[v0] Page load warning:", error)
        // Continue anyway, we'll extract what we can
      }

      // Extract product data
      productData = await page.evaluate(() => {
        const getTextContent = (selector: string): string => {
          const element = document.querySelector(selector)
          return element?.textContent?.trim() || ""
        }

        const getAttributeContent = (selector: string, attribute: string): string => {
          const element = document.querySelector(selector)
          return element?.getAttribute(attribute) || ""
        }

        return {
          title: getTextContent("#productTitle"),
          price: getTextContent(".a-price .a-offscreen") || getTextContent("#priceblock_ourprice"),
          rating: getTextContent(".a-icon-star .a-icon-alt"),
          reviewCount: getTextContent("#acrCustomerReviewText"),
          availability: getTextContent("#availability span"),
          imageUrl: getAttributeContent("#landingImage", "src"),
          brand: getTextContent("#bylineInfo"),
          // Product features
          features: Array.from(document.querySelectorAll("#feature-bullets li span"))
            .map((el) => el.textContent?.trim())
            .filter(Boolean),
          // Product description
          description:
            getTextContent("#productDescription") ||
            getTextContent("#feature-bullets") ||
            getTextContent(".a-section.a-spacing-medium"),
        }
      })
    } else if (searchQuery) {
      // Search and get top results
      const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(searchQuery)}`
      console.log("[v0] Searching Amazon:", searchUrl)

      try {
        // Random delay before navigation (2-5 seconds)
        await randomDelay(2000, 5000)

        await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 60000 })

        // Simulate human behavior after page load
        await randomDelay(2500, 4500)
        await simulateHumanBehavior(page)

        // Wait for search results to load
        await page.waitForSelector('[data-component-type="s-search-result"]', { timeout: 10000 }).catch(() => {
          console.log("[v0] Search results not found, continuing anyway")
        })

        // Additional human-like scrolling through results
        await randomDelay(1500, 3000)
        await page.evaluate(() => {
          window.scrollTo(0, 400)
        })
        await randomDelay(1000, 2500)
        await page.evaluate(() => {
          window.scrollTo(0, 800)
        })
        await randomDelay(800, 1800)
      } catch (error) {
        console.log("[v0] Search page load warning:", error)
        // Continue anyway, we'll extract what we can
      }

      // Get top 5 search results
      const searchResults = await page.evaluate(() => {
        const results: any[] = []
        const items = document.querySelectorAll('[data-component-type="s-search-result"]')

        items.forEach((item, index) => {
          if (index >= 5) return // Only top 5

          const getTextContent = (selector: string): string => {
            const element = item.querySelector(selector)
            return element?.textContent?.trim() || ""
          }

          const getAttributeContent = (selector: string, attribute: string): string => {
            const element = item.querySelector(selector)
            return element?.getAttribute(attribute) || ""
          }

          const asin = item.getAttribute("data-asin")
          if (!asin) return

          results.push({
            asin,
            title: getTextContent("h2 a span"),
            price: getTextContent(".a-price .a-offscreen"),
            rating: getTextContent(".a-icon-star-small .a-icon-alt"),
            reviewCount: getTextContent(".a-size-base.s-underline-text"),
            imageUrl: getAttributeContent("img.s-image", "src"),
            sponsored: item.querySelector(".s-sponsored-header") !== null,
          })
        })

        return results
      })

      productData = {
        searchQuery,
        resultsCount: searchResults.length,
        topProducts: searchResults,
      }
    }

    await browser.close()

    console.log("[v0] Research completed:", JSON.stringify(productData, null, 2))

    return Response.json({
      success: true,
      data: productData,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Research error:", error)
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Research failed",
      },
      { status: 500 },
    )
  }
}
