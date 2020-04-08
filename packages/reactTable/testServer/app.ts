const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const port = 3000;
import lo = require('lodash');
import usersData from './users';
import postsData from './posts';
import commentsData from './comments';

app.use(express.static(path.resolve(__dirname, "public")));
app.get('/', (req, res) => res.send('Hello World!'));

app.get('/api/users', (req, res) => {
    let page = req.query.page || 1;
    let limit = req.query.limit || 25;
    let result = usersData.slice(((page - 1) * limit), limit);
    res.set("x-total-count", usersData.length);
    res.json(result);
});

app.get('/api/user/:id/posts', (req, res) => {
    let userid = req.params.id;
    let posts = postsData.filter(k => k.userId == userid);
    res.set("x-total-count", posts.length);
    res.json(posts);
});
app.get('/api/posts', (req, res) => {
    let page = req.query.page || 1;
    let limit = req.query.limit || 25;
    let sourceData: any = postsData;
    if (req.query["sort.0"]) {
        let parts = req.query["sort.0"].split(",");
        sourceData = lo.orderBy(sourceData, [parts[0]], [parts[1] == 1 ? "asc" : "desc"]);
    }

    let startIndex = ((page - 1) * limit);
    let result = sourceData.slice(startIndex, startIndex + limit);
    res.set("x-total-count", sourceData.length);
    res.json(result);
});
app.get('/api/post/:id/comments', (req, res) => {
    let postid = req.params.id;
    let comments = commentsData.filter(k => k.postId == postid);
    res.set("x-total-count", comments.length);
    res.json(comments);
});

app.get(['/admin', '/admin/*'], (req, res) => {
    res.set('content-type', 'text/html');
    res.write(fs.readFileSync(__dirname + "/index.html", 'utf8'));
    res.end();
});
app.get(['/bsadmin', '/bsadmin/*'], (req, res) => {
    res.set('content-type', 'text/html');
    res.write(fs.readFileSync(__dirname + "/bootstrap.html", 'utf8'));
    res.end();
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))