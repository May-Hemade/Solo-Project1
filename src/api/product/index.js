import express from "express"
import {
  getProducts,
  getReviews,
  writeProducts,
  writeReviews,
} from "../../lib/fs-tools.js"
import { checkProductSchema, triggerBadRequest } from "./validation.js"
import uniqid from "uniqid"
import { parseFile, uploadImage } from "../../upload/index.js"
import createHttpError from "http-errors"

const productRouter = express.Router()

productRouter.get("/", async (req, res, next) => {
  try {
    const products = await getProducts()

    const category = req.query.category
    if (category) {
      const specificCategory = products.filter(
        (product) => product.category === category
      )
      res.send(specificCategory)
    } else {
      res.send(productArray)
    }
  } catch (err) {
    next(err)
  }
})

productRouter.post(
  "/",
  checkProductSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const { category, imageUrl, name, price, description, brand } = req.body
      const newProduct = {
        category,
        imageUrl,
        name,
        price,
        description,
        brand,
        createdAt: new Date(),
        updatedAt: new Date(),
        _id: uniqid(),
      }
      const products = await getProducts()
      products.push(newProduct)
      await writeProducts(productArray)
      res.status(200).send(newProduct)
    } catch (error) {
      next(error)
    }
  }
)

productRouter.put("/:id", async (req, res, next) => {
  try {
    const products = await getProducts()
    const index = products.findIndex((product) => product._id === req.params.id)
    if (index !== -1) {
      const oldProduct = products[index]
      const updatedProduct = {
        ...oldProduct,
        ...req.body,
        updatedAt: new Date(),
      }
      products[index] = updatedProduct
      await writeProducts(productArray)
      res.send(updatedProduct)
    } else {
      next(createHttpError(404, `Product with id ${req.params.id} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

productRouter.get("/:id", async (req, res, next) => {
  try {
    const products = await getProducts()
    const product = products.find((product) => product._id === req.params.id)
    if (product) {
      res.send(product)
    } else {
      next(NotFound(`product with id ${req.params.id} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

productRouter.delete("/:id", async (req, res, next) => {
  try {
    const products = await getProducts()
    const remainingProducts = products.filter(
      (product) => product._id !== req.params.body
    )

    await writeProducts(remainingProducts)
    res.send()
  } catch (error) {
    next(error)
  }
})

productRouter.post(
  "/:id/upload",
  parseFile.single("img"),
  uploadImage,
  async (req, res, next) => {
    try {
      const fileAsJSONArray = await getProducts()

      const index = fileAsJSONArray.findIndex(
        (product) => product._id === req.params.id
      )
      if (index === -1) {
        next(
          createHttpError(404, `Product with id ${req.params.id} not found!`)
        )
        return
      }
      const previousProductData = fileAsJSONArray[index]
      const changedProduct = {
        ...previousProductData,
        imageUrl: req.file,
        updatedAt: new Date(),
      }
      fileAsJSONArray[index] = changedProduct
      await writeProducts(fileAsJSONArray)
      res.send(changedProduct)
    } catch (error) {
      next(error)
    }
  }
)

productRouter.post(
  "/:id/reviews",

  async (req, res, next) => {
    try {
      const { comment, rate } = req.body
      const newReview = {
        comment,
        rate,
        productId: req.params.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        _id: uniqid(),
      }
      const reviews = await getReviews()

      reviews.push(newReview)
      await writeReviews(reviews)
      res.status(200).send(newReview)
    } catch (error) {
      next(error)
    }
  }
)

productRouter.get(
  "/:id/reviews",

  async (req, res, next) => {
    try {
      const reviews = await getReviews()
      const reviewOfProduct = reviews.filter(
        (review) => review.productId === req.params.id
      )

      res.send(reviewOfProduct)
    } catch (error) {
      next(error)
    }
  }
)

productRouter.get(
  "/:id/reviews/:reviewId",

  async (req, res, next) => {
    try {
      const reviews = await getReviews()

      const oneReview = reviews.find(
        (review) => review._id === req.params.reviewId
      )
      if (oneReview) {
        res.send(oneReview)
      } else {
        next(
          createHttpError(
            404,
            `Review with id ${req.params.reviewId} not found!`
          )
        )
      }
    } catch (error) {
      next(error)
    }
  }
)

productRouter.put(
  "/:id/reviews/:reviewId",

  async (req, res, next) => {
    try {
      const reviews = await getReviews()

      const index = reviews.findIndex(
        (review) => review._id === req.params.reviewId
      )

      if (index !== -1) {
        const oldReview = reviews[index]
        const updatedReview = {
          ...oldReview,
          ...req.body,
          updatedAt: new Date(),
        }
        reviews[index] = updatedReview
        await writeReviews(reviews)
        res.send(updatedReview)
      } else {
        next(
          createHttpError(
            404,
            `Review with id ${req.params.reviewId} not found!`
          )
        )
      }
    } catch (error) {
      next(error)
    }
  }
)

productRouter.delete(
  "/:id/reviews/:reviewId",

  async (req, res, next) => {
    try {
      const reviews = await getReviews()
      const remaining = reviews.filter(
        (review) => review._id !== req.params.reviewId
      )
      if (reviews.length !== remaining.length) {
        await writeReviews(remaining)
        res.status(200).send()
      } else {
        next(
          createHttpError(
            404,
            `Review with id ${req.params.reviewId} not found!`
          )
        )
      }
    } catch (error) {
      next(error)
    }
  }
)

export default productRouter
