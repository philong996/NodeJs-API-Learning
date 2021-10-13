
exports.getPosts = (req, res, next) => {
    res.status(200).json({
        post: [{title: "First post", conent: "test 1"},
                {title: "Second post", content: "test 2"}]
    })
}

exports.createPost = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.title;

    console.log(title, content);
    res.status(201).json({
        message: "A Post created successfully!",
        post: {
            id: new Date().getTime(),
            title: title,
            content: content,
        }
    })
}