
const Document = require("../../model/product.model");
const { role } = require("./role.controller");
// [GET] client/home
module.exports.index = async (req, res) => {
    let find = {
        deleted : false,
    };
    const documents =  await Document.find(find);
    res.json({
        code : 200,
        documents : documents,
        role : req.role,
    });
}  