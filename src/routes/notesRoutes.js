const express = require("express");
const {uploadNotes,getNotes,checkPermission} = require("../controllers/notesController")
const upload = require("../middlewares/multerConfig"); // Path to your multer setup

const notesRouter = express.Router();

notesRouter.post("/upload",upload.single("notes"), uploadNotes);

notesRouter.get("/getnotes",getNotes);

notesRouter.post("/checkPermission",checkPermission);

module.exports = notesRouter;

