import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Username is required"],
        unique:true
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        select:false
    },
    verified:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

userSchema.pre("save", async function(){
    if(!this.isModified("password")){
        return;
    }
    this.password = bcrypt.hashSync(this.password, 10);
});

userSchema.methods.comparePassword = function(candidatePassword){
    return bcrypt.compare(candidatePassword, this.password);
}


const user = mongoose.model("User",userSchema);

export default user;

