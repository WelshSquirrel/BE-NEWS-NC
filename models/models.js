const db = require('../db/connection');

exports.gatherTopics = () => {
    return db.query('SELECT * FROM topics').then((result) => {
        return result.rows;
    })
}

exports.gatherArticles = (id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1;', [id])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: 'article ID not found'
                })
            } else {
                return result.rows[0];
            }
        })
}

exports.gatherUsers = () => {
    return db.query(`SELECT * FROM users;`).then((result) => {
        return result.rows
    })
}

exports.changeVote = (votes, id) => {
    const voteChange = votes.inc_votes;
    const newId = id;
    if (voteChange === undefined) {
        return Promise.reject({
            status: 400,
            msg: 'bad request'
        })
    }
    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`, [voteChange, newId]).then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({
                status: 404,
                msg: 'article ID not found'
            })
        } else {
            return result.rows[0]
        }
    })
}