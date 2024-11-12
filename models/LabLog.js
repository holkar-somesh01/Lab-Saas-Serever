const mongoose = require("mongoose")

const labLogSchema = new mongoose.Schema({
    activateBy: {
        type: mongoose.Types.ObjectId,
        refPath: "activateByModal",
    },
    activateByModal: {
        type: String,
        required: true,
        enum: ["superAdmin", "cityAdmin"]
    },
    deactivateBy: {
        type: mongoose.Types.ObjectId,
        refPath: "deactivateByModal",
    },
    deactivateByModal: {
        type: String,
        required: true,
        enum: ["superAdmin", "cityAdmin"]
    },
    rechargeAmount: {
        type: Number
    },
    rechargeDate: {
        type: Date
    },
    paymenyRecipt: {
        type: String
    },
    paymenyRecipt: {
        type: String
    },
    desc: {
        type: String
    },
}, { timestamps: true })

module.exports = mongoose.models.labLog || mongoose.model("labLog", labLogSchema)

