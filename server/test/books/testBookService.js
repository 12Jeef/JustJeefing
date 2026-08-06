import fs from "node:fs/promises";

const bytes = await fs.readFile("./test.pdf");
const file = new File([bytes], "test.pdf", {
  type: "application/pdf",
});

const form = new FormData();

form.append("title", "A Testing Book");
form.append("authors", JSON.stringify(["Author 1", "Author 2"]));
form.append("file", file);

const response = await fetch("http://127.0.0.1:3000/books/add", {
  method: "POST",
  body: form,
});

const result = await response.json();
console.log(result);
