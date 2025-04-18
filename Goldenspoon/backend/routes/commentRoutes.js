const express = require('express');
const { getCommentsByProduct, createComment, updateComment, deleteComment } = require('../controllers/commentController');
const router = express.Router();

// Route to get comments by product using query parameter
router.get('/', getCommentsByProduct);

// Route to create a new comment
router.post('/', createComment);

// Route to update a comment
router.put('/:id', updateComment);

// Route to delete a comment
router.delete('/:id', deleteComment);

module.exports = router;
