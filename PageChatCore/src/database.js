import {MongoClient} from 'mongodb'

const URL = 'mongodb://159.89.194.49:27017/chatapp';


export default class Database {

    connect() {
        return new Promise((resolve, reject) => {
            MongoClient.connect(URL, (err, db) => {
                return err ? reject(err) : resolve(db);
            });
        });
    }
}