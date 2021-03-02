const { createServer } = require("http");
const { stat, createReadStream } = require("fs");
const { promisify } = require('util');
const fileName = "./bible.mp4";

const fileInfo = promisify(stat);

const server = createServer(async (req, res) => {
  const { size } = await fileInfo(fileName);
  // for range request
  const range
  res.writeHead(200, {
    "content-length": size,
    "content-Type": "video/mp4"
  });
  createReadStream(fileName).pipe(res);
}).listen(3000, () =>
  console.log(`server running on port ${server.address().port}`)
);


// stream the video only (does not work in Safari, it needs range request enabled)