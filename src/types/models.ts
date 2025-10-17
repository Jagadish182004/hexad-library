export interface Book {
  id: string;
  title: string;
  author: string;
  copies: number;
}
export interface Book {
  id: string;
  title: string;
  author: string;
  copies: number;
  borrowedBy?: string; // optional field to track who borrowed it
}