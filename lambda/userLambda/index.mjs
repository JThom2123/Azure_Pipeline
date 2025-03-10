import mysql from 'mysql2/promise';

//Note that the handler assumes the root path is associated with 
//https://n0dkxjq6pf.execute-api.us-east-1.amazonaws.com/dev1/user
const API_STAGE = '/dev1';

export const handler = async (event) => {
    // Extract method and path from requestContext

    const httpMethod = event.requestContext.http.method;
    const path = event.requestContext.http.path;
    const pathParts = path.split("/");
    //console.log('Received event:', JSON.stringify(event, null, 2));
    const schema = 'Team22DB';


    //FUNCTIONS
    //UserExists function returns if a user exists
    //input: User email and the connection
    const userExists = async (email, connection) => {
        const [result] = await connection.execute(`
            SELECT * FROM users
            WHERE email = ?`, 
            [email]
        );
        return result.length > 0;
    };

    // Log the method and path for debugging
    console.log(`Received request with method: ${httpMethod}, path: ${path}`);

    try {
        const connection = await mysql.createConnection({
            host: 'cpsc4911.cobd8enwsupz.us-east-1.rds.amazonaws.com',
            user: 'admin',
            password: '4911Admin2025',
            database: 'Team22DB'
        });

        let response;

        

        //GET handler
        if (httpMethod === 'GET'){

            //FIXME!!!
            //GET user/points
            
            if(path === `${API_STAGE}/user/points`){

                //const requestBody = JSON.parse(event.body);
                const email = event.queryStringParameters?.email;
                console.log(`Query string param: ${email}`);

                if (!email) {
                    response = {
                        statusCode : 400,
                        body : JSON.stringify({ error: 'Missing required fields: email' }),
                    }
                }

                else{
                    await connection.query(`USE ${schema}`);

                    //checks if user exists
                    console.log(`Using schema: ${schema}`);
                    const exists = await userExists(email, connection);

                    if (!exists) {
                        console.log(`User email not found: ${email}`);
                        response = {
                            statusCode: 404,
                            body: JSON.stringify({ error: `User ${email} not found` }),
                        };
                    }
                    
                    //If user exists, total points
                    else{
                        console.log(`User exists: ${email}`);
                        const [rows] = await connection.execute(`
                        SELECT SUM(points) AS totalPoints
                        FROM points
                        WHERE email = ?`,
                        [email]
                        );

                        const totalPoints = rows[0].totalPoints || 0;

                        response = {
                            statusCode : 200,
                            body : JSON.stringify({ email, totalPoints }),
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        }
                    }   
                }
            }

            //GET user/{email}
            else if (path.startsWith(`${API_STAGE}/user`) && pathParts.length === 4) {
                const email = pathParts[pathParts.length - 1];
                
                //Set schema to our own DB schema
                await connection.query(`USE ${schema}`);

                const [rows] = await connection.execute(`
                    SELECT * 
                    FROM users
                    Where email = ?`,
                    [email]
                );
                console.log('Query Result:', rows);

                if (rows.length === 0) {
                    console.log('No user found for email:', email);
                    response = {
                        statusCode: 404,
                        body: JSON.stringify(
                            { error: `User ${email} not found` }
                        ),
                    };
                }

                else {
                    response = {
                        statusCode: 200,
                        body: JSON.stringify(rows),
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    };
                }
            } 
        }

        else if (httpMethod === 'POST'){
            
            //POST /user/points
            if(path === `${API_STAGE}/user/points`){

                const requestBody = JSON.parse(event.body);
                const { email, points } = requestBody;

                if (!email || !points) {
                    response = {
                        statusCode : 400,
                        body : JSON.stringify({ error: 'Missing required fields: points and email' }),
                    }
                }

                else{
                    await connection.query(`USE ${schema}`);

                    //checks if user exists
                    const exists = await userExists(email, connection);

                    if (!exists) {
                        response = {
                            statusCode: 404,
                            body: JSON.stringify({ error: 'User not found' }),
                        };
                    }
                    
                    //If user exists, add points
                    else{
                        await connection.execute(`
                            INSERT INTO points (email, points)
                            VALUES (?, ?)`,
                            [email, points]
                        );
                        response = {
                            statusCode : 200,
                            body : JSON.stringify({ message: 'points created successfully' }),
                        }
                    }   
                }
            }


            //POST /user
            else if(path === `${API_STAGE}/user`){
                
                const requestBody = JSON.parse(event.body);
                const { email, userType } = requestBody;

                if (!email || !userType) {
                    response = {
                        statusCode : 400,
                        body : JSON.stringify({ error: 'Missing required fields: username and email' }),
                    }
                }

                else {

                    await connection.query(`USE ${schema}`);
                    
                    // Check if user already exists
                    const [existingUser] = await connection.execute(`
                        SELECT * FROM users WHERE email = ?`,
                        [email]
                    );

                    if (existingUser.length > 0) {
                        response = {
                            statusCode: 409,
                            body: JSON.stringify({ error: 'User already exists' }),
                        };
                    }

                    else {
                        await connection.query(`use ${schema}`);
                        const result = await connection.execute(`
                        INSERT INTO users (email, userType)
                        VALUES (?, ?)`, 
                        [email, userType]
                        );
        
                        response = {
                            statusCode : 201,
                            body: JSON.stringify({
                                message: `${email} created successfully`,
                            }),
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        };
                    }
                }
            }   
        }

        else if (httpMethod === 'PATCH'){
            if (path === `${API_STAGE}/user`) {
                const requestBody = JSON.parse(event.body);
                const { email, userType } = requestBody;

                if (!email || !userType) {
                    response = {
                        statusCode: 400,
                        body: JSON.stringify({ error: 'Missing required fields: email and userType' }),
                    };
                } 
                
                else {
                    await connection.query(`USE ${schema}`);
                    const [result] = await connection.execute(`
                        UPDATE users
                        SET userType = ?
                        WHERE email = ?`, 
                        [userType, email]
                    );

                    if (result.affectedRows === 0) {
                        response = {
                            statusCode: 404,
                            body: JSON.stringify({ error: 'User not found' }),
                        };
                    } else {
                        response = {
                            statusCode: 200,
                            body: JSON.stringify({ message: 'User updated successfully' }),
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        };
                    }
                }
            }

            else if (path === `${API_STAGE}/user/points`){
                //TODO - Write PATCH /user/points
            }

        }

        else if (httpMethod === 'DELETE') {
            if (path.startsWith(`${API_STAGE}/user`) && pathParts.length === 4) {
                const email = pathParts[pathParts.length - 1];
                await connection.query(`USE ${schema}`);
                const [result] = await connection.execute(`
                    DELETE FROM users
                    WHERE email = ?`,
                    [email]
                );
                if (result.affectedRows === 0) {
                    response = {
                        statusCode: 404,
                        body: JSON.stringify({ error: 'User not found' }),
                    };
                } else {
                    response = {
                        statusCode: 200,
                        body: JSON.stringify({ message: 'User deleted successfully' }),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    };
                }
            }
        }
            

        else {
            console.log(`Method is: ${httpMethod}, Path correct: ${path.startsWith(`${API_STAGE}/user`)}, Path length: ${pathParts.length}`);
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
