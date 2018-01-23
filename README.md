# Autodeploy lambdas with this lambda

## HOWTO

Set the following environmental variables:

* LAMBDA_FUNCTION_BUCKET: S3 bucket
* LAMBDA_FUNCTIONS: semicolon delimited list of lambdas being auto-deployed

Add an S3 trigger to this lambda, hook it up to fire on new zips. Whenever a new zip is uploaded to the corresponding S3 bucket, this will automatically update the corresponding lambda function. Note that the code assumes that the zip filename and function names match.