let books = [];
let count = 0;

async function getAllBooks() {
    console.log("getting all books");
    const response = await fetch("https://book-collection-api-kj0g.onrender.com/api/v1/books");
    const jsonResp = await response.json();

    books = jsonResp.data;
    count = jsonResp.count;
    displayBooks();
}

function displayBooks() {
    const bookListDiv = document.getElementById("book-list");

    const heading = bookListDiv.querySelector('h1');
    bookListDiv.innerHTML = '';
    bookListDiv.appendChild(heading);

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

        // Rating
        const bookRating = document.createElement("p");
        bookRating.innerHTML = `<strong>Rating:</strong> ${book.rating ? '⭐'.repeat(book.rating) : "Not rated"}`;
        bookDiv.appendChild(bookRating);

        // Read Status
        const bookReadStatus = document.createElement("p");
        bookReadStatus.innerHTML = `<strong>Status:</strong> ${book.isRead ? "Read" : "Not read yet"}`;
        bookDiv.appendChild(bookReadStatus);

        bookListDiv.appendChild(bookDiv);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const showFormBtn = document.getElementById('show-form-btn');
    const bookFormContainer = document.getElementById('book-form-container');
    const addBookForm = document.getElementById('add-book-form');
    const cancelBtn = document.getElementById('cancel-btn');

    getAllBooks();

    showFormBtn.addEventListener('click', () => {
        bookFormContainer.style.display = 'block';
        showFormBtn.style.display = 'none';
    });

    cancelBtn.addEventListener('click', () => {
        bookFormContainer.style.display = 'none';
        showFormBtn.style.display = 'block';
        addBookForm.reset();
    });

    addBookForm.addEventListener('submit', addNewBook);
});

async function addNewBook(event) {
    event.preventDefault();

    const formData = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        year: document.getElementById('year').value ? parseInt(document.getElementById('year').value) : null,
        genre: document.getElementById('genre').value,
        rating: document.getElementById('rating').value ? parseInt(document.getElementById('rating').value) : null,
        isRead: document.getElementById('isRead').checked
    };

    try {
        const response = await fetch("https://book-collection-api-kj0g.onrender.com/api/v1/books", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            console.log("Book added successfully:", result);

            // Hide form and reset
            document.getElementById('book-form-container').style.display = 'none';
            document.getElementById('show-form-btn').style.display = 'block';
            document.getElementById('add-book-form').reset();

            // Refresh book list
            getAllBooks();
        } else {
            console.error("Error adding book:", result);
            alert("Error adding book: " + (result.message || "Unknown error"));
        }
    } catch (error) {
        console.error("Error adding book:", error);
        alert("Error adding book: " + error.message);
    }
}