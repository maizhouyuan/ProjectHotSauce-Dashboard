const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, QueryCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const addNote = async (sensorId, content, author = 'Anonymous') => {
    try {
        const noteId = uuidv4();
        const timestamp = new Date().toISOString();
        
        const params = {
            TableName: 'SensorNotes',
            Item: {
                SensorId: sensorId,
                NoteId: noteId,
                Content: content,
                Author: author,
                CreatedAt: timestamp,
                UpdatedAt: timestamp
            }
        };

        await docClient.send(new PutCommand(params));
        return {
            success: true,
            noteId,
            message: 'Note added successfully'
        };
    } catch (error) {
        console.error('Error adding note:', error);
        throw error;
    }
};

const getNotes = async (sensorId) => {
    try {
        const params = {
            TableName: 'SensorNotes',
            KeyConditionExpression: 'SensorId = :sensorId',
            ExpressionAttributeValues: {
                ':sensorId': sensorId
            },
            ScanIndexForward: false // Get most recent notes first
        };

        const response = await docClient.send(new QueryCommand(params));
        return response.Items || [];
    } catch (error) {
        console.error('Error getting notes:', error);
        throw error;
    }
};

const deleteNote = async (sensorId, noteId) => {
    try {
        const params = {
            TableName: 'SensorNotes',
            Key: {
                SensorId: sensorId,
                NoteId: noteId
            }
        };

        await docClient.send(new DeleteCommand(params));
        return {
            success: true,
            message: 'Note deleted successfully'
        };
    } catch (error) {
        console.error('Error deleting note:', error);
        throw error;
    }
};

module.exports = {
    addNote,
    getNotes,
    deleteNote
}; 