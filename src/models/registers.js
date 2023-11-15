const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email: {
        type:String,
        required: true,
        unique : true
    },
    password:{
        type:String,
        required:true
    },
    confirmPassword:{
        type:String,
        required:true
    }

})

// now we need ot create a collection

const Register = new mongoose.model("Register", employeeSchema);

module.exports = Register;