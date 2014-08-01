var marked = require('marked');
var fs = require('fs');
var highlightjs = require('highlight.js');
var typogr = require('typogr');

var parts = [
  '02-controllers.md'
];

// Synchronous highlighting with highlight.js
marked.setOptions({
  highlight: function (code) {
    return highlightjs.highlightAuto(code).value;
  }
});

var buffer = fs.readFileSync('header.html', 'utf8');

parts.forEach(function(filePath) {
  var markdownString = fs.readFileSync(filePath, 'utf8');
  buffer += marked(markdownString);
});

buffer += '</body></html>';
buffer = buffer.replace(/&quot;/g, '"');
buffer = buffer.replace(/&#39;/g, '\'');

buffer = typogr(buffer).typogrify();

console.log(buffer);

