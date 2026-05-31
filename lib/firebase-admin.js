import admin from "firebase-admin";
import fs from "fs";
import path from "path";

if (!admin.apps.length) {
    let credential;

    // 1. Try to load service account from environment variable as JSON string
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        try {
            const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            credential = admin.credential.cert(sa);
        } catch (e) {
            console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT env var:", e);
        }
    } 
    // 2. Try individual environment variables
    else if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
        credential = admin.credential.cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        });
    } 
    // 3. Try to read local serviceAccountKey.json if it exists (using fs to avoid static import compiler crashes)
    else {
        const keyPath = path.join(process.cwd(), "lib", "serviceAccountKey.json");
        if (fs.existsSync(keyPath)) {
            try {
                const keyData = JSON.parse(fs.readFileSync(keyPath, "utf8"));
                credential = admin.credential.cert(keyData);
            } catch (e) {
                console.error("Failed to read local serviceAccountKey.json:", e);
            }
        }
    }

    // Fallback to application default credentials (useful in Google Cloud environments)
    if (!credential) {
        try {
            credential = admin.credential.applicationDefault();
        } catch (e) {
            console.warn("No Firebase Admin credentials configured. Server verification may fail.");
        }
    }

    admin.initializeApp({
        credential,
    });
}

export const adminAuth = admin.auth();
export default admin;