const DB = require('sqlite3-helper');

DB({
    path: './sqlite3.db', // this is the default
    memory: false, // create a db only in memory
    readOnly: false, // read only
    fileMustExist: false, // throw error if database not exists
    WAL: true, // automatically enable 'PRAGMA journal_mode = WAL'
    migrate: {  // disable completely by setting `migrate: false`
      force: false, // set to true to automatically reapply the last migration-file
      table: 'migration', // name of the database table that is used to keep track
      migrationsPath: './migrations' // path of the migration-files
    }
});

class Repositories {

    constructor(options){
        this.options = options;
    }

    async insert(values){
        await DB().insert('repositories', values);
    }

    async all(){
        return await DB().query('SELECT * FROM repositories');
    }

    async whereVulnerability(vulnerability_id){
        return await DB().query('SELECT * FROM repositories WHERE vulnerability_id = ?', vulnerability_id);
    }

}

module.exports.Repositories = Repositories;