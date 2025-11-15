
import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export function getDb() {
  if (!admin.apps.length) {
    if (!process.env.FIREBASE_PRIVATE_KEY_B64) {
      throw new Error('The FIREBASE_PRIVATE_KEY_B64 environment variable is not set.');
    }
    const privateKey = Buffer.from(process.env.FIREBASE_PRIVATE_KEY_B64, 'base64').toString('utf-8');
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
    });
  }
  return admin.firestore();
}
