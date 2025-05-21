const Document = require("../../model/product.model");
const User = require("../../model/user.model");
// [GET] Documents
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    };
    const documents = await Document.find(find);
    res.json({
        code: 200,
        documents: documents,
        role : req.role,
    });
}

// [GET] Documents/detail/:slug
module.exports.detail = async (req, res) => {
    try {
        const find = {
            status: "active",
            deleted: false,
            slug: req.params.slug
        };

        const document = await Document.findOne(find);
    } catch (error) {
        req.flash("error", "Lỗi truy cập!");
        res.redirect("/Documents");
    }
}

// [GET] Documents/deleted
module.exports.deleteItem = async (req, res) => {
    const id = req.body.id;
    await Document.updateOne(
        { _id: id },
        { deleted: true }
    );
    res.json({
        code: 200,
        message: "Xóa thành công!",
    });
}

// [POST] Create
module.exports.createPost = async (req, res) => {
    const user = await User.findOne({
                tokenUser: token,
                deleted : false,
                status : "active"
            }).select("-password");
    const thumbnail = req.files['thumbnail'] ? req.files['thumbnail'][0].path : null;
    const documentFile = req.files['documentFile'] ? req.files['documentFile'][0].path : null;
    req.body.check = user.role;
    const document = new Document({
        ...req.body,
        thumbnail,
        documentFile
    });
    await document.save();

    res.json({
        code: 200,
        message: "Tạo tài liệu thành công!",
        document: document,
    });
}

// [GET] Edit
module.exports.edit = async (req, res) => {
    const product = await Document.findOne({
        slug: req.params.slug
    });

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    res.json(product);
}

// [PATCH] Edit
module.exports.editPatch = async (req, res) => {
    const id = req.body.id;
    try {
        await Product.updateOne(
            { _id: id }, 
            { 
                ...req.body, 
            }
        );
        res.json({
            code : 200,
            message: "Cap nhap thanh cong!",
        })
    } catch (error) {
        res.json({
            code : 400,
            message: "Cap nhap that bai!",
        })
    }

}
