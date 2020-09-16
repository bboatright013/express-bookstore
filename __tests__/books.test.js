
const app = require("../app");
const db = require("../db");
const books = require("../models/book");
const request = require("supertest");

describe("books routes test", function() {
    beforeAll(() => {
        process.env.NODE_ENV = 'test';

        const bookNoISBN = {
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Lane",
                "language": "english",
                "pages": 264,
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2017
        }
      });

    beforeEach(async function () {
        await db.query("DELETE FROM books");
        let book = await books.create({
            "isbn": "1122334455",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Brandon Lane",
            "language": "english",
            "pages": 369,
            "publisher": "Georgetown University Press",
            "title": "Power-Down: Unlocking the Hidden Mathematics in Video Games",
            "year": 2012
          });
    });


    describe("POST /", function(){
        test("can add book", async function () {
            let response = await request(app)
              .post("/books")
              .send({
                "isbn": "0691161518",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Lane",
                "language": "english",
                "pages": 264,
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2017
              });
                expect(response.status).toEqual(201);
                expect(response.body).toEqual({ "book" : {
                "isbn": "0691161518",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Lane",
                "language": "english",
                "pages": 264,
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2017
                }
              });
      });
        test("expect error for invalid data", async function () {
            let response = await request(app)
              .post("/books")
              .send({
                "amazon_url": 1234,
                "author": "Matthew Lane",
                "language": "english",
                "pages": "Not a number",
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2017
        });

            expect(response.status).toEqual(400);
      })
    });

    describe("PUT /:isbn", function(){
        test("can update book", async function () {
            let response = await request(app)
              .put("/books/1122334455")
              .send({
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Lane",
                "language": "english",
                "pages": 264,
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2017
        });

            expect(response.body).toEqual({
                "book" : {
                "isbn": "1122334455",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Lane",
                "language": "english",
                "pages": 264,
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2017
                }
              });
            expect(response.status).toEqual(200);
      })
    });


    describe("GET /books", async function () {
        test("Gets a list of 1 book", async function () {
          const response = await request(app).get(`/books`);
          const books = response.body.books;
          expect(books).toHaveLength(1);
          expect(books[0]).toHaveProperty("isbn");
          expect(books[0]).toHaveProperty("amazon_url");
        });
      });

      describe("DELETE /books/:id", async function () {
        test("Deletes a single a book", async function () {
          const response = await request(app)
              .delete(`/books/1122334455`)
          expect(response.body).toEqual({message: "Book deleted"});
        });
      });

    afterAll(async function () {
        await db.end();
      });

    });
