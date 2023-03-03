import { checkSchema, validationResult } from "express-validator"
import createHttpError from "http-errors"

const productSchema = {
  name: {
    in: ["body"],
    trim: true,
    notEmpty: true,
    isString: {
      errorMessage: "name is a mandatory field and needs to be a string!",
    },
  },
  description: {
    in: ["body"],
    isString: {
      errorMessage:
        "description is a mandatory field and needs to be a string!",
    },
  },
  brand: {
    in: ["body"],
    isString: {
      errorMessage: "brand is a mandatory field and needs to be a string!",
    },
  },
  //   imageUrl: {
  //     in: ["body"],
  //     isString: {
  //       errorMessage: "imageUrl is a mandatory field and needs to be a string!",
  //     },
  //   },
  price: {
    in: ["body"],
    isNumaric: {
      errorMessage: "price is a mandatory field and needs to be a string!",
    },
  },
  category: {
    in: ["body"],
    isString: {
      errorMessage: "category is a mandatory field and needs to be a string!",
    },
  },
}

export const checkProductSchema = checkSchema(productSchema)

export const triggerBadRequest = (req, res, next) => {
  // 1. Check if previous middleware ( checksBooksSchema) has detected any error in req.body
  const errors = validationResult(req)

  console.log(errors.array())

  if (!errors.isEmpty()) {
    // 2.1 If we have any error --> trigger error handler 400
    next(
      createHttpError(400, "Errors during product validation", {
        errorsList: errors.array(),
      })
    )
  } else {
    // 2.2 Else (no errors) --> normal flow (next)
    next()
  }
}

export const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const error = new Error("product post validation is failed")
    error.status = 400
    error.errors = errors.array()
    next(error)
  }
  next()
}
