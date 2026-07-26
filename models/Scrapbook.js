const mongoose = require("mongoose");

const scrapbookSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    title: {
        type: String,
        required: true
    },

    pages: [
        {
            description: String,
            coverImage: String,
            frameColor: String,
            stickers: [
                {
                    id: Number,
                    emoji: String,
                    x: Number,
                    y: Number
                }
            ]
        }
    ]

}, {
    timestamps: true
});

module.exports = mongoose.model("Scrapbook", scrapbookSchema);