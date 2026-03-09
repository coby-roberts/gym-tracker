import { app } from "electron";
import Database from "better-sqlite3";
import path from "node:path";

import { createGymTables } from "./apps/Gym/db/tables.js";

let db = null;

export function initDB() {
  const dbPath = path.join(app.getPath("userData"), "app.db");

  db = new Database(dbPath, {
    readonly: false,
    verbose: console.log,
  });

  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  console.log("DB Path: ", dbPath);

  createGymTables(db);

  return db;
}

export function getDb() {
  if (!db) {
    console.log("DB IS NOT ACTIVE.... pspspsp sir they hit the second tower");
  }
  return db;
}
