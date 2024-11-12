const mongoose = require("mongoose")

const labPackageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    leads: {
        type: Number,
    },
    amount: {
        type: Number,
    },
    validity: {
        type: Number,
    },
    desc: {
        type: String,
    },
    admin: {
        type: mongoose.Types.ObjectId,
        ref: "cityAdmin"
    },
}, { timestamps: true })

module.exports = mongoose.models.labPackage || mongoose.model("labPackage", labPackageSchema)

