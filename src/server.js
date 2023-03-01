import Express from "express"; //add to package.json
import listEndpoints from "express-list-endpoints";
import authorsRouter from "./api/authors/index.js"; //remember to add index.js
import blogPostsRouter from "./api/blogPosts/index.js";
import {
  badRequestHandler,
  genericErrorHandler,
  notfoundHandler,
  unauthorizedHandler,
} from "./errorsHandler.js";
import cors from "cors";

const server = Express();
const port = 3009;
server.use(cors());
server.use(Express.json()); // if don't add all req body will be undefined

server.use("/authors", authorsRouter); //here will be adding the middle-part of the url
server.use("/blogPosts", blogPostsRouter);

//Error needs to be imported after all the endpoints... the arrangement is important...
server.use(badRequestHandler); //400
server.use(unauthorizedHandler); // 401
server.use(notfoundHandler); // 404
server.use(genericErrorHandler); // 500 (this should ALWAYS be the last one)

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`Server On port ${port}`);
});
