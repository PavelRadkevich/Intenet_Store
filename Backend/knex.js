module.exports = {
    client: 'mssql',
    connection: {
        host: 'localhost',
        user: 'sa',
        password: '2890',
        database: 'aji',
    },
    migrations: {
        tablename: 'knex_migrations',
        directory: 'migrations',
    }
};