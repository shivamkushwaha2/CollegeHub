const Note = require("../models/notesModel");
const permissionModel = require("../models/permissionModel");

const cloudinary = require("../cloudinary");
const path = require('path');


const uploadNotes = async (req, res) => {
    const { course, semester, subject } = req.body;
    let noteUrl = '';

    try {
        if (!req.file) {
            return res.status(400).json({ message: "Note file is required" });
        }

        const fileBuffer = req.file.buffer;
        const fileName = req.file.originalname; // Get the original file name

        // Validate file type
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
        if (!allowedTypes.includes(req.file.mimetype)) {
            return res.status(400).json({ message: "Invalid file type. Only PDF, DOC, DOCX, and TXT are allowed." });
        }

        noteUrl = await uploadToCloudinary(fileBuffer, fileName, { resource_type: 'raw' });
        // noteUrl = await uploadToCloudinary(req.file.buffer, req.file.originalname);

        let name = "";
        name=fileName;
        const newNote = new Note({
            course,
            semester,   
            subject,
            name,
            noteUrl
        });

        await newNote.save();

        res.status(201).json({ message: "Note uploaded successfully", noteUrl });

    } catch (error) {
        console.log("UPLOAD NOTE ERROR: ", error);
        res.status(500).json({ message: "Failed to upload note", error: error.message });
    }
};

// API to fetch notes by course, semester, and subject
const getNotes = async (req, res) => {
    // const { course, semester, subject } = req.query;
    const course = req.query.course?.trim();
    const semester = req.query.semester?.trim();
    const subject = req.query.subject?.trim();

    console.log('Received query params:', { course, semester, subject });
    try {
        const notes = await Note.find({
            course,
            semester,
            subject
        });

        if (notes.length === 0) {
            return res.status(404).json({ message: "No notes found" });
        }

        res.status(200).json(notes);
    } catch (error) {
        console.log("FETCH NOTES ERROR: ", error);
        res.status(500).json({ message: "Failed to fetch notes", error: error.message });
    }
};

const checkPermission = async (req, res) => {
    const { isAllowed, email } = req.body;
    console.log('Received query params:', { isAllowed, email });

    try {
         const permission = await permissionModel.findOne({ email: email });
         if(permission){
    if (permission.isAllowed == "true") {
        return res.status(200).json({
            message: "Upload Allowed"
        });
    }else{
        return res.status(200).json({
            message: "Upload not Allowed"
        });  
    }
}

    const newPermission = new permissionModel({
        email: email,
        isAllowed: "false"
    });

   await newPermission.save();

    res.status(200).json({
        message: "Request sent successfully. Try to upload after some time. ",
        newPermission
    });
    } catch (error) {
        console.log("FETCH permission ERROR: ", error);
        res.status(500).json({ message: "Failed to fetch permission", error: error.message });
    }
};

// const uploadToCloudinary = (fileBuffer, options = {}) => {
//     return new Promise((resolve, reject) => {
//         const uploadStream = cloudinary.uploader.upload_stream(
//             { resource_type: options.resource_type || 'raw' },
//             (error, result) => {
//                 if (error) {
//                     reject(new Error(`Cloudinary upload failed: ${error.message}`));
//                 } else {
//                     resolve(result.secure_url); // Return the secure URL
//                 }
//             }
//         );
//         uploadStream.end(fileBuffer); // Send the file buffer to Cloudinary
//     });
// };

const uploadToCloudinary = (fileBuffer, fileName, options = {}) => {
    return new Promise((resolve, reject) => {
        // Extract the file extension from the original file
        const extension = path.extname(fileName).replace('.', ''); // Get extension without dot

        // Generate a public_id without the file extension
        const publicId = `notes/${path.basename(fileName, path.extname(fileName))}`; // Exclude extension

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: options.resource_type || 'raw', // Raw for non-images (PDF, DOC, etc.)
                public_id: publicId,  // Set the public_id without extension
                format: extension, // Specify the format explicitly
                use_filename: true,   // Retain the original filename
                unique_filename: false // Disable unique filename to keep the name
            },
            (error, result) => {
                if (error) {
                    reject(new Error(`Cloudinary upload failed: ${error.message}`));
                } else {
                    resolve(result.secure_url); // Return the secure URL with the correct extension
                }
            }
        );
        uploadStream.end(fileBuffer); // Send the file buffer to Cloudinary
    });
};


module.exports = { uploadNotes, getNotes, checkPermission };