module.exports = {
    mysqlDbConfig: {
        host: process.env.DATABASE_URL || 'localhost',
        user: process.env.DATABASE_USER ||'root',
        password: process.env.DATABASE_PWD || 'secretkey',
        connectionLimit: 10,
    },
};
