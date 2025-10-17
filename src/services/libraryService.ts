import { Book } from '../types/models';

let books: Book[] = [
  { id: '1', title: 'Clean Code', author: 'Robert C. Martin', copies: 3 },
  { id: '2', title: 'The Pragmatic Programmer', author: 'Andy Hunt', copies: 2 },
];

export const getBooks = (): Promise<Book[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(books), 500);
  });
};