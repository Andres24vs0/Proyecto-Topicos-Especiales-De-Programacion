import mongoose from "mongoose";
import { Counter } from "./counter.js";
const Schema = mongoose.Schema;

const earthquakesSchema = new Schema({
    _id: { type: String, required: true },
    magnitude: { type: Number, required: true },
    depth: { type: Number, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true},
});

earthquakesSchema.pre("save", async function (next) {
    if (this.isNew) {
        const counter = await Counter.findByIdAndUpdate(
            { _id: "earthquakesId" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this._id = `id:sismo_${counter.seq}`;
    }
    next();
});

const Earthquakes = mongoose.model("Earthquakes", earthquakesSchema);

export { Earthquakes };