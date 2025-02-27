import mysql from 'mysql2/promise';

//Note that the handler assumes the root path is associated with 
//https://n0dkxjq6pf.execute-api.us-east-1.amazonaws.com/dev1/about
const API_STAGE = '/dev1';

export const handler = async (event) => {
    // Extract method and path from requestContext
    const httpMethod = event.requestContext.http.method;
    const path = event.requestContext.http.path;

    // Log the method and path for debugging
    console.log(`Received request with method: ${httpMethod}, path: ${path}`);

    try {
        const connection = await mysql.createConnection({
            host: 'cpsc4910-team22-db2.cobd8enwsupz.us-east-1.rds.amazonaws.com',
            user: 'admin',
            password: 'ThereWasATeamHere!',
            database: 'Team22DB'
        });

        let response;

        if (httpMethod === 'GET' && path === `${API_STAGE}/about`) {
            const [rows] = await connection.execute('SELECT * FROM about_page');
            console.log('Query Result:', rows);

            response = {
                statusCode: 200,
                body: JSON.stringify(rows),
                headers: {
                    'Content-Type': 'application/json',
                },
            };
        } else {
            response = {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid request' }),
            };
        }

        await connection.end();
        return response;
    } catch (error) {
        console.error('Database Connection Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to retrieve data' }),
        };
    }
};
