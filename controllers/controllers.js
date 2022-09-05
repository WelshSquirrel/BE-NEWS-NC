const { gatherTopics } = require('../models/models')

exports.getTopics = (req, res, next) => {
    gatherTopics().then((topics) => {
        res.status(200).send({topics: topics})
    })
    .catch(next)
}