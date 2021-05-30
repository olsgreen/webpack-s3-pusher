# webpack-s3-pusher

A webpack plugin that pushes your packed assets to S3 compatible bucket, no more, no less.

_For webpack < 4 support use version 1.x_

## Installation

```bash
npm install webpack-s3-pusher
```

## Configuration

```javascript
new S3PusherPlugin({
    key: 'your_key',
    secret: 'your_secret',

    // If you are using Amazon S3 then only set region.
    // However if you are using some other provider then set only endpoint.
    // Region and endpoint both should not be set together.

    region: 'us-west-2',
    // endpoint: 'https://sgp1.digitaloceanspaces.com,

    bucket: 'bucket_name',
    acl: 'public-read', // If you are not using a bucket with default public permissions
    cache: 'max-age=602430', // Set Cache-Control header
    prefix: 'assets', // Publish to a folder instead of root directory

    include: '/.*\.(css|js)/',
    exclude: '/.*.min.js/',
    remove: [
        'path/to/file1.js',
        'path/to/file2.js',
    ], // Remove files from the bucket before upload.
})
```

## Laravel Mix Implementation

.env

```env
S3_KEY=your_key
S3_SECRET=your_secret
S3_BUCKET=your_bucket

# If you are using Amazon S3 then only set region.
# However if you are using some other provider then only set endpoint.
# Region and endpoint both should not be set together.

S3_REGION=your_region
# S3_ENDPOINT=your_endpoint
```

webpack.mix.js

```javascript
const mix = require('laravel-mix');
const S3PusherPlugin = require('webpack-s3-pusher');

if (mix.inProduction()) {
    mix.webpackConfig({
        plugins: [
            new S3PusherPlugin({
                key: process.env.S3_KEY,
                secret: process.env.S3_SECRET,
                bucket: process.env.S3_BUCKET,
                region: process.env.S3_REGION,
                // endpoint: process.env.S3_ENDPOINT,
                prefix: 'assets',
                acl: 'public-read',
                cache: 'max-age=602430',
            })
        ]
    });
}

mix.js('resources/js/app.js', 'public/js')
    .postCss('resources/css/app.css', 'public/css');
```

Push assets to bucket

```bash
npm run production
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
