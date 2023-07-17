import { model, Schema } from "mongoose";

const metadataSchema = new Schema(
  {
    // _id: String,
    // artistMetadata: Schema.Types.Mixed,
    // songMetadata: Schema.Types.Mixed,
    // proofOfCreation: Schema.Types.Mixed,
    index: Schema.Types.String,
    updatedBy: Schema.Types.String,
    nftAddress: Schema.Types.String,
    tokenId: Schema.Types.String,
    metadataFileCid: Schema.Types.String,
    fullTrackContent: Schema.Types.Mixed,
    stemsContent: [Schema.Types.Mixed],
    sectionsContent: [Schema.Types.Mixed],
    ipfsCid: Schema.Types.String
  }
  // { _id: false }
);

export default model("Metadata", metadataSchema, "metadataRecords");
