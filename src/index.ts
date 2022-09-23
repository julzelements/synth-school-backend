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

// GET 	    /device-management/devices       : Get all devices
// POST 	  /device-management/devices       : Create a new device

// GET 	   /device-management/devices/{id}   : Get the device information identified by "id"
// PUT  	 /device-management/devices/{id}   : Update the device information identified by "id"
// DELETE	 /device-management/devices/{id}   : Delete device by "id"

app.get("/patches", cors(corsOptions), async (req, res) => {
  const patches = await prisma.patch.findMany();
  console.log('GET/patches')
  res.json(patches);
});

app.post("/patches", cors(corsOptions), async (req, res) => {
  console.log('🟢')
  // console.log(req.body);
  // res.json(req.body)
});

app.listen(3001, () =>
  console.log("REST API server ready at: http://localhost:3001")
);
