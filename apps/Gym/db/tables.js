export function createGymTables(db) {

  db.prepare(`
    CREATE TABLE IF NOT EXISTS gym_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS gym_session_exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER,
      exercise_id INTEGER,
      FOREIGN KEY(session_id) REFERENCES gym_sessions(id) ON DELETE CASCADE,
      FOREIGN KEY(exercise_id) REFERENCES gym_exercise(id)
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS gym_session_sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      gym_session_exercise_id INTEGER,
      weight REAL NOT NULL,
      reps INTEGER NOT NULL,
      FOREIGN KEY(gym_session_exercise_id) REFERENCES gym_session_exercises(id) ON DELETE CASCADE
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS gym_exercise (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS gym_muscles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS gym_exercise_muscles(
      exercise_id INTEGER,
      muscle_id INTEGER,
      PRIMARY KEY (exercise_id, muscle_id),
      FOREIGN KEY (exercise_id) REFERENCES gym_exercise(id) ON DELETE CASCADE,
      FOREIGN KEY (muscle_id) REFERENCES gym_muscles(id)
    )
  `).run();
}
