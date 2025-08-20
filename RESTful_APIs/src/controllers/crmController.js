import mongoose from "mongoose";
import { ContactSchema } from "../models/crmModel.js";

const Contact = mongoose.model("Contact", ContactSchema);

// POST controller
export const addNewContact = async (req, res) => {
  let newContact = new Contact(req.body);

  try {
    const result = await newContact.save();
    console.log(result);
  } catch (err) {
    console.error(err);
  }
};
