import { fileURLToPath } from "url"
import { dirname, join } from "path"
import fs from "fs-extra"

const { readJSON, writeJSON, writeFile } = fs

const apiFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../api")
const publicFolderPathProduct = join(process.cwd(), "./public/img/products")

console.log("ROOT OF THE PROJECT:", process.cwd())

console.log("DATA FOLDER PATH: ", apiFolderPath)
const productsJSONPath = join(apiFolderPath, "/product/product.json")
const reviewsJSONPath = join(apiFolderPath, "/reviews/reviews.json")

export const getProducts = () => readJSON(productsJSONPath)
export const writeProducts = (productsArray) =>
  writeJSON(productsJSONPath, productsArray)
export const getReviews = () => readJSON(reviewsJSONPath)
export const writeReviews = (reviewsArray) =>
  writeJSON(reviewsJSONPath, reviewsArray)

export const saveProductImage = (fileName, contentAsABuffer) =>
  writeFile(join(publicFolderPathProduct, fileName), contentAsABuffer) //use this in tools
