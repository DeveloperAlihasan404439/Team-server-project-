const express =require('express');
const { getReviws, deleteReviews, postReviews } = require('../controller/ReviewsController');
const { getUserController, getSingleUser, postUser, putUser, putProfileUpdated } = require('../controller/UsersController');
// const { getArticles, getSingleArticle, putArticleUpdated, patchArticleRejecte, patchArticleConfirm, patchArticleLikeIncrement, deleteArticle, postArticle } = require('../controller/Articles');
const { getNotes, patchNotes, deleteNotes, postNotes } = require('../controller/NotesConrrollers');
const { getBlogs } = require('../controller/BlogsControllers');
const { getComment, postComment } = require('../controller/CommentControllers');
const { GetPaymentMethod, GetPayment, postPayment, PostPaymentIntents } = require('../controller/pymentConttollrs');
const { getArticles, getSingleArticle, putArticleUpdated, patchArticleRejecte, patchArticleConfirm, patchArticleLikeIncrement, deleteArticle, postArticle } = require('../controller/ArticlesController');



const router =express.Router();

// subject

// Reviews Manage Api Router
router.get("/review",getReviws );
router.delete("/review",deleteReviews );
router.post("/review",postReviews );

// Users Manage Api Router
router.get('/users/single', getSingleUser)
router.get('/users', getUserController)
router.post('/users/post', postUser)
router.put('/user/update', putUser)
router.put('/user/profile/updated', putProfileUpdated)


// Article Manage Api Router
router.get('/article', getArticles)
router.get('/article/:id', getSingleArticle)
router.put('/article/:id', putArticleUpdated)
router.patch('/article/rejecte/:id', patchArticleRejecte)
router.patch('/article/confirm/:id', patchArticleConfirm)
router.patch('/article/like', patchArticleLikeIncrement)
router.delete('/article', deleteArticle)
router.post('/article', postArticle)
router.post('/article/user', postArticle)


// notes Manage Api Router
router.get('/notes', getNotes)
router.delete('/notes', deleteNotes)
router.post('/notes', postNotes)
router.patch('/notes/update/:id', patchNotes)

// blogs Manage Api Router
router.get('/blog', getBlogs)

// blogs Manage Api Router
router.get('/comment/:id', getComment)
router.post('/comment', postComment)


// payment Manage Api Router
router.get('/payments', GetPaymentMethod)
router.get('/payments/:email', GetPayment)
router.post('/create-payment-intent', PostPaymentIntents)
router.post('/payments', postPayment)

module.exports=router;






































module.exports=router;