import mongoose from 'mongoose';

let test = new mongoose.Schema({
	name: { type: String }
});

export default mongoose.model('Test', test);
