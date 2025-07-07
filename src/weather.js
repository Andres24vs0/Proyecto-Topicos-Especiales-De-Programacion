import mongoose from "mongoose";
import Counter from "./counter.js";
const Schema = mongoose.Schema;

const weatherSchema = new Schema({
    _id: { type: String },
    city: { type: String, required: true },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    condition: {
        type: String,
        required: true,
        enum: ["Soleado", "Lluvioso", "Nublado", "Tormenta"],
    },
    date: { type: Date, default: Date.now },
});

weatherSchema.pre("save", function (next) {
    if (this.isNew) {
        Counter.findByIdAndUpdate(
            { _id: "weatherId" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        )
            .then((counter) => {
                this._id = `id:clima_${counter.seq}`;
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

const Weather = mongoose.model("Weather", weatherSchema);
export default Weather;

export { Weather };
