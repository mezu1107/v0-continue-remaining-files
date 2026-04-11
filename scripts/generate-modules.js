// Script to generate all 28 module CRUD API files
// Run: node scripts/generate-modules.js

const fs = require("fs")
const path = require("path")

const modules = [
  // Core Business
  "leads",
  "portfolio",
  "packages",
  "crm",

  // Content
  "blog",
  "knowledge_base",
  "faqs",

  // Legal
  "terms",
  "documents",
  "contracts",

  // Support
  "tickets",
  "proposals",
  "support_portal",

  // Finance
  "invoices",
  "reports",
  "subscriptions",
  "multi_company",

  // Team
  "team_members",
  "performance",
  "security",
  "backups",

  // Marketing
  "campaigns",
  "analytics",

  // System
  "settings",
  "portal_config",
]

const template = (moduleName) => `import { createCRUDHandler, moduleConfigs } from "@/lib/admin/module-crud-generator"

const handler = createCRUDHandler(moduleConfigs.${moduleName})

export const GET = handler.GET
export const POST = handler.POST
export const PUT = handler.PUT
export const DELETE = handler.DELETE
`

function generateModules() {
  modules.forEach((module) => {
    const dir = path.join(__dirname, `../app/api/admin/modules/${module}`)

    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    // Write route.ts file
    const filePath = path.join(dir, "route.ts")
    fs.writeFileSync(filePath, template(module))

    console.log(`✓ Created ${filePath}`)
  })

  console.log(`\n✅ Generated ${modules.length} module APIs`)
}

generateModules()
