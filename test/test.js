import MongooseSeed from '../src/index';

MongooseSeed.connect('mongodb://localhost:27017/mongoose-seed').then(() => {
	MongooseSeed.loadModels(__dirname + '/models');
	MongooseSeed.clearAll().then(() => {
		MongooseSeed.populate(__dirname + '/seed').then(() => {
			process.exit();
		}).catch(error => {
			throw error;
		});
	}).catch(error => {
		throw error;
	});
}).catch(error => {
	throw error;
});
