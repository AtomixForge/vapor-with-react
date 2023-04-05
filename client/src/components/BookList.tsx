import { useState, useEffect, SetStateAction } from "react";
import { Container, Row, Stack, Button, Table } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { TableRow } from "./TableRow";

// 1
type Book = { author: string; id: string; title: string };
type BooksData = Book[];
export function BookList() {
  const [booksData, setBooksData] = useState<BooksData | null>(null);

  function loadBooks() {
    setBooksData(null);

    fetch("http://localhost:8080/books/")
      .then((response) => {
        return response.json();
      })
      .then((json: BooksData) => {
        return setBooksData(json);
      });
  }
  useEffect(() => {
    loadBooks();
  }, []);

  return (
    <Container>
      <Row>
        <Stack direction="horizontal" className="my-3">
          <h2>Book List</h2>
          {/* @ts-ignore */}
          <Button className="ms-auto" as={NavLink} to="/newbook">
            Add new book
          </Button>
        </Stack>
        <Table bordered hover>
          <thead>
            <tr>
              <th>Book Name</th>
              <th>Author</th>
            </tr>
          </thead>
          <tbody>
            {booksData &&
              booksData.map((book: Book) => {
                return <TableRow key={book.id} book={book} />;
              })}
          </tbody>
        </Table>
      </Row>
    </Container>
  );
}
// 3
