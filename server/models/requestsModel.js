import mongoose from 'mongoose';
import { userModel } from './userModel.js';

const requestsSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:userModel,
        required:true
    },
    requests:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:userModel
    }]
});

const requestsModel=mongoose.model("requestsModel",requestsSchema);

export { requestsModel };