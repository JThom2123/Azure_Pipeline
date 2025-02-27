import mysql from 'mysql2/promise';

export const handler = async (event) => {
    try {
        // Connect to RDS
        const connection = await mysql.createConnection({
            host: 'cpsc4910-team22-db2.cobd8enwsupz.us-east-1.rds.amazonaws.com',
            user: 'admin',
            password: 'ThereWasATeamHere!',
            database: 'Team22DB'
        });

        // Query the 'about_page' table
        const [rows] = await connection.execute('SELECT * FROM about_page');
        console.log('Query Result:', rows);

        await connection.end();

        return {
            statusCode: 200,
            body: JSON.stringify(rows),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    } catch (error) {
        console.error('Database Connection Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to retrieve data' }),
        };
    }
};
