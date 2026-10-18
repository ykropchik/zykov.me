-- No secondary indexes yet: D1 bills every index update as one more written row,
-- so each one would halve how many events fit into the free daily limit.
CREATE TABLE events (
	id INTEGER PRIMARY KEY,
	received_at INTEGER NOT NULL,
	ts INTEGER NOT NULL,
	visitor_id TEXT NOT NULL,
	session_id TEXT NOT NULL,
	element TEXT NOT NULL,
	event TEXT NOT NULL,
	props TEXT,
	country TEXT
);

CREATE TABLE daily_budget (
	day TEXT PRIMARY KEY,
	events INTEGER NOT NULL
);
