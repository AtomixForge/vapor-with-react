import React, { useState } from "react";
import { Button, Container, Form, Row, Stack } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";

export function NewBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("http://localhost:8080/books/", {
      method: "post",
      body: JSON.stringify({ title, author }),
      headers: { "Content-Type": "application/json" },
    }).then(() => {
      navigate("/");
    });
  };

  return (
    <>
      {/* Bootstrap container */}
      <Container>
        <Row>
          <Stack direction="horizontal" className="my-3">
            <h2>Add a new book</h2>
            {/* @ts-ignore */}
            <Button className="ms-auto" as={NavLink} to="/">
              Show all books
            </Button>
          </Stack>

          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Book</Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="Name of the book"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="Name of the author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Add
            </Button>
          </Form>
        </Row>
      </Container>
    </>
  );
}
