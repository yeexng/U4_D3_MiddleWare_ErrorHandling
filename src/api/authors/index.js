import Express from "express";
import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import uniqid from "uniqid";

const authorsRouter = Express.Router();

//in local path
// console.log(import.meta.url);
// console.log(fileURLToPath(import.meta.url));
// console.log(dirname(fileURLToPath(import.meta.url))); //completed path
const authorsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "authors.json"
); //use join not +, make sure the braces placement
console.log("TARGET:", authorsJSONPath);

//for different methods
authorsRouter.post("/", (req, res) => {
  console.log("Request body", req.body);
  //adding object to the array
  const newAuthors = {
    ...req.body,
    id: uniqid(),
  };

  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
  //   const emailExisted = ;

  if (authorsArray.some((author) => author.email === req.body.email)) {
    res.send("Email existed, please change a new one");
  } else {
    authorsArray.push(newAuthors);
    fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray));
    res.status(201).send({ id: newAuthors.id });
  }
});

authorsRouter.get("/", (req, res) => {
  const fileContent = fs.readFileSync(authorsJSONPath);
  console.log("FILE CONTENT:", fileContent); // return random numbers
  console.log("FILE CONTENT:", JSON.parse(fileContent));
  const authorsArray = JSON.parse(fileContent);
  res.send(authorsArray);
});

authorsRouter.get("/:authorId", (req, res) => {
  //obtain ID
  //   console.log("USER ID:", req.params.authorId);
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
  const author = authorsArray.find(
    (author) => author.id === req.params.authorId
  );

  res.send(author);
});

authorsRouter.put("/:authorId", (req, res) => {
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));

  const index = authorsArray.findIndex(
    (author) => author.id === req.params.authorId
  );
  const oldAuthor = authorsArray[index];
  const updatedAuthor = { ...oldAuthor, ...req.body, updatedAt: new Date() };
  authorsArray[index] = updatedAuthor;
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray));

  res.send(updatedAuthor);
});

authorsRouter.delete("/:authorId", (req, res) => {
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
  const remainingAuthors = authorsArray.filter(
    (author) => author.id !== req.params.authorId
  );

  fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors));
  res.status(204).send();
});

export default authorsRouter;
