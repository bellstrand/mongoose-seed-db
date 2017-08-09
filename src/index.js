import mongoose from 'mongoose';
import read from 'fs-readdir-recursive';

class MongooseSeed {
	constructor() {
		mongoose.Promise = global.Promise;
	}

	connect(db, options) {
		return new Promise((resolve, reject) => {
			mongoose.connect(db, Object.assign({ useMongoClient: true }, options)).then(() => {
				console.log('Connected to: ' + db);
				resolve();
			}).catch(error => {
				reject(error);
			});
		});
	}

	loadModels(path) {
		let files = read(path);
		this.models = []
		files.forEach(file => {
			if(~file.indexOf('.js')) {
				let model = require(path + '/' + file);
				this.models.push((model.default || model).modelName);
			}
		});
		console.log('Loaded models:', this.models);
	}

	populate(path, options = {}) {
		options = Object.assign({
			populateExisting: true
		}, options);

		return new Promise(async resolve => {
			let files = read(path);
			console.log('Loading data from: ', files);

			this.data = [];
			files.forEach(file => {
				if(~file.indexOf('.js') || ~file.indexOf('.json')) {
					this.data.push(require(path + '/' + file));
				}
			});

			console.log('Populating collections: ', this.data.map(collection => collection.model));

			for(var collection of this.data) {
				let Model = mongoose.model(collection.model);

				const documents = await Model.count({});

				if(options.populateExisting || (!options.populateExisting && !documents)) {
					console.log('Populating ' + collection.model + ' with ' + collection.data.length + ' entries');
					for(let entry of collection.data) {
						await Model.create(entry);
					};
				} else {
					console.log('Model ' + collection.model + ' has ' + documents + ' existing entries, not populating');
				}
			};
			console.log('Population Done!')
			resolve();
		});
	}

	clearAll() {
		return this.clearModels(this.models);
	}

	clearModels(models) {
		console.log('Clearing collections: ', models);
		return new Promise(async resolve => {
			for(let modelName of models) {
				let Model = mongoose.model(modelName);
				await Model.remove({});
				resolve();
			}
		});
	}
}

module.exports = exports = new MongooseSeed();
