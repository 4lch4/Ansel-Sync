# @4lch4/ansel-sync

This repository/application serves the sole purpose of updating the Redis DB used by Ansel to contain the latest links/data from the Ansel Space.

## Schedule

At the start, I'll have it run every 10 minutes along with some testing to ensure it works as expected.

Once I ironed out the details, I'll change the interval to once an hour.

## Design/Structure

The job will perform the following steps upon execution/invocation of the job:

1. Pull all of the top-level buckets from within the s3://ansel bucket.
2. Add each top-level bucket as a key is present within Redis.
3. Iterate through each bucket (folder) and add all of the values to Redis.
