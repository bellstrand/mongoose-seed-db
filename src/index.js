import mongoose from 'mongoose';
import read from 'fs-readdir-recursive';

class MongooseSeed {
	constructor() {
		mongoose.Promise = global.Promise;
	}

	connect(db) {
		return new Promise((resolve, reject) => {
			mongoose.connect(db).then(() => {
				console.log('Connected to: ' + db);
				resolve();
			}).catch(error => {
				reject(error);
			});
		});
	}

	loadModels(modelsPath) {
		let files = read(modelsPath);
		this.models = []
		files.forEach(file => {
			if(~file.indexOf('.js')) {
				let model = require(modelsPath + '/' + file);
				this.models.push(model.default.modelName);
			}
		});
		console.log('Loaded models:', this.models);
	}

	populate(seedPath) {
		return new Promise((resolve, reject) => {
			let files = read(seedPath);
			console.log('Loading data from: ', files);

			this.data = [];
			files.forEach(file => {
				if(~file.indexOf('.js') || ~file.indexOf('.json')) {
					this.data.push(require(seedPath + '/' + file));
				}
			});

			console.log('Populating collections: ', this.data.map(collection => collection.model));

			let promisses = [];
			this.data.forEach(collection => {
				console.log('Populating ' + collection.model + ' with ' + collection.data.length + ' entries');
				let Model = mongoose.model(collection.model);
				collection.data.forEach(entry => {
					promisses.push(this.create(Model, entry));
				});
			});
			Promise.all(promisses).then(() => {
				console.log('Population Done!')
				resolve();
			}).catch(error => {
				reject(error);
			});
		});
	}

	create(Model, entry) {
		return new Promise((resolve, reject) => {
			Model.create(entry, error => {
				if(!error) {
					resolve();
				} else {
					reject();
				}
			});
		});
	}

	clearAll(models) {
		return this.clearModels(this.models);
	}

	clearModels(models) {
		console.log('Clearing collections: ', models);
		return new Promise((resolve, reject) => {
			let promisses = [];
			models.forEach(modelName => {
				promisses.push(this.clearModel(modelName));
			});
			Promise.all(promisses).then(() => {
				resolve();
			}).catch(error => {
				reject(error);
			});
		});
	}

	clearModel(modelName) {
		return new Promise((resolve, reject) => {
			let Model = mongoose.model(modelName);
			Model.remove({}, error => {
				if(!error) {
					resolve();
				} else {
					reject();
				}
			});
		});
	}
}

export default new MongooseSeed();
