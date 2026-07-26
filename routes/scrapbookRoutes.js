const express = require("express");
const router = express.Router();


const {
    createScrapbook,
    getScrapbooks,
    updateScrapbook,
    deleteScrapbook
} = require("../controllers/scrapbookController");

const upload = require("../config/multer");

// Create a new scrapbook
router.post(
    "/",
    upload.array("coverImages"),
    createScrapbook
);

router.get("/", getScrapbooks);
router.put(
    "/:id",
    upload.array("coverImages"),
    updateScrapbook
);
router.delete("/:id", deleteScrapbook);
module.exports = router;

