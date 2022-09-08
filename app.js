const express = require('express')

const {
    getTopics,
    getArticlesById,
    getUsers,
    patchVote,
    getArticles
} = require('./controllers/controllers')

const app = express()
app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/articles/:id', getArticlesById);

app.get('/api/users', getUsers);

app.patch('/api/articles/:article_id', patchVote);

app.get('/api/articles', getArticles)


app.use((err, req, res, next) => {
    const errorCodes = ['22P02']
    if (errorCodes.includes(err.code)) {
        res.status(400).send({
            msg: 'bad request'
        })
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({
            msg: err.msg
        })
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    console.log(err, '< unhandled error!')
    res.status(500).send({
        msg: 'internal server error'
    })
})



module.exports = app;