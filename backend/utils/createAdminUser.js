const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const bcrypt = require("bcrypt");
require("dotenv").config({ path: "../.env" });
//console.log("ADMIN_USERNAME:", process.env.ADMIN_USERNAME);//debug
//console.log("ADMIN_PASSWORD:", process.env.ADMIN_PASSWORD);//debug

// connect DynamoDB
const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const dynamoDB = DynamoDBDocumentClient.from(client);

async function createAdminUser() {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
        console.error("Error: Missing ADMIN_USERNAME or ADMIN_PASSWORD in .env file.");
        process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const params = {
        TableName: process.env.DYNAMODB_USERS_TABLE || "UsersTable",
        Item: {
            username,
            password: hashedPassword,
            role: "admin",
        },
    };

    try {
        await dynamoDB.send(new PutCommand(params));
        console.log(`Admin user ${username} created successfully!`);
    } catch (error) {
        console.error("Error creating admin user:", error);
    }
}

createAdminUser();