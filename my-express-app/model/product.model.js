const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const docSchema = new mongoose.Schema({
    title : String,
    description : String,
    check : Number,
    thumbnail :  { type: String },         // Lưu đường dẫn file ảnh
    documentFile: { type: String }, 
    status : String,
    slug: {
        type : String,
        slug : "title",
        unique : true
    },
    createBy: {
        account_id : String,
        createAt: {
            type: Date,
            default: Date.now
        }
    },
    deleted : {
        type : Boolean,
        default : false
    },
    deleteBy:{
        account_id: String,
        deleteAt: {
            type: Date,
            default: Date.now 
        }
    },
    updatedBy:[{
            account_id: String,
            updateAt: {
                type: Date,
                default: Date.now 
        }
    }]
},
{
    timestamps : true,
});

const Document = mongoose.model("Document", docSchema, "docs");
module.exports = Document;


