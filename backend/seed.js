const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db_main.db");

db.serialize(() => {
  // Insert units
  db.run(`INSERT INTO units (name, type, role, coordinatesLon, coordinatesLat, icon, health, speed, ammo, task)
          VALUES ('Alpha 1', 1, 'infantry', 17.47024, 49.43317, 'friendly_infantry', 100, 5, 1500, '')`);
  
  db.run(`INSERT INTO units (name, type, role, coordinatesLon, coordinatesLat, icon, health, speed, ammo, task)
          VALUES ('Bravo 2', 2, 'armor', 17.4571, 49.42359, 'friendly_armor', 100, 45, 50, '')`);

  db.run(`INSERT INTO units (name, type, role, coordinatesLon, coordinatesLat, icon, health, speed, ammo, task)
          VALUES ('Charlie 3', 3, 'anti-tank', 17.48066, 49.42259, 'friendly_anti_tank', 100, 0, 10, '')`);

  db.run(`INSERT INTO units (name, type, role, coordinatesLon, coordinatesLat, icon, health, speed, ammo, task)
          VALUES ('Delta 4', 1, 'infantry', 17.51199, 49.42800, 'hostile_infantry', 100, 5, 1500, '')`);

  // Insert tasks
  db.run(`INSERT INTO tasks (unit_id, task, status) VALUES (1, 'Move', 'pending')`);
  db.run(`INSERT INTO tasks (unit_id, task, status) VALUES (2, 'Engage', 'pending')`);
  db.run(`INSERT INTO tasks (unit_id, task, status) VALUES (3, 'Hold', 'pending')`);

  console.log("Seeding complete.");
});

db.close();
