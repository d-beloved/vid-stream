const { createServer } = require("http");
const { stat, createReadStream } = require("fs");
const { promisify } = require("util");
const fileName = "./bible.mp4";

const fileInfo = promisify(stat);

const returnVideo = async (req, res) => {
  const { size } = await fileInfo(fileName);
  // for range request, allowing for skip ahead or repeating already watched part
  const range = req.headers.range;
  if (range) {
    let [start, end] = range.replace(/bytes=/, "").split("-");
    start = parseInt(start, 10);
    end = end ? parseInt(end, 10) : size - 1;
    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": end - start + 1,
      "Content-Type": "video/mp4",
    });
    createReadStream(fileName, { start, end }).pipe(res);
  } else {
    res.writeHead(200, {
      "content-length": size,
      "content-Type": "video/mp4",
    });
    createReadStream(fileName).pipe(res);
  }
}

const server = createServer().listen(3000, () =>
  console.log(`server running on port ${server.address().port}`)
);

// stream the video only (does not work in Safari, it needs range request enabled)
