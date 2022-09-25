import * as dotenv from "dotenv";
dotenv.config();
import { PrismaClient } from "@prisma/client";
import express from "express";
import cors, { CorsOptions } from "cors";
import multer from "multer";
import { saveAudioToS3 } from "./buckets";
import { createReadStream, PathLike } from "fs";

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    console.log(file.originalname);
    cb(null, file.originalname);
  },
  destination: function (req, file, cb) {
    console.log("storage");
    cb(null, "./uploads");
  },
});
const upload = multer({ storage });
const prisma = new PrismaClient();
const app = express();

const corsOptions: CorsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));

// TODO: PUT  	 /patches/{id}   : Update the patch information identified by "id"
// TODO: DELETE	 /patches/{id}   : Delete patch by "id"

app.post("/audio", upload.single("blob"), async (req, res) => {
  console.log(req.file);
  const key = `${Date.now()}_${req.file?.originalname}`;

  const path = req?.file?.path;
  if (!path) {
    res.status(500).send({
      message: "path not created",
    });
  }

  const buffer = createReadStream(path || "");
  if (!buffer) {
    res.status(500).send({
      message: "buffer not created",
    });
  }

  const awsResponse = await saveAudioToS3(key, buffer);

  if (awsResponse.$metadata.httpStatusCode !== 200) {
    res.status(500).send({
      message: "aws upload failed",
    });
  }

  const objectURL = `https://brisbane-synth-school-audio.s3.amazonaws.com/${key}`;

  res.status(200).send({
    message: `Uploaded: ${objectURL}`,
  });
});

app.get("/patches", async (req, res) => {
  const patches = await prisma.patch.findMany();
  console.log("GET/patches");
  res.status(200).json(patches);
});

app.get("/patches/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const patches = await prisma.patch.findFirst({
    where: {
      id,
    },
  });
  console.log(`GET/patches/${id}`);
  res.status(200).json(patches);
});

app.post("/patches", async (req, res) => {
  const patch = await prisma.patch.create({
    data: {
      name: req.body.name,
    },
  });
  res.status(200).json(patch);
});

app.listen(3001, () =>
  console.log("REST API server ready at: http://localhost:3001")
);
