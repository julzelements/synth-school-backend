import * as dotenv from "dotenv";
dotenv.config();
import s3 from "./s3client";
import { PutObjectCommand, PutObjectCommandOutput } from "@aws-sdk/client-s3";
import { ReadStream } from "fs";

const bucket = process.env.AUDIO_BUCKET;

export const saveAudioToS3 = (
  key: string,
  body: ReadStream
): Promise<PutObjectCommandOutput> => {
  const putObject = new PutObjectCommand({
    Body: body,
    Bucket: bucket,
    Key: key,
  });
  return s3.send(putObject);
};
