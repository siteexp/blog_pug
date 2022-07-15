const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('markdown-it');
const matter = require('gray-matter');
const fs = require('fs');

const app = express();
//const md = require("marked");

//ALL Blog posts



// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// body parse middleware application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//set public folder
app.use(express.static(path.join(__dirname, 'public')));

app.get("/blog/:article", (req, res) => {

  // read the markdown file
  const file = matter.read(__dirname + '/blog/' + req.params.article + '.md');

  // use markdown-it to convert content to HTML
  var md = require("markdown-it")();
  let content = file.content;
  var result = md.render(content);
  
  res.render("blog", {
    post: result,
    title: file.data.title,
    summary: file.data.description,
    img: file.data.image
  });
});




app.get("/", (req, res) => {
  const blogposts = fs.readdirSync(__dirname + '/blog').filter(file => file.endsWith('.md'));
  const posts = blogposts.map((fileName) => {
    const slug = fileName.replace('.md', '');
    const readFile = fs.readFileSync(`blog/${fileName}`, 'utf-8');
    const { data: frontmatter } = matter(readFile);
    return {
      slug,
      frontmatter,
    };
  })
  console.log(posts);
   res.render("index", {
     title: "Home" ,
     posts: posts
   });

});


app.listen('3000', () => {
    console.log('Server Started on port 3000');
});
