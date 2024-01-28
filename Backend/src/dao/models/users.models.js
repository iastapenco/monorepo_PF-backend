import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const userSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
    index: true,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    default: "user",
  },
  cart: {
    type: Schema.Types.ObjectId,
    ref: "carts",
  },
  user_premium: {
    type: Boolean,
    default: false,
  },
  documents: {
    type: [
      {
        name_doc: {
          type: String,
        },
        reference: {
          type: String,
        },
      },
    ],
  },
  last_connection: {
    type: Date,
  },
});

userSchema.plugin(paginate);

export const userModel = model("users", userSchema);
