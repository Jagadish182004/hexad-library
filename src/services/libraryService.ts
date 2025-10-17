import { Book } from '../types/models';

// Initial mock book data
let books: Book[] = [
  { id: '1', title: 'Clean Code', author: 'Robert C. Martin', copies: 3 },
  { id: '2', title: 'The Pragmatic Programmer', author: 'Andy Hunt', copies: 2 },
  { id: '3', title: 'You Don’t Know JS', author: 'Kyle Simpson', copies: 1 },
];

// Tracks borrowed books per user
let borrowedBooks: Book[] = [];

/**
 * Borrow a book if available and within user limits
 */
export const borrowBook = (bookId: string, userId: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const book = books.find(b => b.id === bookId);
    const userBorrowed = borrowedBooks.filter(b => b.borrowedBy === userId);

    if (!book) return reject('Book not found');
    if (book.copies < 1) return reject('Book not available');
    if (userBorrowed.length >= 2) return reject('Borrow limit reached');
    if (userBorrowed.some(b => b.id === bookId)) return reject('Already borrowed this book');

    // Reduce stock and add to borrowed list
    book.copies -= 1;
    borrowedBooks.push({ ...book, copies: 1, borrowedBy: userId });

    resolve('Book borrowed successfully');
  });
};

/**
 * Get books borrowed by a specific user
 */
export const getBorrowedBooks = (userId: string): Promise<Book[]> => {
  return Promise.resolve(borrowedBooks.filter(b => b.borrowedBy === userId));
};

/**
 * Return a book and update stock
 */
export const returnBook = (bookId: string, userId: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const index = borrowedBooks.findIndex(b => b.id === bookId && b.borrowedBy === userId);
    if (index === -1) return reject('Book not found in borrowed list');

    // Remove from borrowed list and update stock
    borrowedBooks.splice(index, 1);
    const bookInLibrary = books.find(b => b.id === bookId);
    if (bookInLibrary) bookInLibrary.copies += 1;

    resolve('Book returned successfully');
  });
};

/**
 * Get all available books in the library
 */
export const getBooks = (): Promise<Book[]> => {
  return Promise.resolve(books);
};

/**
 * Admin: Add a new book to the library
 */
export const addBook = (newBook: Book): Promise<string> => {
  return new Promise((resolve) => {
    books.push(newBook);
    resolve('Book added successfully');
  });
};

/**
 * Admin: Update stock for a specific book
 */
export const updateStock = (bookId: string, newCopies: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const book = books.find(b => b.id === bookId);
    if (!book) return reject('Book not found');
    book.copies = newCopies;
    resolve('Stock updated');
  });
};

/**
 * Admin: View full inventory
 */
export const getInventory = (): Promise<Book[]> => {
  return Promise.resolve(books);
};