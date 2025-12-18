const Joi = require("joi");

// CREATE ARTICLE
const createArticleSchema = Joi.object({
  title: Joi.string().min(5).required(),
  content: Joi.string().min(20).required(),
  subheading: Joi.string().optional(),
});

// UPDATE ARTICLE
const updateArticleSchema = Joi.object({
  title: Joi.string().min(5).optional(),
  content: Joi.string().min(20).optional(),
  subheading: Joi.string().optional(),
});

// COMMENT / REPLY
const commentSchema = Joi.object({
  username: Joi.string().min(2).required(),
  message: Joi.string().min(1).required(),
});

// EDIT COMMENT
const editCommentSchema = Joi.object({
  message: Joi.string().min(1).required(),
});

module.exports = {
  createArticleSchema,
  updateArticleSchema,
  commentSchema,
  editCommentSchema,
};