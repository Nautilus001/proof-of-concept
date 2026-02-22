/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from "firebase-functions";
import {logger} from "firebase-functions";

export const helloWorld = functions.https.onCall((data, context)=> {
  logger.info("Hello logs!", {structureData: true});
  return {message: "Hello from Firebase!"};
});
