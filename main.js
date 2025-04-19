let books = [];
let count = 0;

async function  getAllBooks(){
    console.log("getting all books");
    const response = await fetch("https://book-collection-api-kj0g.onrender.com/api/v1/books");
    const jsonResp = await response.json();

    books = jsonResp.data;
    count = jsonResp.count;
    displayBooks();
}

function displayBooks(){
   const bookListDiv =  document.getElementById("book-list");

    books.forEach(book => {
           const bookDiv = document.createElement("div");
           bookDiv.className = "book-card";

           // Title
           const h3Element = document.createElement('h3');
           h3Element.className = "book-title";
           h3Element.textContent = book.title;
           bookDiv.appendChild(h3Element);

           // Author
           const bookAuthor = document.createElement("p");
           bookAuthor.innerHTML = `<strong>Author:</strong> ${book.author || "Unknown"}`;
           bookDiv.appendChild(bookAuthor);

           // Genre
           const bookGenre = document.createElement("p");
           bookGenre.innerHTML = `<strong>Genre:</strong> ${book.genre || "Not specified"}`;
           bookDiv.appendChild(bookGenre);

           // Year
           const bookYear = document.createElement("p");
           bookYear.innerHTML = `<strong>Published:</strong> ${book.year || "Unknown year"}`;
           bookDiv.appendChild(bookYear);

           bookListDiv.appendChild(bookDiv);
    });
}

getAllBooks();
