const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
    const bucketName = 'team22-app-logs';
    const fileName = 'logs/points-log.txt';
    const newLogEntry = `${new Date().toISOString()} - User: ${event.username}, Points: ${event.points}, Reason: ${event.reason}\n`;

    try {
        // Retrieve existing log file
        let existingLogs = '';
        try {
            const response = await s3.getObject({ Bucket: bucketName, Key: fileName }).promise();
            existingLogs = response.Body.toString('utf-8'); // Convert file content to string
        } catch (err) {
            if (err.code === 'NoSuchKey') {
                console.log('File does not exist. Creating a new one.');
            } else {
                throw err;
            }
        }

        // Append new entry
        const updatedLogs = existingLogs + newLogEntry;

        // Write back to S3
        await s3.putObject({
            Bucket: bucketName,
            Key: fileName,
            Body: updatedLogs,
            ContentType: 'text/plain'
        }).promise();

        console.log('Log appended to S3 successfully!');
        return { statusCode: 200, body: 'Log appended successfully' };
    } catch (error) {
        console.error('Error appending to S3:', error);
        return { statusCode: 500, body: 'Failed to append log' };
    }
};