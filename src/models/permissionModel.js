const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    isAllowed:{
        type:String,
        required:true,
        default:"false"
    },
    email:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('permissionModel',permissionSchema);