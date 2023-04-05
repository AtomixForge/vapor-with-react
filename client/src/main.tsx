import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css"; // Allows you to use ReactRoute components inside this file
import { HashRouter, Routes, Route } from "react-router-dom";
import { BookList } from "./components/BookList";
import { NewBook } from "./components/NewBook";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {/* 1 */}
    <HashRouter>
      {/* 2 */}
      <Routes>
        {/* 3 */}
        <Route path="/" element={<BookList />} />
        <Route path="/newbook" element={<NewBook />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
