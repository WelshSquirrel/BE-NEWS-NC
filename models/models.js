const db = require('../db/connection');

exports.gatherTopics = () => {
    return db.query('SELECT * FROM topics').then((result) => {
        return result.rows;
    })
}

exports.gatherArticlesById = (id) => {
    return db.query(`SELECT articles.*,
     COUNT(comments.article_id)::int AS comment_count 
     FROM articles 
     LEFT JOIN comments ON comments.article_id = articles.article_id 
     WHERE articles.article_id = $1 
     GROUP BY articles.article_id`, [id])
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


exports.gatherArticleComments = (article_id) => {
    return db.query(`SELECT comments.*, articles.article_id 
    FROM articles 
    LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1`, [article_id])
        .then((result) => {
            if (result.rowCount === 0) {
                return Promise.reject({
                    status: 404,
                    msg: 'Route not found'
                })
            } else {
                return result.rows.filter(x => x.comment_id)
            }
        })
}

exports.gatherArticles = (sort_by = 'created_at', sortOrder = 'DESC', topic) => {

    const validRows = ['article_id', 'title', 'topic', 'author', 'body', 'created_at', 'votes', 'comment_count'];
    if (!validRows.includes(sort_by)) {
        return Promise.reject({
            status: 400,
            msg: 'bad request'
        })
    }
    const validOrders = ['asc', 'desc', 'ASC', 'DESC']
    if (!validOrders.includes(sortOrder)) {
        return Promise.reject({
            status: 400,
            msg: 'bad request'
        })
    }

    let queryStr = `SELECT articles.*, COUNT(comments.article_id)::int AS comment_count
    FROM articles 
    LEFT JOIN comments ON comments.article_id = articles.article_id`

    let queryValues = []
    if (topic) {
        queryStr += ` WHERE articles.topic = $1`
        queryValues.push(topic)
    }

    queryStr += ` GROUP BY articles.article_id
    ORDER BY ${sort_by} ${sortOrder}`

    return db.query(queryStr, queryValues)
        .then(({
            rows: articleRows,
            rowCount
        }) => {
            const noArticlesReturned = rowCount === 0
            if (noArticlesReturned) {
                return db.query(`SELECT * FROM topics WHERE slug = $1`, [topic])
                    .then((result) => {
                        if (result.rowCount === 0) {
                            return Promise.reject({
                                status: 404,
                                msg: `${topic} not found`
                            })
                        } else {
                            return Promise.all([articleRows, {
                                rowCount: 0
                            }]);
                        }
                    })
            } else {
                return Promise.all([articleRows, undefined]);
            }
        })
        .then(([articleRows, result]) => {
            if (result !== undefined) {
                const topicExists = result.rowCount > 0;
                if (topicExists) {
                    return articleRows;
                } else {
                    return Promise.reject({
                        status: 200,
                        msg: []
                    })
                }
            } else {
                return articleRows;
            }
        })
};

exports.removeComments = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [comment_id]).then((result) => {
            if(result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'comment not found'})
            }
    })
}

exports.insertComment = ( comment, article_id) => {
    const { body, username } = comment
    return db.query(`INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *`, [body, username, article_id]).then((result) => {
        return result.rows[0]
    })
}

exports.checkArticleIdExists = (id) => {
    return db
      .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
      .then((result) => {
        if (!result.rows.length) {
          return Promise.reject({ status: 404, msg: "article not found" });
        }
      });
};

exports.checkUserExists = (username) => {
    return db
      .query(`SELECT * FROM articles WHERE author = $1`, [username])
      .then((result) => {
        if (!result.rows.length) {
          return Promise.reject({ status: 404, msg: "user not found" });
        }
      });
  };

