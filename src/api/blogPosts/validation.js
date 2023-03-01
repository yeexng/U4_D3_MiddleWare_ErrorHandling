import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const blogPostSchema = {
  title: {
    in: ["body"],
    isString: {
      errorMessage: "Please fill in a Title...",
    },
  },
  category: {
    in: ["body"],
    isString: {
      errorMessage: "Please assign a category...",
    },
  },
  author: {
    name: {
      in: ["body"],
      isString: {
        errorMessage: "Please name the Author...",
      },
    },
  },
};

export const checkBlogPostSchema = checkSchema(blogPostSchema); // this function creates a middleware,

export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors.array());
  if (errors.isEmpty()) {
    next(); //if no error then we can continue the flow
  } else {
    next(
      createHttpError(400, "Errors during book validation", {
        errorsList: errors.array(),
      })
    );
  }
};
//use / import it in the index.js wanted
