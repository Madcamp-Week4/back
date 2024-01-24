const { MongoClient, GridFSBucket, ObjectID } = require('mongodb');

const uri = process.env.ATLAS_URI;
const client = new MongoClient(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function getBucket(bucketName) {
  try {
    await client.connect();
    const db = client.db();
    return new GridFSBucket(db, { bucketName });
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
    throw error;
  }
}

module.exports = getBucket;