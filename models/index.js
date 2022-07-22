const dbConfig = require('../config/dbConfig.js');

const {Sequelize, DataTypes} = require('sequelize')

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: false,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
)

sequelize.authenticate()
.then(() => {
    console.log('Connected ...')
})
.catch(err => {
    console.log('Error'+ err)
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.users = require('./users.js')(sequelize, DataTypes)
db.notifications = require('./notifications.js')(sequelize, DataTypes)
db.greenhouses = require('./greenhouses.js')(sequelize, DataTypes)

// 1. One to Many associations
db.users.hasMany(db.notifications,{
    foreignKey: 'User_Id',
    onDelete: "cascade",
    as: 'notification',

});

db.users.hasMany(db.greenhouses, {
    foreignKey: 'User_Id',
    onDelete: "cascade",
    as: 'greenhouse',
})

db.notifications.belongsTo(db.users, {
    foreignKey: 'User_Id',
    as: 'user' 
});

db.greenhouses.belongsTo(db.users, {
    foreignKey: 'User_Id',
    as: 'user'
})

db.sequelize.sync({
    force: false
}).then(()=> {
    console.log('Yes re-sync done !!')
})

module.exports = db