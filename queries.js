/***************************************
 * Task 2: Basic CRUD Operations
 ***************************************/
// Find all books in a specific genre (example: Fiction)
db.books.find({ genre: "Fiction" });

// Find books published after a certain year (example: after 2000)
db.books.find({ published_year: { $gt: 2000 } });

// Find books by a specific author (example: George Orwell)
db.books.find({ author: "George Orwell" });

// Update the price of a specific book (example: set new price for "1984")
db.books.updateOne({ title: "1984" }, { $set: { price: 9.99 } });

// Delete a book by its title (example: delete "The Da Vinci Code")
db.books.deleteOne({ title: "The Da Vinci Code" });


/***************************************
 * Task 3: Advanced Queries
 ***************************************/
// Define pagination variables
const booksPerPage = 5;
const page = 1;  // Change this value for different pages

// Query: Find books that are both in stock and published after 2010
// Projection: return only title, author, and price (exclude _id)
// Sort by price in ascending order
db.books.find(
    { in_stock: true, published_year: { $gt: 2010 } },
    { title: 1, author: 1, price: 1, _id: 0 }
)
.sort({ price: 1 })
.skip((page - 1) * booksPerPage)
.limit(booksPerPage);

// Same query, but sort by price in descending order
db.books.find(
    { in_stock: true, published_year: { $gt: 2010 } },
    { title: 1, author: 1, price: 1, _id: 0 }
)
.sort({ price: -1 })
.skip((page - 1) * booksPerPage)
.limit(booksPerPage);


/***************************************
 * Task 4: Aggregation Pipeline
 ***************************************/
// 1. Calculate the average price of books by genre
db.books.aggregate([
    { 
        $group: { 
            _id: "$genre", 
            averagePrice: { $avg: "$price" }
        }
    }
]);

// 2. Find the author with the most books in the collection
db.books.aggregate([
    { 
        $group: { 
            _id: "$author", 
            bookCount: { $sum: 1 }
        }
    },
    { $sort: { bookCount: -1 } },
    { $limit: 1 }
]);

// 3. Group books by publication decade and count them
db.books.aggregate([
    { 
        $group: { 
            _id: { 
                $subtract: [ "$published_year", { $mod: [ "$published_year", 10 ] } ]
            }, 
            count: { $sum: 1 } 
        }
    },
    { $sort: { _id: 1 } }
]);


/***************************************
 * Task 5: Indexing
 ***************************************/
// Create an index on the title field for faster searches
db.books.createIndex({ title: 1 });

// Create a compound index on author and published_year
db.books.createIndex({ author: 1, published_year: 1 });

// Use explain() to check performance using the title index
db.books.find({ title: "1984" }).explain("executionStats");

// Use explain() to check performance using the compound index
db.books.find({ author: "George Orwell", published_year: 1949 }).explain("executionStats");