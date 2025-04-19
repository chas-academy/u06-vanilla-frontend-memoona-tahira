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
           const bookDiv =  document.createElement("div");
           const h3Element = document.createElement('h3');
           h3Element.innerHTML = book.title;
            bookDiv.appendChild(h3Element);
            const bookAuthor = document.createElement("p");
             bookAuthor.innerHTML = book.author;
             bookDiv.appendChild(bookAuthor);



           bookListDiv.appendChild(bookDiv);
    });
}

getAllBooks();
