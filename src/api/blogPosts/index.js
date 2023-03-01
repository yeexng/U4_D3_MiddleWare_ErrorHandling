import Express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { checkBlogPostSchema, triggerBadRequest } from "./validation.js"; //=> this will sometimes failed in auto-complete, make sure to check and ad .js

const blogPostsRouter = Express.Router();
const blogPostsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "blogPosts.json"
);
const getBlogPosts = () => JSON.parse(fs.readFileSync(blogPostsJSONPath));
const writeBlogPosts = (blogPostsArray) =>
  fs.writeFileSync(blogPostsJSONPath, JSON.stringify(blogPostsArray));

blogPostsRouter.post(
  "/",
  checkBlogPostSchema,
  triggerBadRequest,
  (req, res, next) => {
    const newBlogPost = {
      ...req.body,
      id: uniqid(),
      avatar: `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const blogPostsArray = getBlogPosts();
    blogPostsArray.push(newBlogPost);
    writeBlogPosts(blogPostsArray);
    res.status(201).send({ id: newBlogPost.id });
  }
);

blogPostsRouter.get("/", (req, res, next) => {
  const blogPosts = getBlogPosts();
  if (req.query && req.query.category) {
    const filteredBlogPosts = blogPosts.filter(
      (b) => b.category === req.query.category
    );
    res.send(filteredBlogPosts);
  } else {
    res.send(blogPosts);
  }
});

blogPostsRouter.get("/:blogPostId", (req, res, next) => {
  try {
    const blogPostsArray = getBlogPosts();
    const foundBlogPosts = blogPostsArray.find(
      (b) => b.id === req.params.blogPostId
    ); //refer to the router
    if (foundBlogPosts) {
      res.send(foundBlogPosts);
    } else {
      next(
        createHttpError(404, `Blog with id ${req.params.bookId} not found!`)
      );
    }
  } catch (error) {
    console.log(error);
    next(error); //
  }
});

blogPostsRouter.put("/:blogPostId", (req, res, next) => {
  try {
    const blogPostsArray = getBlogPosts();
    const index = blogPostsArray.findIndex(
      (b) => b.id === req.params.blogPostId
    );
    if (index !== -1) {
      const oldPost = blogPostsArray[index];
      const updatedPost = { ...oldPost, ...req.body, updatedAt: new Date() };
      blogPostsArray[index] = updatedPost;
      writeBlogPosts(blogPostsArray);
      res.send(updatedPost);
    } else {
      next(
        createHttpError(404, `Blog with id ${req.params.bookId} not found!`)
      );
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

blogPostsRouter.delete("/:blogPostId", (req, res, next) => {
  try {
    const blogPostsArray = getBlogPosts();
    const remainingPosts = blogPostsArray.filter(
      (b) => b.id !== req.params.blogPostId
    );
    if (blogPostsArray.length !== remainingPosts.length) {
      writeBlogPosts(remainingPosts);
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `Book with id ${req.params.bookId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default blogPostsRouter;
