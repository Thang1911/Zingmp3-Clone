const sql = require("mssql");
var config = require("./connect");



async function getBooks() {
  try {
    let pool = await sql.connect(config);
    let books = await pool.request().query("SELECT * FROM books");
    return books.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getBook(bookId) {
  try {
    let pool = await sql.connect(config);
    let book = await pool
      .request()
      .input("input_parameter", sql.Int, bookId)
      .query("SELECT * from books WHERE id = @input_parameter");
    return book.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function addBook(book) {
  try {
    let pool = await sql.connect(config);
    let insertBook = await pool
      .request()
      .input("id", sql.Int, book.id)
      .input("title", sql.NVarChar, book.title)
      .input("desc", sql.Int, book.desc)
      .input("cover", sql.NVarChar, book.cover)
      .execute("InsertBooks");
    return insertBook.recordsets;
  } catch (err) {
    console.log(err);
  }
}

async function getUsers() {
  try {
    let pool = await sql.connect(config);
    let users = await pool.request().query("SELECT * FROM users");
    return users.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getUser(email, pass) {
  try {
    let pool = await sql.connect(config);
    const query =
      "SELECT * FROM users WHERE email = @email AND password = @pass";
    const result = await pool
      .request()
      .input("email", sql.NVarChar, email)
      .input("pass", sql.NVarChar, pass)
      .query(query);
    return result.recordset;
  } catch (error) {
    console.log(error);
  }
}

async function addUser(user) {
  try {
    let pool = await sql.connect(config);
    const query = `
      INSERT INTO users (name, password, email, role)
      VALUES (@name, @password, @email, @role)
    `;
    let insertUser = await pool
      .request()
      .input("name", sql.NVarChar, user.name)
      .input("password", sql.NVarChar, user.password)
      .input("email", sql.NVarChar, user.email)
      .input("role", sql.NVarChar, user.role)
      .query(query);
    return insertUser.recordsets;
  } catch (err) {
    console.log(err);
  }
}



module.exports = {
  // getBooks: getBooks,
  // getBook: getBook,
  // addBook: addBook,
  // getUsers: getUsers,
  // getUser: getUser,
  // addUser: addUser,
  // addPlaylist: addPlaylist
};
