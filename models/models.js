const db = require('../db/connection');

exports.gatherTopics = () => {
    return db.query('SELECT * FROM topics').then((result) => {
        return result.rows;
    })
}

exports.gatherArticles = (id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [id])
    .then((result) => {
        if(result.rows.length === 0) {
            return Promise.reject({ status: 402, msg: 'article ID not found'})
        } else {
        return result.rows[0];
        }
    })
}


