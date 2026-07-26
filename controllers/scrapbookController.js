const fs = require("fs");
const path = require("path");
const Scrapbook = require("../models/Scrapbook");

const createScrapbook = async (req, res) => {

    try {
        const { user, title } = req.body;
        const pages = JSON.parse(req.body.pages);

        if (!user || !title || !pages) {
            return res.status(400).json({
                message: "Missing required fields."
            });
        }
        console.log("REQ.FILE =", req.file);

        const uploadedFiles = req.files || [];
        const imageIndexes = req.body.coverImageIndexes;

        if (uploadedFiles.length > 0) {
            const indexes = Array.isArray(imageIndexes)
                ? imageIndexes
                : [imageIndexes];
            uploadedFiles.forEach((file, i) => {
                const pageIndex = parseInt(indexes[i]);
                if (!isNaN(pageIndex) && pages[pageIndex]) {
                    pages[pageIndex].coverImage =
                        "/uploads/" + file.filename;
                }
            });
        }
        console.log("PAGES BEFORE SAVE =", pages);
        console.log("req.file:", req.file);
        console.log("pages before save:", pages);
        const scrapbook = new Scrapbook({
            user,
            title,
            pages
        });
        console.log(req.files);
        console.log(req.body.coverImageIndexes);
        console.log(pages);
        await scrapbook.save();
        console.log("SAVED =", scrapbook);
        res.status(201).json({
            message: "Scrapbook saved successfully!",
            scrapbook
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error."
        });
    }
};


const getScrapbooks = async (req, res) => {
    try {
        const { user } = req.query;
        if (!user) {
            return res.status(400).json({
                message: "User ID is required."
            });
        }
        const scrapbooks = await Scrapbook.find({ user });
        res.status(200).json(scrapbooks);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error."
        });
    }
};



const deleteScrapbook = async (req, res) => {
    try {
        const { id } = req.params;
        const scrapbook = await Scrapbook.findById(id);
        if (!scrapbook) {
            return res.status(404).json({
                message: "Scrapbook not found."
            });
        }
        scrapbook.pages.forEach(page => {
            if (page.coverImage) {
                const imagePath = path.join(
                    __dirname,
                    "..",
                    page.coverImage
                );
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }
        });
        await Scrapbook.findByIdAndDelete(id);
        res.status(200).json({
            message: "Scrapbook deleted successfully."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error."
        });
    }
};


const updateScrapbook = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const pages = JSON.parse(req.body.pages);
        const uploadedFiles = req.files || [];
        const imageIndexes = req.body.coverImageIndexes;
        if (uploadedFiles.length > 0) {
            const indexes = Array.isArray(imageIndexes)
                ? imageIndexes
                : [imageIndexes];
            uploadedFiles.forEach((file, i) => {
                const pageIndex = parseInt(indexes[i]);
                if (!isNaN(pageIndex) && pages[pageIndex]) {
                    pages[pageIndex].coverImage =
                        "/uploads/" + file.filename;
                }
            });
        }
        const scrapbook = await Scrapbook.findByIdAndUpdate(
            id,
            {
                title,
                pages
            },
            {
                new: true
            }
        );
        if (!scrapbook) {
            return res.status(404).json({
                message: "Scrapbook not found."
            });
        }
        res.status(200).json({
            message: "Scrapbook updated successfully!",
            scrapbook
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error."
        });
    }
};


module.exports = {
    createScrapbook,
    getScrapbooks,
    updateScrapbook,
    deleteScrapbook
};