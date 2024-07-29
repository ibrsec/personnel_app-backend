const { mongoose } = require("../config/dbConnection");

const TokenSchema = new mongoose.Schema(
  {
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Personnel",
        required:true,
        index:true,
        
    },
    token: {
      type: String,
      trim: true,
      unique: true,
      index: true,
      required: true,
    },
  },
  { collection: "tokens", timestamps: true }
);


module.exports.Token = mongoose.model("Token",TokenSchema);