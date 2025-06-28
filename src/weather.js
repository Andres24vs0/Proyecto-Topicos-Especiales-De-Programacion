import mongoose from "mongoose";
import { Counter } from "./counter.js";
const Schema = mongoose.Schema;

const weatherSchema = new Schema({
    _id: { type: String, required: true },
    city: { type: String, required: true },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    condition: {type: String, required: true, enum: ["Soleado", "Lluvioso", "Nublado", "Tormenta"],},
    date: { type: Date, default: Date.now },
});

weatherSchema.pre("save", async function (next) {
    if (this.isNew) {
        const counter = await Counter.findByIdAndUpdate(
            { _id: "weatherId" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this._id = `id:clima_${counter.seq}`;
    }
    next();
});

const Weather = mongoose.model("Weather", weatherSchema);

export { Weather };
