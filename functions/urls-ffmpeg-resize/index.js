var AWS = require('aws-sdk')
var iopipe = require("iopipe")()
var Dockaless = require("dockaless")
var crypto = require("crypto")

var dals = new Dockaless()
var s3 = new AWS.S3()

function put_bucket(event, context) {
  s3.createBucket({Bucket: event.bucket}, function() {
    var params = {Bucket: event.bucket, Key: event.key, Body: event.body};
    s3.putObject(params, function(err, data) {
        if (err)
            context.fail(err)
        else
            context.succeed(event)
     });
  });
}

exports.handle = iopipe.define(
  iopipe.property("urls"),
  iopipe.map(
    iopipe.fetch,
    dals.make_lambda("sjourdan/ffmpeg", [ "-i", "pipe:0", "-vf", "scale=320:240", "pipe:1" ]),
    (event, context) => {
      var video_hash = crypto.createHash('sha256').update(event).digest('hex')
      put_bucket({
        bucket: "your_bucket",
        key: video_hash
      }, context)
    },
    (event, callback) => {
      callback(s3.getSignedUrl('getObject', event))
    }
  )
)
exports.handler = exports.handle
module.exports = exports.handle
