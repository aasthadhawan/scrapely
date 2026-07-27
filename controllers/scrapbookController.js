const cloudinary = require("../config/cloudinary");
const Scrapbook = require("../models/Scrapbook");


// =============================
// CREATE SCRAPBOOK
// =============================
const createScrapbook = async (req, res) => {
    try {
        const { user, title } = req.body;
        const pages = JSON.parse(req.body.pages);

        if (!user || !title || !pages) {
            return res.status(400).json({
                message: "Missing required fields."
            });
        }

        const uploadedFiles = req.files || [];
        const imageIndexes = req.body.coverImageIndexes;

        if (uploadedFiles.length > 0) {
            const indexes = Array.isArray(imageIndexes)
                ? imageIndexes
                : [imageIndexes];
            uploadedFiles.forEach((file, i) => {
                const pageIndex = parseInt(indexes[i]);
                if (!isNaN(pageIndex) && pages[pageIndex]) {
                    pages[pageIndex].coverImage = file.path;
                }
            });
        }
        const scrapbook = new Scrapbook({
            user,
            title,
            pages
        });
        await scrapbook.save();
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


// =============================
// GET SCRAPBOOK
// =============================
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


// =============================
// DELETE SCRAPBOOK
// =============================
const deleteScrapbook = async (req, res) => {
    try {
        const { id } = req.params;
        const scrapbook = await Scrapbook.findById(id);
        if (!scrapbook) {
            return res.status(404).json({
                message: "Scrapbook not found."
            });
        }
        for (const page of scrapbook.pages) {
            if (page.coverImage) {
                const publicId = page.coverImage
                    .split("/")
                    .slice(-2)
                    .join("/")
                    .split(".")[0];

                await cloudinary.uploader.destroy(publicId);
            }
        }
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


// =============================
// UPDATE SCRAPBOOK
// =============================
const updateScrapbook = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const pages = JSON.parse(req.body.pages);
        const existingScrapbook = await Scrapbook.findById(id);
        if (!existingScrapbook) {
            return res.status(404).json({
                message: "Scrapbook not found."
            });
        }
        const uploadedFiles = req.files || [];
        const imageIndexes = req.body.coverImageIndexes;
        if (uploadedFiles.length > 0) {
            const indexes = Array.isArray(imageIndexes)
                ? imageIndexes
                : [imageIndexes];
            uploadedFiles.forEach((file, i) => {
                const pageIndex = parseInt(indexes[i]);
                if (!isNaN(pageIndex) && pages[pageIndex]) {
                    pages[pageIndex].coverImage = file.path;
                }
            });
        }
        const oldImages = existingScrapbook.pages
            .map(page => page.coverImage)
            .filter(Boolean);
        const newImages = pages
            .map(page => page.coverImage)
            .filter(Boolean);
        const deletedImages = oldImages.filter(
            image => !newImages.includes(image)
        );
        for (const image of deletedImages) {
            const publicId = image
                .split("/")
                .slice(-2)
                .join("/")
                .split(".")[0];
            await cloudinary.uploader.destroy(publicId);
        }
        const scrapbook = await Scrapbook.findByIdAndUpdate(
            id,
            {
                title,
                pages
            },
            {
                returnDocument: "after"
            }
        );
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