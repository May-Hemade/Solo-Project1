import express from "express"

import path, { dirname, join } from "path"
import { fileURLToPath } from "url"
import cors from "cors"
import listEndpoints from "express-list-endpoints"
import { badRequestHandler, genericErrorHandler, notFoundHandler, unauthorizedHandler } from "./upload/errorHandlers.js"
import productRouter from "./api/product/index.js"
const server = express()
const __filename = fileURLToPath(import.meta.url)

const __dirname = dirname(__filename)
const port = 3001
server.use(express.json())
const publicFolderPath = join(process.cwd(), "./public")

server.use(express.static(publicFolderPath))
server.use(cors())

server.use("/products", productRouter)

server.use(badRequestHandler) // 400
server.use(unauthorizedHandler) // 401
server.use(notFoundHandler) // 404
server.use(genericErrorHandler) // 500

server.listen(port, () => {
  console.table(listEndpoints(server))
  console.log("Server is running on port:", port)
  console.log("hey", process.env.BE_HOST)
})
server.on("error", (error) => console.log(`❌ Server is not running due to : ${error}`))
