# webpack-s3-pusher
A webpack plugin that pushes your packed assets to your S3 bucket, no more, no less.

## Installation
	npm install webpack-s3-pusher --save-dev
	
## Configuration
	new S3PusherPlugin({
		 // Target bucket
	    bucket: 'BUCKET',
	    
	    // Set the credentials.
	    key: 'KEY',
	    secret: 'SECRET',
	    region: 'us-west-2',
	    
	    // Publish to 'assets' folder
	    prefix: 'assets',        
	    
	    // Include css & js files   
	    include: '/.*\.(css|js)/'
	    
	    // Exclude minified JS files
	    exclude: '/.*.min.js/'      
	    
	    // Remove files from the bucket before upload.
	    remove: [                   
	    	'path/to/file1.js',
	    	'path/to/file2.js',
	    ]
	})

You can also use a credentials file from AWS rather than passing the 
	
## Push assets to S3 from Laravel Mix
.env
	
	APP_ASSETS_AWS_KEY=your_key
	APP_ASSETS_AWS_SECRET=your_secret
	APP_ASSETS_AWS_REGION=your_region
	APP_ASSETS_AWS_BUCKET=your_bucket
	APP_CDN_URL=http://my-bucket.s3-website.eu-west-2.amazonaws.com
	
webpack.mix.js:

	const { mix } = require('laravel-mix');
	const S3PusherPlugin = require('webpack-s3-pusher')
	
	let config = {
	    plugins: [],
	};
	
	if (process.env.npm_config_env === 'staging' || process.env.NODE_ENV === 'production') {
	    config.output.publicPath = process.env.APP_CDN_URL + '/';
	    config.plugins.push(
	        new S3PusherPlugin({
	            key: process.env.APP_ASSETS_AWS_KEY,
	            secret: process.env.APP_ASSETS_AWS_SECRET,
	            region: process.env.APP_ASSETS_AWS_REGION,
	            bucket: process.env.APP_ASSETS_AWS_BUCKET,
	        })
	    )
	}
	
	mix.webpackConfig(config);
	
	mix.js('resources/assets/js/app.js', 'public/js')
	   .sass('resources/assets/sass/app.scss', 'public/css')
   	   .version();
	
Then you will be able to push to S3 using:

	npm run production
	// or
	npm run dev --env=staging
	
## Contributing
Pull requests welcome 🙂