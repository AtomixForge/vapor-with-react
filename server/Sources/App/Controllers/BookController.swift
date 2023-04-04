/// Copyright (c) 2022 Razeware LLC
/// 
/// Permission is hereby granted, free of charge, to any person obtaining a copy
/// of this software and associated documentation files (the "Software"), to deal
/// in the Software without restriction, including without limitation the rights
/// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
/// copies of the Software, and to permit persons to whom the Software is
/// furnished to do so, subject to the following conditions:
/// 
/// The above copyright notice and this permission notice shall be included in
/// all copies or substantial portions of the Software.
/// 
/// Notwithstanding the foregoing, you may not use, copy, modify, merge, publish,
/// distribute, sublicense, create a derivative work, and/or sell copies of the
/// Software in any work that is designed, intended, or marketed for pedagogical or
/// instructional purposes related to programming, coding, application development,
/// or information technology.  Permission for such use, copying, modification,
/// merger, publication, distribution, sublicensing, creation of derivative works,
/// or sale is expressly withheld.
/// 
/// This project and source code may use libraries or frameworks that are
/// released under various Open-Source licenses. Use of those libraries and
/// frameworks are governed by their own individual licenses.
///
/// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
/// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
/// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
/// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
/// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
/// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
/// THE SOFTWARE.

import Fluent
import Vapor

/* Collection of routes for the books API */
struct BookController: RouteCollection {
  func boot(routes: RoutesBuilder) throws {
    // Specify how to handle all the "/books/*" API calls */
    routes.group("books") { books in
      // GET "/books/"
      books.get { req in
        // Return the list of all the saved books
        return try await Book.query(on: req.db).all()
      }

      // POST "/books/
      books.post { req -> Book in
        // Decode the book data from the POST request
        let book = try req.content.decode(Book.self)
        // Save the new book in the database
        try await book.save(on: req.db)
        // Return the saved book as result
        return book
      }

      // Specify how to handle all the "/books/<bookId>" API calls
      books.group(":bookId") { book in
        // DELETE "/books/<bookId>
        book.delete { req -> HTTPStatus in
          // Extract the `Book` from "bookId"
          guard let book = try await Book.find(req.parameters.get("bookId"), on: req.db) else {
            throw Abort(.notFound)
          }
          // Delete the specified book
          try await book.delete(on: req.db)
          return .ok
        }
      }
    }
  }
}
