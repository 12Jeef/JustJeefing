import fs from "node:fs/promises";

console.log("testing adding a book");

const bytes = await fs.readFile("./test.pdf");
const file = new File([bytes], "test.pdf", {
  type: "application/pdf",
});

const form = new FormData();

form.append("title", "A Testing Book");
form.append("authors", JSON.stringify(["Author 1", "Author 2"]));
form.append("file", file);

const addResponse = await fetch("http://127.0.0.1:3000/books/add", {
  method: "POST",
  body: form,
});
const addResult = await addResponse.json();
const uuid = addResult.data.uuid;
console.log("added book", addResult);

console.log("testing removing the book");

const removeResponse = await fetch(
  `http://127.0.0.1:3000/books/remove/${uuid}`,
  {
    method: "DELETE",
  },
);
const removeResult = await removeResponse.json();
console.log("removed book", removeResult);
