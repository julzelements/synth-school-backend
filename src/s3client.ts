import { S3Client } from "@aws-sdk/client-s3";
import * as dotenv from "dotenv";
dotenv.config();
const region = process.env.REGION || "us-east-1";

export default new S3Client({ region });

