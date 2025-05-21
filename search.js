// search.js
document.addEventListener('DOMContentLoaded', () => {
    // Example data, replace with actual data from API or search results
    const searchResults = [
        { id: 1, title: 'Book Title 1', author: 'Author 1' },
        { id: 2, title: 'Book Title 2', author: 'Author 2' },
    ];

    const resultsContainer = document.getElementById('results-container');

    searchResults.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.classList.add('result-item');
        bookElement.innerHTML = `
            <div>
                <strong>${book.title}</strong> by ${book.author}
            </div>
            <button onclick="addToProfile(${book.id})">Add to Profile</button>
        `;
        resultsContainer.appendChild(bookElement);
    });
});

function addToProfile(bookId) {
    // Open a modal or prompt to select the status
    const status = prompt('Add this book to (Already Read / To Be Read / Currently Reading):');

    if (status) {
        // Simulate adding to profile (you would use a real API or localStorage)
        console.log(`Book ${bookId} added to ${status}`);
    }
}
// result.js

document.getElementById('searchButton').addEventListener('click', function() {
    let query = document.getElementById('searchInput').value;
    if (query) {
        fetch(`https://api.example.com/search?q=${query}`)
            .then(response => response.json())
            .then(data => {
                displayResults(data.books);
            })
            .catch(error => console.error('Error:', error));
    }
});

function displayResults(books) {
    let resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '';

    books.forEach(book => {
        let resultItem = document.createElement('div');
        resultItem.classList.add('result-item');
        
        resultItem.innerHTML = `
            <img src="${book.coverImage}" alt="${book.title}">
            <h2>${book.title}</h2>
            <p>${book.author}</p>
            <button onclick="addToProfile('${book.id}')">Add to Profile</button>
        `;
        
        resultsContainer.appendChild(resultItem);
    });
}

function addToProfile(bookId) {
    // Logic to handle adding the book to the profile
    console.log(`Book with ID ${bookId} added to profile.`);
}
