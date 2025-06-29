import mongoose from "mongoose";
import { Counter } from "./counter.js";
const Schema = mongoose.Schema;

const earthquakesSchema = new Schema({
    _id: { type: String },
    magnitude: { type: Number, required: true },
    depth: { type: Number, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
});

earthquakesSchema.pre("save", function (next) {
    if (this.isNew) {
        Counter.findByIdAndUpdate(
            { _id: "earthquakesId" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        )
            .then((counter) => {
                this._id = `id:sismo_${counter.seq}`;
                next();
            })
            .catch((error) => {
                console.error("Error en el middleware pre-save:", error);
                next(error);
            });
    } else {
        next();
    }
});

const Earthquakes = mongoose.model("Earthquakes", earthquakesSchema);

export { Earthquakes };
