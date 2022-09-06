const {
    gatherTopics,
    gatherArticlesById,
    gatherUsers,
    changeVote,
    gatherArticles
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
    const { article_id } = req.params
    const votes = req.body
    changeVote(votes, article_id).then((article) => {
            res.status(200).send({
                article: article
            })
        })
        .catch(next)
}

exports.getArticles = (req, res, next) => {
    const sort_By = req.query.sort_by
    const sortOrder = req.query.order
    const topic = req.query.topic
    gatherArticles(sort_By, sortOrder, topic).then((articles) => {
        res.status(200).send({articles})
    })
    .catch(next)
}