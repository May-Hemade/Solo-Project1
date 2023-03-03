import express from "express"
import {
  getProduct,
  getReviews,
  writeProducts,
  writeReviews,
} from "../../lib/fs-tools.js"
import { checkProductSchema, triggerBadRequest } from "./validation.js"
import uniqid from "uniqid"
import { parseFile, uploadImage } from "../../upload/index.js"

const productRouter = express.Router()

productRouter.get("/", async (req, res, next) => {
  try {
    const productArray = await getProduct()

    let category = req.query.category
    if (category) {
      let specificCategory = productArray.filter(
        (product) => product.category === category
      )
      res.send(specificCategory)
    } else {
      res.send(productArray)
    }
  } catch (error) {
    res.send(500).send({ message: error.message })
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
      const productArray = await getProduct()
      productArray.push(newProduct)
      await writeProducts(productArray)
      res.status(200).send(newProduct)
    } catch (error) {
      next(error)
    }
  }
)

productRouter.put("/:id", async (req, res, next) => {
  try {
    const productArray = await getProduct()
    const index = productArray.findIndex(
      (product) => product._id === req.params.id
    )
    const oldProduct = productArray[index]
    const updatedProduct = { ...oldProduct, ...req.body, updatedAt: new Date() }
    productArray[index] = updatedProduct
    await writeProducts(productArray)
    res.send(updatedProduct)
  } catch (error) {
    next(error)
  }
})

productRouter.get("/:id", async (req, res, next) => {
  try {
    const productArray = await getProduct()
    const product = productArray.find(
      (product) => product._id === req.params.id
    )
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
    const productArray = await getProduct()
    const remainingProducts = productArray.filter(
      (product) => product._id !== req.params.body
    )

    await writeProducts(productArray)
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
      let fileAsJSONArray = await getProduct()

      const index = fileAsJSONArray.findIndex(
        (product) => product._id === req.params.id
      )
      if (index === -1) {
        res
          .status(404)
          .send({ message: `product with ${req.params.id} is not found!` })
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
      res.send(500).send({ message: error.message })
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
      const reviewsArray = await getReviews()

      reviewsArray.push(newReview)
      await writeReviews(reviewsArray)
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
      const reviewsArray = await getReviews()
      const reviewOfProduct = reviewsArray.filter(
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
      const reviewsArray = await getReviews()

      const oneReview = reviewsArray.find(
        (review) => review._id === req.params.reviewId
      )
      if (oneReview) {
        res.send(oneReview)
      } else {
        res.status(404).send({ message: "not found" })
      }
    } catch (error) {
      next(error)
    }
  }
)

productRouter.post(
  "/:id/reviews/:reviewId",

  async (req, res, next) => {
    try {
      const reviewsArray = await getReviews()

      const oneReview = reviewsArray.find(
        (review) => review._id === req.params.reviewId
      )
      if (oneReview) {
        res.send(oneReview)
      } else {
        res.status(404).send({ message: "not found" })
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
      const reviewsArray = await getReviews()

      const index = reviewsArray.findIndex(
        (review) => review._id === req.params.reviewId
      )

      if (index !== -1) {
        const oldReview = reviewsArray[index]
        const updatedReview = {
          ...oldReview,
          ...req.body,
          updatedAt: new Date(),
        }
        reviewsArray[index] = updatedReview
        await writeReviews(reviewsArray)
        res.send(updatedReview)
      } else {
        res.status(404).send({ message: "not found" })
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
      const reviewsArray = await getReviews()
      const remaining = reviewsArray.filter(
        (review) => review._id !== req.params.reviewId
      )
      await writeReviews(remaining)
      res.status(200).send()
    } catch (error) {
      next(error)
    }
  }
)

export default productRouter
