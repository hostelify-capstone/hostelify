import { collection } from "firebase/firestore";
import { db } from "./config";

export const collections = {
  users: collection(db, "users"),
  complaints: collection(db, "complaints"),
  notices: collection(db, "notices"),
  rooms: collection(db, "rooms"),
  fees: collection(db, "fees"),
  messMenu: collection(db, "messMenu"),
  messFeedback: collection(db, "messFeedback"),
  gatePasses: collection(db, "gatePasses"),
  roomRequests: collection(db, "roomRequests"),
  pendingVerifications: collection(db, "pendingVerifications"),
};