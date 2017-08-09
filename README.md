# mongoose-seed-db

[![Build Status](https://travis-ci.org/bellstrand/mongoose-seed-db.svg?branch=master)](https://travis-ci.org/bellstrand/mongoose-seed-db)
[![npm Version](https://img.shields.io/npm/v/mongoose-seed-db.svg)](https://www.npmjs.com/package/mongoose-seed-db)

mongoose-seed-db lets you populate and clear MongoDB collections with all the benefits of Mongooses model validation


## Basic example
```javascript
var MongooseSeed = require('mongoose-seed-db');
//import MongooseSeed from 'mongoose-seed-db'; //ES6

MongooseSeed.connect('mongodb://localhost:27017/mongoose-seed').then(() => {
	MongooseSeed.loadModels(__dirname + '/../src/models');
	MongooseSeed.clearAll().then(() => {
		MongooseSeed.populate(__dirname + '/data').then(() => {
			process.exit();
		});
	});
});
```

## Mongoose Model example
```javascript
var mongoose = require('mongoose');
//import mongoose from 'mongoose'; //ES6

var test = new mongoose.Schema({
	name: { type: String }
});

export default mongoose.model('Test', test);

```

## Data example (.js)
```javascript
module.exports = {
	model: 'Test',
	data: [
		{ name: 'js-example-entry-1' },
		{ name: 'js-example-entry-1' }
	]
};
```

## Data example (.json)
```json
{
	"model": "Test",
	"data": [
		{ "name": "json-example-entry-1" },
		{ "name": "json-example-entry-1" }
	]
}
```

## Functions

#### MongooseSeed.connect(db)

Initializes connection to MongoDB via Mongoose.

---

#### MongooseSeed.loadModels(path)

Loads mongoose models from path, use: ```__dirname + '/path_to_models'```

---

#### MongooseSeed.populate(path, options)

Populate MongoDB with data in js/json files from path, use: ```__dirname + '/path_to_data'```

Options:
```
populateExisting: true/false
	- defaults to true
	- false = only populate models without existing documents
```

---

#### MongooseSeed.clearAll()

Clears all data from loaded models

---

#### MongooseSeed.clearModels(array)

Clears all data from list of models provided in array
