const User = require("../../model/user.model");

module.exports.infoUser = async (req, res, next) => {
    // console.log(req.headers.authorization.split(" ")[1]);
    if(req.headers.authorization){
        const token = req.headers.authorization.split(" ")[1];
        const user = await User.findOne({
            tokenUser: token,
            deleted : false,
            status : "active"
        }).select("-password");
        if(!user){
            res.json({
                code: 403,
                message: "khong co quyen truy cap!"
            });
        }else{
            req.role = user.role;
            next();
        }
    }
    else{
        res.json({
            code: 403,
            message: "khong co quyen truy cap!"
        });
    }

    
}

