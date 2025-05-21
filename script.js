document.addEventListener("DOMContentLoaded", function() {
    const searchIcon = document.getElementById("search-icon");
    const searchBar = document.getElementById("search-bar");
    const resultsDiv = document.getElementById("results");

    searchIcon.addEventListener("click", function() {
        const query = searchBar.value.trim();
        if (query) {
            searchBooks(query);
        }
    });

    searchBar.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            const query = searchBar.value.trim();
            if (query) {
                searchBooks(query);
            }
        }
    });

    function searchBooks(query) {
        const apiKey = "AIzaSyA8P-A2GQlImK5wpMuOD6luVGw7NQv8Uv0";
        const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                // Store search results in localStorage
                localStorage.setItem('searchResults', JSON.stringify(data.items));
                displayResults(data);
            })
            .catch(error => console.error("Error fetching data:", error));
    }

    function displayResults(data) {
        resultsDiv.innerHTML = ""; // Clear previous results

        if (data.items && data.items.length > 0) {
            data.items.forEach(item => {
                const book = item.volumeInfo;
                const bookImage = book.imageLinks ? book.imageLinks.thumbnail : "images/default_book_cover.png";
                const bookTitle = book.title;
                const bookDescription = book.description ? book.description : "No description available.";
                const bookId = item.id; // Unique ID for the book

                const bookItem = document.createElement("div");
                bookItem.className = "result-item";

                bookItem.innerHTML = `
                    <img src="${bookImage}" alt="${bookTitle}" class="book-cover">
                    <div class="book-info">
                        <h3>${bookTitle}</h3>
                        <p>${bookDescription}</p>
                        <button class="add-button already-read-button" onclick="addToProfile('${bookId}', 'Already Read')">Add to Already Read</button>
                        <button class="add-button to-be-read-button" onclick="addToProfile('${bookId}', 'To Be Read')">Add to To Be Read</button>
                        <button class="add-button currently-reading-button" onclick="addToProfile('${bookId}', 'Currently Reading')">Add to Currently Reading</button>
                    </div>
                `;

                resultsDiv.appendChild(bookItem);
            });
        } else {
            resultsDiv.innerHTML = "<p>No results found.</p>";
        }
    }

    const toBeReadList = document.getElementById("to-be-read-list");
    const currentlyReadingList = document.getElementById("currently-reading-list");
    const alreadyReadList = document.getElementById("already-read-list");

    // Function to display profile books
    function displayProfileBooks() {
        const profile = JSON.parse(localStorage.getItem('profile')) || {
            'Already Read': [],
            'To Be Read': [],
            'Currently Reading': []
        };

        function createBookElement(book, colorClass) {
            const bookElement = document.createElement("div");
            bookElement.className = `book ${colorClass}`;
            bookElement.innerHTML = `
                <div class="book-details">
                    <span>${book.title}</span>
                    <span>${book.author}</span>
                </div>
                <div class="book-controls">
                    <button class="remove-book" data-id="${book.id}">-</button>
                </div>
            `;
            return bookElement;
        }

        toBeReadList.innerHTML = "";
        currentlyReadingList.innerHTML = "";
        alreadyReadList.innerHTML = "";

        profile['To Be Read'].forEach(book => {
            const bookElement = createBookElement(book, 'color1');
            toBeReadList.appendChild(bookElement);
        });

        profile['Currently Reading'].forEach(book => {
            const bookElement = createBookElement(book, 'color2');
            currentlyReadingList.appendChild(bookElement);
        });

        profile['Already Read'].forEach(book => {
            const bookElement = createBookElement(book, 'color3');
            alreadyReadList.appendChild(bookElement);
        });

        // Add event listeners to remove buttons
        document.querySelectorAll(".remove-book").forEach(button => {
            button.addEventListener("click", function() {
                removeBookFromProfile(button.dataset.id);
            });
        });
    }

    // Function to remove a book from the profile
    function removeBookFromProfile(bookId) {
        let profile = JSON.parse(localStorage.getItem('profile')) || {
            'Already Read': [],
            'To Be Read': [],
            'Currently Reading': []
        };

        ['Already Read', 'To Be Read', 'Currently Reading'].forEach(status => {
            profile[status] = profile[status].filter(book => book.id !== bookId);
        });

        localStorage.setItem('profile', JSON.stringify(profile));
        displayProfileBooks();
    }

    // Display profile books on page load
    displayProfileBooks();
});

function addToProfile(bookId, status) {
    let profile = JSON.parse(localStorage.getItem('profile')) || {
        'Already Read': [],
        'To Be Read': [],
        'Currently Reading': []
    };

    let books = JSON.parse(localStorage.getItem('searchResults')) || [];
    let book = books.find(b => b.id === bookId);

    if (book) {
        let bookInfo = {
            id: book.id,
            title: book.volumeInfo.title,
            author: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : "Unknown",
            genre: book.volumeInfo.categories ? book.volumeInfo.categories.join(', ') : "Unknown",
            coverImage: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : "images/default_book_cover.png"
        };

        // Ensure the book is not added multiple times
        if (!profile[status].some(b => b.id === bookId)) {
            profile[status].push(bookInfo);
            localStorage.setItem('profile', JSON.stringify(profile));
            alert(`Book added to ${status}`);
        } else {
            alert(`Book is already in ${status}`);
        }
    } else {
        alert('Book not found.');
    }
}
