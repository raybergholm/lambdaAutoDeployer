"use strict";

const LAMBDA_FUNCTION_BUCKET = process.env.LAMBDA_FUNCTION_BUCKET;

const SUPPORTED_LAMBDAS_DELIMITER = ";";

const SUPPORTED_LAMBDAS = process.env.LAMBDA_FUNCTIONS.split(SUPPORTED_LAMBDAS_DELIMITER);

const AWS = require("aws-sdk");
const lambda = new AWS.Lambda();

exports.handler = function (event, context) {
    let bucket = event.Records[0].s3.bucket.name;
    let key = event.Records[0].s3.object.key;
    let version = event.Records[0].s3.object.versionId;

    if (bucket == LAMBDA_FUNCTION_BUCKET) {
        let filename = key.split(".")[0]; // for now, the zip folders are named the same way as their corresponding lambdas

        if (SUPPORTED_LAMBDAS.indexOf(filename) === -1) {
            throw new Error("Invalid Lambda function name: ", filename);
        }

        if (filename && version) {
            let params = {
                FunctionName: filename,
                S3Key: key,
                S3Bucket: bucket,
                S3ObjectVersion: version
            };

            lambda.updateFunctionCode(params)
                .then((data) => {
                    console.log(`Lambda ${filename} updated`, data);
                    context.succeed(data);
                })
                .catch((err) => {
                    console.log(err, err.stack);
                    context.fail(err);
                });
        } else {
            context.succeed(`skipping version ${version} of ${key} in bucket ${bucket}`);
        }
    }
};