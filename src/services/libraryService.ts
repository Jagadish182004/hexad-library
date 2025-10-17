import { Book, BorrowRecord } from '../types/models';

// Mock data
let books: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    copies: 3,
    isbn: '9780743273565',
    publishedYear: 1925,
    category: 'Fiction'
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    copies: 2,
    isbn: '9780061120084',
    publishedYear: 1960,
    category: 'Fiction'
  }
];

let borrowRecords: BorrowRecord[] = [];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getBooks = async (): Promise<Book[]> => {
  await delay(500);
  return books.filter(book => book.copies > 0);
};

export const getInventory = async (): Promise<Book[]> => {
  await delay(500);
  return books;
};

export const addBook = async (book: Book): Promise<string> => {
  await delay(500);
  const existingBook = books.find(b => b.title.toLowerCase() === book.title.toLowerCase() && b.author.toLowerCase() === book.author.toLowerCase());
  
  if (existingBook) {
    existingBook.copies += book.copies;
    return `Book stock updated successfully! Total copies: ${existingBook.copies}`;
  } else {
    books.push(book);
    return `Book "${book.title}" added successfully!`;
  }
};

export const updateStock = async (bookId: string, newCopies: number): Promise<string> => {
  await delay(500);
  const book = books.find(b => b.id === bookId);
  if (!book) throw new Error('Book not found');
  
  if (newCopies < 0) throw new Error('Copies cannot be negative');
  
  book.copies = newCopies;
  return `Stock updated successfully! Copies: ${newCopies}`;
};

export const borrowBook = async (bookId: string, userId: string): Promise<string> => {
  await delay(500);
  const book = books.find(b => b.id === bookId);
  if (!book) throw new Error('Book not found');
  if (book.copies <= 0) throw new Error('No copies available');
  
  const existingBorrow = borrowRecords.find(record => 
    record.bookId === bookId && record.userId === userId && !record.returnDate
  );
  if (existingBorrow) throw new Error('You have already borrowed this book');
  
  book.copies--;
  
  const borrowRecord: BorrowRecord = {
    id: `borrow-${Date.now()}`,
    bookId,
    userId,
    borrowDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  };
  
  borrowRecords.push(borrowRecord);
  return `Book "${book.title}" borrowed successfully! Due date: ${borrowRecord.dueDate}`;
};

export const returnBook = async (bookId: string, userId: string): Promise<string> => {
  await delay(500);
  const book = books.find(b => b.id === bookId);
  if (!book) throw new Error('Book not found');
  
  const borrowRecord = borrowRecords.find(record => 
    record.bookId === bookId && record.userId === userId && !record.returnDate
  );
  if (!borrowRecord) throw new Error('No active borrow record found');
  
  borrowRecord.returnDate = new Date().toISOString().split('T')[0];
  book.copies++;
  
  return `Book "${book.title}" returned successfully!`;
};

export const getBorrowedBooks = async (userId: string): Promise<(Book & { dueDate: string })[]> => {
  await delay(500);
  const userBorrows = borrowRecords.filter(record => 
    record.userId === userId && !record.returnDate
  );
  
  return userBorrows.map(record => {
    const book = books.find(b => b.id === record.bookId);
    if (!book) throw new Error('Book not found');
    return { 
      ...book, 
      dueDate: record.dueDate 
    };
  });
};