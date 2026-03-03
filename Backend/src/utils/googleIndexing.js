const { google } = require('googleapis');
const path = require('path');

// Point this to where you saved the JSON file in the previous step
const keyPath = path.join(__dirname, '../../config/google-credentials.json');

// Initialize the Google Auth Client
const authClient = new google.auth.GoogleAuth({
  keyFile: keyPath,
  scopes: ['https://www.googleapis.com/auth/indexing'],
});

const notifyGoogle = async (url, action = 'URL_UPDATED') => {
  try {
    // 1. Get the authorized client
    const client = await authClient.getClient();
    const indexing = google.indexing({ version: 'v3', auth: client });

    // 2. Send the URL to Google
    const response = await indexing.urlNotifications.publish({
      requestBody: {
        url: url,
        type: action, // 'URL_UPDATED' for new/edited, 'URL_DELETED' for removed
      },
    });

    console.log(`✅ Google Indexing API Pinged: ${url}`);
    console.log(`   Status: ${response.data.urlNotificationMetadata?.latestUpdate?.type}`);
    return true;

  } catch (error) {
    console.error(`❌ Google Indexing Failed for ${url}:`, error.message);
    return false;
  }
};

module.exports = { notifyGoogle };