const AWS = require('aws-sdk');
const fs = require('fs');
let s3;

function S3PusherPlugin(options) {
  this.bucket = options.bucket;
  this.assets = [];

  if (!options.region) {
    options.region = 'us-west-2';
  }

  if (options.prefix) {
    this.prefix = this.removeSlashes(options.prefix);
  }

  if (options.include) {
    this.include = options.include;
  }

  if (options.exclude) {
    this.exclude = options.exclude;
  }

  if (options.key && options.secret && options.region) {
    AWS.config.update({
      accessKeyId: options.key, 
      secretAccessKey: options.secret, 
      region: options.region
    })  
  }

  s3 = new AWS.S3();

  if (options.remove) {
    this.removePaths(options.remove)
  }
}

S3PusherPlugin.prototype.removePaths = function(paths) {
  var params = {
    Bucket: this.bucket, 
    Delete: {
      Objects: [], 
      Quiet: false
    }
  };

  for (let i in paths) {
    params.Delete.Objects.push({
      Key: paths[i],
    })
  }

  s3.deleteObjects(params, function(err, data) {
    if (err) console.log(err, err.stack); 
  });
};

S3PusherPlugin.prototype.removeSlashes = function(str) {
    return str.replace(/^\/|\/$/g, '');
};

S3PusherPlugin.prototype.upload = function(filename, content) {
  let params = {
    Bucket: this.bucket, 
    Key: filename, 
    Body: content
  };

  /**
   * @todo We should use a MIME sniffer on all files.
   */
  if (filename.slice(-3) === 'css') {
    params.ContentType = 'text/css';
  }

  s3.putObject(params, function(err, data) {
    if (err) {
      console.error('Could not upload ' + filename + ' to ' + this.bucket + '.')
    }
  });
};

S3PusherPlugin.prototype.shouldUpload = function(filename) {
  return (!this.include || this.include.test(filename)) && 
    (!this.exclude || !this.exclude.test(filename));
}

S3PusherPlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', (compilation, callback) => {
    for (var filename in compilation.assets) {
      if (this.shouldUpload(filename)) {
        this.assets.push(filename);
      }
    }

    callback();
  });

  compiler.plugin('done', (stats) => {
    console.log('Uploading assets to \'' + this.bucket + '\'...')

    for (var i in this.assets) {
      // Remove the question mark. 
      // (added by laravel-mix for some assets)
      let filename = this.assets[i].split('?')[0];

      filename = this.removeSlashes(filename)

      console.log(filename)

      let localPath = compiler.outputPath + '/' + filename;
      let remotePath = filename;

      if (this.prefix) {        
        remotePath = this.prefix + '/' + remotePath;
      }

      this.upload(remotePath, fs.readFileSync(localPath)); 
    }

    console.log('Finished!');
  });
};

module.exports = S3PusherPlugin;