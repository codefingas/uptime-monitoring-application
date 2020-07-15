const http = require("http");
const url = require("url");
const { stat } = require("fs");
const StringDecoder = require("string_decoder").StringDecoder;

const server = http.createServer((req, res) => {
  const parseUrl = url.parse(req.url, true); //parses the url

  let path = parseUrl.pathname;
  let trimmedUrl = path.replace(/^\/+|\/+$/g, ""); // the empty string trims off extra slashes that the user might send along with his request
  let method = req.method.toLowerCase();
  let queryStringObject = parseUrl.query;

  //get the headers as an object
  let headers = req.headers;

  //parsing the payloads
  let decoder = new StringDecoder("utf-8");
  let buffer = "";

  req.on("data", (data) => (buffer += decoder.write(data)));
  req.on("end", () => {
    buffer += decoder.end();

    let handler = {};

    handler.sample = (data, callback) => {
      callback(406, { name: "sample router" });
    };

    handler.notFound = (data, callback) => {
      callback(404);
    };

    const router = {
      sample: handler.sample,
    };
    const chosenRoute =
      typeof router[trimmedUrl] !== "undefined"
        ? router[trimmedUrl]
        : handler.notFound;

    let data = {
      trimmedUrl,
      payload: buffer,
      headers,
      queryStringObject,
      method,
    };

    chosenRoute(data, (statusCode, payload) => {
      statusCode = typeof statusCode === "number" ? statusCode : 200;

      payload = typeof payload === "object" ? payload : {};

      //convert payload to string
      let payloadString = JSON.stringify(payload);

      res.setHeader('Content-type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      console.log(
        "the status code and payload string",
        statusCode,
        payloadString
      );
    });
  });
});

server.listen(5000, console.log("SERVER IS LISTENING ON PORT 5000"));
