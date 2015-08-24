var minify = require('html-minifier').minify;

var fs = require("fs");

var data = fs.readFileSync("index.html","utf-8");


var result = minify(data, {
  removeAttributeQuotes: true
});


fs.writeFile('index.min.html', result, function(err){
    if (err) throw err;
    console.log("Export Account Success!");
});