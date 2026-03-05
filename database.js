import { app, BrowserWindow } from 'electron';
import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createGymTables } from "./apps/Gym/db/tables.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

let db = null;

export function initDB() {
  const dbPath = path.join(app.getPath('userData'), "app.db");

  db = new Database(dbPath, {
    readonly: false,
    verbose: console.log
  });

  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  console.log("DB Path: ", dbPath);

  // prepare tabels
  createGymTables(db);

  return db;
}

export function getDb() {
  if (!db) {
    console.log("DB IS NOT ACTIVE.... pspspsp sir they hit the second tower");
  }
  return db;
}


