import React from "react";

type Book = {
  author: string;
  id: string;
  title: string;
};

export function TableRow({ book }: { book: Book }) {
  const { title, author } = book;
  return (
    <tr>
      <td>{title}</td>
      <td>{author}</td>
    </tr>
  );
}
