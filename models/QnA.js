const mongoose = require("mongoose")

const qnaSchema = new mongoose.Schema({
    question: {
        type: String,
        ref: "customer",
    },
    answer: {
        type: String,
        ref: "customer",
    },
    package: {
        type: mongoose.Types.ObjectId,
        ref: "customerPackage",
    },


}, { timestamps: true })

module.exports = mongoose.models.qna || mongoose.model("qna", qnaSchema)

