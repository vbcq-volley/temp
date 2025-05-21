const fs = require('fs');

class DB {
    constructor(options, filename) {
        if (!options || typeof options !== 'object') {
            throw new Error('Options must be an object');
        }
        this.options = options;
        this.data = {};
        this.filename = filename||this.options.filename||'./db.json';

        // Load data from file at startup if the file exists
        this.loadFromFile(this.filename);

        // Set up automatic saving
       // this.setupAutoSave();
    }

    /**
     * Create or retrieve a model
     * @param {string} name - The name of the model
     * @returns {object} The model
     */
    model(name) {
        if (!name || typeof name !== 'string') {
            throw new Error('Model name must be a non-empty string');
        }

        if (!this.data[name]) {
            this.data[name] = {
                // You can add default properties or methods for the model here
            };
        }

        return this.data[name];
    }

    /**
     * Create a new entry in the model
     * @param {string} modelName - The name of the model
     * @param {object} entry - The entry to create
     */
    create(modelName, entry) {
        const model = this.model(modelName);
        if (!model.entries) {
            model.entries = [];
        }
        model.entries.push(entry);
        this.saveToFile(this.filename);
    }

    /**
     * Retrieve entries from the model
     * @param {string} modelName - The name of the model
     * @returns {array} The list of entries
     */
    read(modelName) {
        const model = this.model(modelName);
        return model.entries || [];
    }

    /**
     * Update an entry in the model
     * @param {string} modelName - The name of the model
     * @param {number} index - The index of the entry to update
     * @param {object} newEntry - The new entry data
     */
    update(modelName, index, newEntry) {
        const model = this.model(modelName);
        if (model.entries && model.entries[index]) {
            model.entries[index] = newEntry;
            this.saveToFile(this.filename);
        } else {
            throw new Error('Entry not found');
        }
    }

    /**
     * Delete an entry from the model
     * @param {string} modelName - The name of the model
     * @param {number} index - The index of the entry to delete
     */
    delete(modelName, index) {
        const model = this.model(modelName);
        if (model.entries && model.entries[index]) {
            model.entries.splice(index, 1);
            this.saveToFile(this.filename);
        } else {
            throw new Error('Entry not found');
        }
    }

    /**
     * Save the data to a file
     * @param {string} filename - The name of the file to save the data
     */
    saveToFile(filename) {
        console.log(this.data)
        fs.writeFileSync(filename, JSON.stringify(this.data, null, 2));
    }

    /**
     * Load the data from a file
     * @param {string} filename - The name of the file to load the data from
     */
    loadFromFile(filename) {
        if (fs.existsSync(filename)) {
            const fileData = fs.readFileSync(filename, 'utf8');
            this.data = JSON.parse(fileData);
        }
    }

    /**
     * Set up automatic saving of data
     */
   
}


 const db = new DB({filename:'./test.json'});
 db.create('admin', { id: 1, name: 'Alice' });
 console.log(db.read('users'));

