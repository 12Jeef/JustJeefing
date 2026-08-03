import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

const app = express();

const PORT = 3000;

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

fs.mkdirSync(UPLOAD_DIR, {
  recursive: true,
});

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
});

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    res.status(400).json({
      error: "missing file",
    });
    return;
  }
  res.json({
    name: req.file.filename,
    size: req.file.size,
  });
});

app.get("/files", (_req, res) => {
  fs.readdir(UPLOAD_DIR, (err, files) => {
    if (err) {
      res.status(500).json({
        error: err.message,
      });
      return;
    }
    res.json(files);
  });
});

app.get("/download/:name", (req, res) => {
  const filename = path.basename(req.params.name);

  const filePath = path.join(UPLOAD_DIR, filename);

  if (!fs.existsSync(filePath)) {
    res.status(404).json({
      error: "not found",
    });

    return;
  }

  const stat = fs.statSync(filePath);

  res.writeHead(200, {
    "Content-Type": "application/octet-stream",
    "Content-Length": stat.size,
    "Content-Disposition": `attachment; filename="${filename}"`,
  });

  const stream = fs.createReadStream(filePath);

  stream.pipe(res);

  stream.on("error", (err) => {
    console.error(err);
    res.end();
  });
});

app.delete("/files/:name", (req, res) => {
  const filename = path.basename(req.params.name);

  const filePath = path.join(UPLOAD_DIR, filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      res.status(404).json({
        error: "not found",
      });
      return;
    }
    res.json({
      deleted: filename,
    });
  });
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
