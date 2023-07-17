import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { getMetadataFromCid } from "./ipfs.js";
import { ethers } from "ethers";
import Metadata from "./models/Metadata.js";
import mongoose from "mongoose";

// Required logic for integrating with Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = Number(process.env.PORT) || 8080;
const database = 'test';
const MONGODB = `mongodb+srv://${process.env.MONGODB_USR}:${process.env.MONGODB_PWD}@music-nft-indexer-mongo.epw4hdg.mongodb.net/${database}?retryWrites=true&w=majority`;

app.post('/webhook', async  (req, res) => {
  // Extract the event details from the request body
  const eventDetails = req.body;

  // Log the event details to the console
  console.log('Received event details:', eventDetails);

  //Decode log
  if (eventDetails.confirmed && eventDetails.logs.length) {
    const log = eventDetails.logs[0];
    const coder = new ethers.AbiCoder();
    const decodedParam1 = coder.decode([ 'uint256', 'address', 'address', 'uint256', 'string' ], log.data);

    const [index, contributorAddress, nftAddress, tokenId, cid] = decodedParam1;

    // Fetch metadata file from IPFS
    const metadata = await getMetadataFromCid(cid);

    if (metadata) {
      // Store in DB
      await mongoose.connect(MONGODB);
      console.log("Connected to MongoDB");
      console.log("Data", {
        nftAddress,
        cid,
        metadata: metadata.artist
      });
      try {
        await Metadata.create({...metadata, index: index.toString(), nftAddress, tokenId: tokenId.toString(), cid, updatedBy: contributorAddress});
        console.log("Data Stored on MongoDB");
      } catch(e) {
        console.log(e)
      }
    }
  }

  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Webhook server listening on port ${port}`);
});
