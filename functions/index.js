const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.saveSharedDashboardAnalytics = functions.https.onCall(async (data, context) => {
  const { userId, callId, analyticsData } = data;

  if (!userId || !callId || !analyticsData) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required parameters');
  }

  try {
    const userRef = admin.firestore().collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'User not found');
    }

    await userRef.update({
      [`analytics.${callId}`]: analyticsData
    });

    return { success: true };
  } catch (error) {
    console.error('Error saving shared dashboard analytics:', error);
    throw new functions.https.HttpsError('internal', 'Error saving analytics');
  }
});