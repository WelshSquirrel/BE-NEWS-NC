const {
    gatherTopics,
    gatherArticlesById,
    gatherUsers,
    changeVote,
    gatherArticleComments,
    gatherArticles,
    removeComments,
    gatherArticles, 
    insertComment,
    checkArticleIdExists,
    checkUserExists
} = require('../models/models')

exports.getTopics = (req, res, next) => {
    gatherTopics().then((topics) => {
            res.status(200).send({
                topics: topics
            })
        })
        .catch(next)
}

exports.getArticlesById = (req, res, next) => {
    const {
        id
    } = req.params
    gatherArticlesById(id).then((article) => {
            res.status(200).send({
                article: article
            })
        })
        .catch(next)
}

exports.getUsers = (req, res, next) => {
    gatherUsers().then((users) => {
            res.status(200).send({
                users: users
            })
        })
        .catch(next)
}

exports.patchVote = (req, res, next) => {
    const {
        article_id
    } = req.params
    const votes = req.body
    changeVote(votes, article_id).then((article) => {
            res.status(200).send({
                article: article
            })
        })
        .catch(next)
}


exports.getArticleComments = (req, res, next) => {
    const { article_id } = req.params
    gatherArticleComments(article_id).then((comments) => {
        res.status(200).send({comments: comments})
    })
    .catch(next)
}

exports.getArticles = (req, res, next) => {
    const sort_By = req.query.sort_by
    const sortOrder = req.query.order
    const topic = req.query.topic
    gatherArticles(sort_By, sortOrder, topic).then((articles) => {
        res.status(200).send({ articles })
    })
    .catch(next)
}


exports.deleteComments = (req, res, next) => {
    const { comment_id }= req.params
    removeComments(comment_id).then((result) => {
        res.status(204).send({result})
    })
    .catch(next)
}

exports.postComment = (req, res, next) => {
    const  article_id  = req.params.article_id
    const  comment  = req.body
    const username = req.body.username
    Promise.all([checkArticleIdExists(article_id), checkUserExists(username), insertComment(comment, article_id)]).then(([, , comment]) => {
        res.status(201).send({comment})
    })
    .catch(next)
}

