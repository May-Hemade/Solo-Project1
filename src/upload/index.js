import path, { dirname, extname } from "path"

import { fileURLToPath } from "url"

import fs from "fs"

import multer from "multer"
import { saveProductImage } from "../lib/fs-tools.js"

const __filename = fileURLToPath(import.meta.url)

const __dirname = dirname(__filename)

const productDirectory = path.join(__dirname, "../../../public/img/product")

export const parseFile = multer()

export const uploadImage = async (req, res, next) => {
  const { originalname, buffer } = req.file //multer
  const extension = extname(originalname) //ex .jpg .png...
  const fileName = `${req.params.id}${extension}`
  await saveProductImage(fileName, buffer)
  const link = `${process.env.BE_HOST}img/product/${fileName}`
  req.file = link // this is the link I send
  next()
}
