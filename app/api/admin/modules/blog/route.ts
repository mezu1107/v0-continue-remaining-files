import { createCRUDHandler, moduleConfigs } from "@/lib/admin/module-crud-generator"

const handler = createCRUDHandler(moduleConfigs.blog)

export const GET = handler.GET
export const POST = handler.POST
export const PUT = handler.PUT
export const DELETE = handler.DELETE
