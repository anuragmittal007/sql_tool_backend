const multer = require('multer');
const fs = require('fs');

exports.uploadFile = (req, res) => {
    try {
        // Check if req.file exists and has a path property
        if (!req.file || !req.file.path) {
            throw new Error('File not received');
        }

        // Handle the file upload logic here
        // extract the part after . from the file name
        const fileExtension = req.file.originalname.split('.')[1];

        fs.renameSync(req.file.path, 'uploads/' + req.userId+'.'+ fileExtension);
        console.log(req.userId,req.file.originalname,fileExtension);

        // Send a success response to the client
        res.status(200).json({ message: 'File uploaded successfully' });
    } catch (error) {
        // Handle any errors that might occur during the file upload
        console.error('Error uploading file:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
