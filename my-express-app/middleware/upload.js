const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Thư mục lưu file upload
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // Chỉ cho phép ảnh, word, pdf
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const ext = path.extname(file.originalname).toLowerCase().substring(1);
    if (allowedTypes.test(ext)) {
        cb(null, true);
    } else {
        cb(new Error('File type not allowed'), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;