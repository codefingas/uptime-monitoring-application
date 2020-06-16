const http = require('http');
const url = require('url');


const server = http.createServer((req, res) => {
    const parseUrl = url.parse(req.url, true); //parses the url

    let path = parseUrl.pathname;
    let trimmedUrl = path.replace(/^\/+|\/+$/g, '')// the empty string trims off extra slashes that the user might send along with his request
    let method = req.method.toLowerCase();

    res.end('HELLO WORLD!'); //returns hello world to client

    console.log("REQUEST RECIEVED ON " + trimmedUrl + " WITH THIS METHOD " + method);// logging the recieved path
});

server.listen(5000, console.log("SERVER IS LISTENING ON PORT 5000"));