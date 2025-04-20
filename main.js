let books = [];
let count = 0;
let currentBookId = null;

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

        // Add a delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.innerHTML = "&#x2715;"; // X symbol
        deleteBtn.setAttribute("data-id", book._id);
        deleteBtn.addEventListener("click", function() {
            deleteBook(book._id);
        });
        bookDiv.appendChild(deleteBtn);

       // Add an edit button
        const editBtn = document.createElement("button");
        editBtn.className = "edit-btn";
        editBtn.innerHTML = "&#9998;"; // Pencil symbol
        editBtn.setAttribute("data-id", book._id);
        editBtn.addEventListener("click", function() {
            showEditForm(book);
        });
        bookDiv.appendChild(editBtn);


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

    const editFormContainer = document.getElementById('edit-form-container');
    const editBookForm = document.getElementById('edit-book-form');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');

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

    // Edit book form event listeners
    cancelEditBtn.addEventListener('click', () => {
        editFormContainer.style.display = 'none';
        editBookForm.reset();
    });

    editBookForm.addEventListener('submit', updateBook);
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

async function updateBook(event) {
    event.preventDefault();

    if (!currentBookId) {
        alert("No book selected for editing");
        return;
    }

    const formData = {
        title: document.getElementById('edit-title').value,
        author: document.getElementById('edit-author').value,
        year: document.getElementById('edit-year').value ? parseInt(document.getElementById('edit-year').value) : null,
        genre: document.getElementById('edit-genre').value,
        rating: document.getElementById('edit-rating').value ? parseInt(document.getElementById('edit-rating').value) : null,
        isRead: document.getElementById('edit-isRead').checked
    };

    try {
        const response = await fetch(`https://book-collection-api-kj0g.onrender.com/api/v1/books/${currentBookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            console.log("Book updated successfully:", result);

            // Hide form and reset
            document.getElementById('edit-form-container').style.display = 'none';
            document.getElementById('edit-book-form').reset();
            currentBookId = null;

            // Refresh book list
            getAllBooks();
        } else {
            console.error("Error updating book:", result);
            alert("Error updating book: " + (result.message || "Unknown error"));
        }
    } catch (error) {
        console.error("Error updating book:", error);
        alert("Error updating book: " + error.message);
    }
}

async function deleteBook(id) {
    if (confirm("Are you sure you want to delete this book?")) {
        try {
            const response = await fetch(`https://book-collection-api-kj0g.onrender.com/api/v1/books/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                console.log("Book deleted successfully");
                // Refresh book list after deletion
                getAllBooks();
            } else {
                const result = await response.json();
                console.error("Error deleting book:", result);
                alert("Error deleting book: " + (result.message || "Unknown error"));
            }
        } catch (error) {
            console.error("Error deleting book:", error);
            alert("Error deleting book: " + error.message);
        }
    }
}


function showEditForm(book) {
    // Set the current book ID
    currentBookId = book._id;

    // Show the edit form
    const editFormContainer = document.getElementById('edit-form-container');
    editFormContainer.style.display = 'block';

    // Set current values in the form
    document.getElementById('edit-title').value = book.title;
    document.getElementById('edit-author').value = book.author || '';
    document.getElementById('edit-year').value = book.year || '';
    document.getElementById('edit-genre').value = book.genre || '';
    document.getElementById('edit-rating').value = book.rating || '';
    document.getElementById('edit-isRead').checked = book.isRead || false;
}