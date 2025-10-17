export interface Book {
  id: string;
  title: string;
  author: string;
  copies: number;
  isbn?: string;
  publishedYear?: number;
  category?: string;
  dueDate?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}

export interface BorrowRecord {
  id: string;
  bookId: string;
  userId: string;
  borrowDate: string;
  returnDate?: string;
  dueDate: string;
}