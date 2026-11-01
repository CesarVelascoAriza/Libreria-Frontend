export interface Categoria {
  id: number;
  description: string;
}

export interface Book {
  isbn: number;
  title: string;
  subTitle: string;
  datePublication: string;
  price: number;
  categoria: Categoria | null;
  createAt?: string;
}

export type BookForm = Omit<Book, 'isbn' | 'createAt'>;
