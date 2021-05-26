import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const productSchema = new Schema({
    type: {
        type: String,
        required: true,
        trim: true
    },
    item: {
        type: String,
        required:true,
        trim:true
    },
    score: {
        type: Number,
        required:true,
        trim:true
    }
},{
    timestamps:true
});

export default mongoose.model('benchmark', productSchema);