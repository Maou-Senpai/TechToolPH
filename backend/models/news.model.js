import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const newsSchema = new Schema({
    title:{
        type: String
    },
    author:{
        type: String
    },
    link:{
        type: String
    },
    time:{
        type: Date
    },
    thumbnail:{
        type: String
    },
    source:{
        type: String
    }
},{ collection: 'news' });

const News = mongoose.model('news',newsSchema);

//module.exports = Person;
export default News;