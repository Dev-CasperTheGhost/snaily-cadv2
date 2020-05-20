const mySql = require("promise-mysql2");
const { databaseUser, host, databasePassword, database } = require("../../config.js");

// Database options: Edit config.json
const options = {
    host: host,
    user: databaseUser,
    password: databasePassword,
    database: database,
    multipleStatements: true,
    timeout: 0
}

// Connect to database
async function connectToDatabase() {
    return await mySql.createConnection(options);
};


// Process all queries
async function processQuery(query, data) {
    const connection = await connectToDatabase();
    const [rows] = await connection.query(query, data);
    return rows;
}


module.exports = {
    connectToDatabase: connectToDatabase,
    processQuery: processQuery
};