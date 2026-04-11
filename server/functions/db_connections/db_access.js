export const setUpDatabaseConnection = (db_client, mongoose_client) => 
{
    const user_db = db_client.db('smartbreaker');
    const mongoose_user_db = mongoose_client.connection.useDb('smartbreaker');


    return {user_db, mongoose_user_db};
}