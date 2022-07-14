module.exports = {
    HOST: 'localhost',
    USER: 'agronomek',
    PASSWORD: '123',
    DB: 'agronomek_DB_Version_Alpha',
    dialect: 'mysql',
    pool: {
        // This is the max and min nb of user can connect into our my database
        max: 5,
        min: 0,
        // This part is an optionel
        acquire: 30000,
        idle: 10000
    }
}
