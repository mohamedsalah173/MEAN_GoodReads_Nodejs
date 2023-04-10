/* eslint-disable radix */
/* eslint-disable consistent-return */
/* eslint-disable no-undef */
const Book = require('../models/Book');
const checkRole = require('../middleware/checkRole');

const getAllBooks = async (req, res) => {
    const itemPerPage = 5;
    const currentPage = parseInt(req.query.page) || 1;
    try {
        const books = await Book.paginate({}, { page: currentPage, limit: itemPerPage });
        if (books.docs.length === 0) {
            return res.status(404).json({ message: 'there is no books' });
        }
        res.json({
            message: 'success',
            data: books.docs,
            pages: books.totalPages,
            currentPage: books.page,
            nextPage: books.hasNextPage ? books.nextPage : null,
            prevPage: books.hasPrevPage ? books.prevPage : null,

        });
    } catch (error) {
        res.json(error.message);
    }
};

const createBook = async (req, res) => {
    if (!checkRole.isAdmin(req)) {
        res.json({ message: 'error', error: 'you are not admin' });
    }
    const imageURL = `${req.protocol}://${req.headers.host}/bookImg/${req.file.filename}`;
    const book = await new Book({
        name: req.body.name,
        categoryId: req.body.categoryId,
        AuthorId: req.body.AuthorId,
        photo: imageURL,
    });
    book.save().then((savedBook) => {
        res.json({ message: 'success', savedBook });
    }).catch((error) => {
        res.json({ message: 'error', error });
    });
};

const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        res.json({ message: 'success', book });
    } catch (error) {
        res.json(error.message);
    }
};

const updateBookById = async (req, res) => {
    if (!checkRole.isAdmin(req)) {
        res.json({ message: 'error', error: 'you are not admin' });
    }
    try {
        const { body: { name } } = req;
        const book = await Book.findOneAndUpdate(req.params.id, { name });
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json({ message: 'succes', book });
    } catch (error) {
        res.json({ message: 'error', error });
    }
};

const deleteBookById = async (req, res) => {
    if (!checkRole.isAdmin(req)) {
        res.json({ message: 'error', error: 'you are not admin' });
    }
    const book = await Book.findByIdAndRemove(req.params.id);
    if (!book) {
        res.json({ message: 'error', error: 'Author not found' });
    } else {
        const filename = book.photo.split('/').pop();
        const path = './images/bookImg/';
        if (fs.existsSync(path + filename)) {
            console.log('file exists');
            fs.unlinkSync(path + filename);
        } else {
            console.log('file not found!');
        }
        res.json({ message: 'success', book });
    }
};
module.exports = {
    createBook,
    getAllBooks,
    getBookById,
    updateBookById,
    deleteBookById,
};
