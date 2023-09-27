const agora = require('agora-access-token');
const agoraConfig = require('../config/agoraconfig'); 

function authenticateUser(email) {
    // Replace this with your authentication logic
    // Check if the provided email is valid and exists in your system
    // Retrieve the user's unique ID or any other user data based on the email

    // For this example, we'll assume a simple check where the email must not be empty
    if (!email) {
        return null; // Return null to indicate authentication failure
    }

    // You can replace this with your logic to retrieve the user's unique ID or data
    const userId = email; // For simplicity, we'll use the email as the user's unique ID

    return userId;
}

function generateToken(email) {
    // Authenticate the user and get their unique ID
    const userId = authenticateUser(email);

    if (!userId) {
        throw new Error('Authentication failed. Invalid email.');
    }

    const expirationTimeInSeconds = 3600; // Token expiration time (1 hour)
    const role = agora.RtcRole.PUBLISHER; // Token role

    const token = agora.RtcTokenBuilder.buildTokenWithUid(
        agoraConfig.agoraAppId,
        agoraConfig.agoraAppCertificate,
        agoraConfig.channelName,
        userId, // Use the user's unique ID (email in this case) as the UID
        role,
        expirationTimeInSeconds
    );

    return token;
}

module.exports = { generateToken };