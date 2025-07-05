// import mongoose from "mongoose";
// import bcrypt from "bcryptjs"

// const userSchema = new mongoose.Schema({
//     fullName : {
//         type : String,
//         required : true,
//     },
//     email : {
//         type : String,
//         required : true,
//         unique : true,
//     },
//     password : {
//         type : String,
//         required: true,
//         minlenght : 6
//     },
//     bio : {
//         type : String,
//         default : "",
//     },
//     profilePic : {
//         type : String,
//         default : "",
//     },
//     nativeLanguage : {
//         type : String,
//         default : "",
//     },
//     learningLanguage : {
//         type : String,
//         default : "",
//     },
//     location : {
//         type : String,
//         default : "",
//     },
//     isOnboarded : {
//         // thanks to this attribute we will decide which when it will visit other pages
//         // if type is false then you have to login then only you can visit other pages
//         type : Boolean,
//         default : false,
//     },
//     friends : [
//         {
//             type : mongoose.Schema.Types.ObjectId,
//             ref : "User"
//         }
//     ]
// },
// {timestamps:true}
// )

// // pre hook
// // mean here we are going to encrypt password so that no outter member can understand it
// // to do so we have used bycrypt list
// userSchema.pre("save",async function(next){
//     if(!this.isModified("password"))return next();
//     try {
//         const salt = await bcrypt.genSalt(10);
//         this.password = await bcrypt.hash(this.password,salt);
//         next();
//     } catch (error) {
//         next(error)
//     }
// })

// // checking if entered and stored passwords matches or not
// userSchema.methods.matchPassword = async function(enteredPassword){
//     const isPasswordCorrect = await bcrypt.compare(enteredPassword, this.password);
//     return isPasswordCorrect;
// }

// const User = mongoose.model("User",userSchema);



// export default User;
 import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    bio: {
      type: String,
      default: "",
    },
    profilePic: {
      type: String,
      default: function () {
        const idx = Math.floor(Math.random() * 100) + 1;
        return `https://avatar-placeholder.iran.liara.run/${idx}.png`;
      },
    },
    nativeLanguage: {
      type: String,
      default: "",
    },
    learningLanguage: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
