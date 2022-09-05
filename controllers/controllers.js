const { gatherTopics, gatherArticles } = require('../models/models')

exports.getTopics = (req, res, next) => {
    gatherTopics().then((topics) => {
        res.status(200).send({topics: topics})
    })
    .catch(next)
}

exports.getArticles = (req, res, next) => {
    const { id } = req.params
    gatherArticles(id).then((article) => {
        res.status(200).send({article: article})
    })
    .catch(next)
}