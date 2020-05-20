import mongoose from "mongoose";
import { VotableInterface } from "./Voter";

export class VoterService<T extends mongoose.Document & VotableInterface> {

}
