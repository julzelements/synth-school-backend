import { PrismaClient } from "@prisma/client";
import express from "express";
import cors, { CorsOptions } from "cors";

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

app.get("/patches", async (req, res) => {
  const patches = await prisma.patch.findMany();
  console.log("GET/patches");
  res.json(patches);
});

app.get("/patches/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const patches = await prisma.patch.findFirst({
    where: {
      id,
    },
  });
  console.log(`GET/patches/${id}`);
  res.json(patches);
});

app.post("/patches", async (req, res) => {
  const patch = await prisma.patch.create({
    data: {
      name: req.body.name,
    },
  });
  res.json(patch);
});

app.get("patches/");

app.listen(3001, () =>
  console.log("REST API server ready at: http://localhost:3001")
);
