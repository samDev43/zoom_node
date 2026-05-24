const mongoos = require('mongoose');

const userSchema = new mongoos.Schema({
    username: {
        type: String,
        required: [true, "name is require"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "email is require"],
         match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "use valid email Address",
        ],
        trim: true
    },
    password: {
        type:String,
        required: [true, "password is require"],
        minlength: [8, "the password is not strong enough"]
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    profile_Picture: {
        type: String,
        default: ""
    }
},
{
    timestamps: true,
}
)


const User = mongoos.model("User", userSchema);
module.exports = User;
