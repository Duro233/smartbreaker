export const setUpDatabaseConnection = (db_client, mongoose_client) => 
{
    const user_db = db_client.db('users');
    const mongoose_user_db = mongoose_client.connection.useDb('users');


    //const data_db = db_client.db('Data');


    return {user_db, mongoose_user_db};
}