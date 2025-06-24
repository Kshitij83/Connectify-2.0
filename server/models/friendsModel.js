import mongoose from 'mongoose';
import { userModel } from './userModel.js';

const friendsSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:userModel,
        required:true
    },
    friends:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:userModel
    }]
});

const friendsModel=mongoose.model("friendsModel",friendsSchema);

export { friendsModel };