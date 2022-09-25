import { PrismaClient } from "@prisma/client";
import express from "express";
import cors, { CorsOptions } from "cors";
import multer from "multer";

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    console.log("filename");
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
// app.post("/audio", async (req, res) => {
  console.log(req);
  console.log(req.body);
  console.log(req.file);
  res.status(200).send({ message: "Successfully uploaded files" });
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
