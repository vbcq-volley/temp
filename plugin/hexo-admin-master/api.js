var path = require('path')
var fs = require('fs')
var yml = require('js-yaml')
var deepAssign = require('deep-assign')
var extend = require('extend')
const { source } = require('superagent')
var updateAny = require('./update')
  , updatePage = updateAny.bind(null, 'Page')
  , update = updateAny.bind(null, 'Post')
  , deploy = require('./deploy')
const uuid=require("uuid")

class DB {
    constructor(options, filename) {
        if (!options || typeof options !== 'object') {
            throw new Error('Options must be an object');
        }
        this.options = options;
        this.data = {};
        this.filename = filename||this.options.filename||'./db.json';
        console.log(path.resolve(this.filename))
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
      console.log(path.resolve(this.filename))
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
      console.log(path.resolve(this.filename))
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
const db=new DB({
  filename:"./source/_data/db.json"
})

db.read("match").map((item,index)=>{
  item.title=`${item.team1} vs ${item.team2}`
  db.update('match',index,item)
})
module.exports = function (app, hexo) {

  function addIsDraft(post) {
  //  console.log(post)
    post.isDraft = post.source.indexOf('_draft') === 0
    post.isDiscarded = post.source.indexOf('_discarded') === 0
    return post
  }

  function tagsCategoriesAndMetadata() {
    var cats = {}
      , tags = {}
    hexo.model('Category').forEach(function (cat) {
      cats[cat._id] = cat.name
    })
    hexo.model('Tag').forEach(function (tag) {
      tags[tag._id] = tag.name
    })
    return {
      categories: cats,
      tags: tags,
      metadata: Object.keys(hexo.config.metadata || {})
    }
  }

  // reads admin panel settings from _admin-config.yml
  // or writes it if it does not exist
  function getSettings() {
    var path = hexo.base_dir + '_admin-config.yml'
    if (!fs.existsSync(path)) {
      hexo.log.d('admin config not found, creating one')
      fs.writeFile(hexo.base_dir+'_admin-config.yml', '')
      return {}
    } else {
      var settings = yml.safeLoad(fs.readFileSync(path))

      if (!settings) return {}
      return settings
    }
  }

  function remove(id, body, res) {
    var post = hexo.model('Post').update().get(id)
    console.log(post)
    if (!post) return res.send(404, "Post not found")
    var newSource = '_discarded/' + post.source.slice('_drafts'.length)
    update(id, {source: newSource}, function (err, post) {
      if (err) {
        return res.send(400, err);
      }
      res.done(addIsDraft(post))
    }, hexo)
  }

  function publish(id, body, res) {
    var post = hexo.model('Post').get(id)
    console.log(post)
    if (!post) return res.send(404, "Post not found")
    var newSource = '_posts/' + post.source.slice('_drafts/'.length)
    update(id, {source: newSource}, function (err, post) {
      if (err) {
        return res.send(400, err);
      }
      res.done(addIsDraft(post))
    }, hexo)
  }

  function unpublish(id, body, res) {
    var post = hexo.model('Post').get(id)
    console.log(post)
    if (!post) return res.send(404, "Post not found")
    var newSource = '_drafts/' + post.source.slice('_posts/'.length)
    update(id, {source: newSource}, function (err, post) {
      if (err) {
        return res.send(400, err);
      }
      res.done(addIsDraft(post))
    }, hexo)
  }

  function rename(id, body, res) {
    var model = 'Post'
    var post = hexo.model('Post').get(id)
    //console.log(post)
    if (!post) {
      model = 'Page'
      post = hexo.model('Page').get(id)
      //console.log(post)
      if (!post) return res.send(404, "Post not found")
    }
    // remember old path w/o index.md
    var oldPath = post.full_source
    oldPath = oldPath.slice(0, oldPath.indexOf('index.md'))

    updateAny(model, id, {source: body.filename}, function (err, post) {
      if (err) {
        return res.send(400, err);
      }
      hexo.log.d(`renamed ${model.toLowerCase()} to ${body.filename}`)

      // remove old folder if empty
      if (model === 'Page' && fs.existsSync(oldPath)) {
        if (fs.readdirSync(oldPath).length === 0) {
          fs.rmdirSync(oldPath)
          hexo.log.d('removed old page\'s empty directory')
        }
      }

      res.done(addIsDraft(post))
    }, hexo)
  }

  var use = function (path, fn) {
  
    app.use(hexo.config.root + 'admin/api/' + path, function (req, res) {
    
      var done = function (val) {
        console.log(val)
        if (!val) {
          res.statusCode = 204
          return res.end('');
        }
        res.setHeader('Content-type', 'application/json')
        res.end(JSON.stringify(val, function(k, v) {
          // tags and cats have posts reference resulting in circular json..
          if ( k == 'tags' || k == 'categories' ) {
            // convert object to simple array
            return v.toArray ? v.toArray().map(function(obj) {
              return obj.name
            }) : v
          }
          return v;
        }))
      }
      res.done = done
      res.send = function (num, data) {
        res.statusCode = num
        res.end(data)
      }
      fn(req, res)
    })
  }

  //TODO, get gallery data
  use('gallery/list', function (req, res) {
    var json = 'hexo-admin-ehc-images.json';
    var file = path.join(hexo.source_dir, json);
    var content = fs.readFileSync(file);
    res.done(JSON.parse(content));
  });
  //TODO, save new uploads to json
  use('gallery/set', function (req, res) {
    res.done({
      result: 'success'
    })
  });


  use('tags-categories-and-metadata', function (req, res) {
    res.done(tagsCategoriesAndMetadata())
  });

  use('settings/list', function (req, res) {
    res.done(getSettings())
  });

  use('settings/set', function (req, res, next) {
    if (req.method !== 'POST') return next()
    if (!req.body.name) {
      console.log('no name')
      hexo.log.d('no name')
      return res.send(400, 'No name given')
    }
    // value is capable of being false
    if (typeof req.body.value === 'undefined') {
      console.log('no value')
      hexo.log.d('no value')
      return res.send(400, 'No value given')
    }

    var name = req.body.name
    var value = req.body.value

    // no addOptions means we just want to set a single value in the admin options
    // usually for text-based option setting
    var addedOptsExist = !!req.body.addedOptions

    settings = getSettings()
    // create options section if it doesn't exist, ie. first time changing settings
    if (!settings.options) {
      settings.options = {}
    }

    settings.options[name] = value

    var addedOptions = addedOptsExist ? req.body.addedOptions : 'no additional options'
    if (addedOptsExist) {
      settings = deepAssign(settings, addedOptions)
    }
    hexo.log.d('set', name, '=', value, 'with', JSON.stringify(addedOptions))

    fs.writeFileSync(hexo.base_dir + '_admin-config.yml', yml.safeDump(settings))
    res.done({
      updated: 'Successfully updated ' + name + ' = ' + value,
      settings: settings
    })
  });

  use('pages/list', function (req, res) {
   var page = hexo.model('Page')
   //.log(page)
   res.done(page.toArray());
  });


// Endpoint pour ajouter une entrée dans un modèle
use('db/', function(req, res) {
    if (req.method === 'POST') {
        
       
            try {
                const modelName = req.url.split('/').filter(Boolean)[0];
                const entry = req.body;
                entry._id=uuid.v7()
                // Ajouter une entrée dans le modèle
                db.create(modelName, entry);

                return res.done(entry);
            } catch (error) {
              console.log(error)
               return  res.send(400, 'Bad Request');
            }
       
    } else {
         if (req.method === 'GET') {
          db.read("match").map((item,index)=>{
  item.title=`${item.team1} vs ${item.team2}`
  if(!item._id){
    item._id=uuid.v7()
  }
  db.update('match',index,item)
})  
        const modelName = req.url.split('/').filter(Boolean)[0];

        // Obtenir toutes les entrées du modèle
        const entries = db.read(modelName);

return res.done(entries);
    } else {
       return  res.send(405, 'Method Not Allowed');
    }
    }
});

// Endpoint pour obtenir toutes les entrées d'un modèle


// Endpoint pour mettre à jour une entrée dans un modèle
use('db/:model/:index', function(req, res) {
    if (req.method === 'PUT') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const modelName = req.url.split('/').filter(Boolean)[0];
                const index = req.url.split('/').filter(Boolean)[1];
                const newEntry = JSON.parse(body);

                // Mettre à jour une entrée dans le modèle
                db.update(modelName, index, newEntry);

                res.send(200, 'Entry updated');
            } catch (error) {
                res.send(400, 'Bad Request');
            }
        });
    } else {
        res.send(405, 'Method Not Allowed');
    }
});

// Endpoint pour supprimer une entrée d'un modèle
use('db/:model/:index', function(req, res) {
    if (req.method === 'DELETE') {
        const modelName = req.url.split('/').filter(Boolean)[0];
        const index = req.url.split('/').filter(Boolean)[1];

        // Supprimer une entrée du modèle
        db.delete(modelName, index);

        res.send(200, 'Entry deleted');
    } else {
        res.send(405, 'Method Not Allowed');
    }
});

  use('pages/new', function (req, res, next) {
    if (req.method !== 'POST') return next()
    if (!req.body) {
      return res.send(400, 'No page body given');
    }
    if (!req.body.title) {
      return res.send(400, 'No title given');
    }

    hexo.post.create({title: req.body.title, layout: 'page', date: new Date()})
    .error(function(err) {
      console.error(err, err.stack)
      return res.send(500, 'Failed to create page')
    })
    .then(function (file) {
      var source = file.path.slice(hexo.source_dir.length)

      hexo.source.process([source]).then(function () {
        var page = hexo.model('Page').findOne({source: source})
        res.done(addIsDraft(page));
      });
    });
  });

  use('data/new', function (req, res, next) {
    if (req.method !== 'POST') return next()
    if (!req.body) {
      return res.send(400, 'No page body given');
    }
    console.log(req.body)
    if (!req.body.data.text) {
      return res.send(400, 'No title given');
    }
    
    if(req.body.data.type=="normal"){
      hexo.post.create({title: req.body.data.text, layout: 'page', date: new Date()})
      .error(function(err) {
        console.error(err, err.stack)
        return res.send(500, 'Failed to create page')
      })
      .then(function (file) {
        var source = file.path.slice(hexo.source_dir.length)
  return res.send(200,"good")
      
      });
    }else{
      req.body.data._id= uuid.v7()
   db.create(req.body.data.type,req.body.data)
return res.done(db.read(req.body.data.type))  }
  
   
    
  });


  use('pages/', function (req, res, next) {
    var url = req.url
    console.log('in pages', url)
    if (url[url.length - 1] === '/') {
      url = url.slice(0, -1)
    }
    var parts = url.split('/')
    var last = parts[parts.length-1]
    // not currently used?
    if (last === 'remove') {
      return remove(parts[parts.length-2], req.body, res)
    }
    if (last === 'rename') {
      return remove(parts[parts.length-2], req.body, res)
    }

    var id = last
    if (id === 'pages' || !id) return next()
    if (req.method === 'GET') {
      var page = hexo.model('Page').get(id)
    
      return res.done(addIsDraft(page))
    }

    if (!req.body) {
      return res.send(400, 'No page body given');
    }

    updatePage(id, req.body, function (err, page) {
      if (err) {
        return res.send(400, err);
      }
      res.done({
        page: addIsDraft(page),
        tagsCategoriesAndMetadata: tagsCategoriesAndMetadata()
      })
    }, hexo);
  });

  use('posts/list', function (req, res) {
   var post = hexo.model('Post')
   console.log(post)
   res.done(post.map(addIsDraft));
  });

  use('posts/new', function (req, res, next) {
    if (req.method !== 'POST') return next()
    if (!req.body) {
      return res.send(400, 'No post body given');
    }
    if (!req.body.title) {
      return res.send(400, 'No title given');
    }

    var postParameters = {title: req.body.title, layout: 'posts', date: new Date(), author: hexo.config.author,source:"_post"};
    console.log(postParameters)
    hexo.post.create(postParameters)
    .error(function(err) {
      console.log("l'erreur est a la création du post")
      console.error(err, err.stack)
      return res.send(500, 'Failed to create post')
    })
    .then(function (file) {
      var source = postParameters.source
      console.log(file)
      res.send(200,"succes")
    });
  });

  use('posts/', function (req, res, next) {
    var url = req.url
    if (url[url.length - 1] === '/') {
      url = url.slice(0, -1)
    }
    var parts = url.split('/')
    var last = parts[parts.length-1]
    if (last === 'publish') {
      return publish(parts[parts.length-2], req.body, res)
    }
    if (last === 'unpublish') {
      return unpublish(parts[parts.length-2], req.body, res)
    }
    if (last === 'remove') {
      return remove(parts[parts.length-2], req.body, res)
    }
    if (last === 'rename') {
      return rename(parts[parts.length-2], req.body, res)
    }

    var id = last
    if (id === 'posts' || !id) return next()
    if (req.method === 'GET') {
      var post = hexo.model('Post').get(id)
      if (!post) return next()
      return res.done(  post)
    }

    if (!req.body) {
      return res.send(400, 'No post body given');
    }

    update(id, req.body, function (err, post) {
      if (err) {
        return res.send(400, err);
      }
      res.done({
        post: addIsDraft(post),
        tagsCategoriesAndMetadata: tagsCategoriesAndMetadata()
      })
    }, hexo);
  });

  use('images/upload', function (req, res, next) {
    hexo.log.d('uploading image')
    if (req.method !== 'POST') return next()
    if (!req.body) {
      return res.send(400, 'No post body given');
    }
    if (!req.body.data) {
      return res.send(400, 'No data given');
    }
    var settings = getSettings()

    var imagePath = '/images'
    var imagePrefix = 'pasted-'
    var askImageFilename = false
    var overwriteImages = false
    // check for image settings and set them if they exist
    if (settings.options) {
      askImageFilename = !!settings.options.askImageFilename
      overwriteImages = !!settings.options.overwriteImages
      imagePath = settings.options.imagePath ? settings.options.imagePath : imagePath
      imagePrefix = settings.options.imagePrefix ? settings.options.imagePrefix : imagePrefix
    }

    var msg = 'uploaded!'
    var i = 0
    while (fs.existsSync(path.join(hexo.source_dir, imagePath, imagePrefix + i +'.png'))) {
      i +=1
    }
    var filename = path.join(imagePrefix + i +'.png')
    if (req.body.filename) {
      var givenFilename = req.body.filename
      // check for png ending, add it if not there
      var index = givenFilename.toLowerCase().indexOf('.png')
      if (index < 0 || index != givenFilename.length - 4) {
        givenFilename += '.png'
      }
      hexo.log.d('trying custom filename', givenFilename)
      if (fs.existsSync(path.join(hexo.source_dir, imagePath, givenFilename))){
        if (overwriteImages) {
          hexo.log.d('file already exists, overwriting')
          msg = 'overwrote existing file'
          filename = givenFilename
        } else {
          hexo.log.d('file already exists, using', filename)
          msg = 'filename already exists, renamed'
        }
      } else {
        filename = givenFilename
      }
    }

    filename = path.join(imagePath, filename)
    var outpath = path.join(hexo.source_dir, filename)

    var dataURI = req.body.data.slice('data:image/png;base64,'.length)
    var buf = new Buffer(dataURI, 'base64')
    hexo.log.d(`saving image to ${outpath}`)
    fs.writeFile(outpath, buf, function (err) {
      if (err) {
        console.log(err)
      }
      console.log('hexo.config.url: '+hexo.config.url);
      hexo.source.process().then(function () {
        res.done({
          // FIXME, use image URL to display image rather than relative path @2018/02/04
          src: hexo.config.url + filename,
          // src: path.join(hexo.config.root + filename),
          msg: msg
        })
      });
    })
  });

  // using deploy to generate static pages
  // @2018/01/22
  use('deploy', function(req, res, next) {
    if (req.method !== 'POST') return next();

    hexo.call('generate').then(function(){
      var result = {status: 'success', stdout: 'Done!'};
      hexo.exit();
      res.done(result);
    }).catch(function(err){
      return hexo.exit(err);
    });

  });

}
