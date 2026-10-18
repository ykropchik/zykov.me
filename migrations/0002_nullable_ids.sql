-- visitor_id and session_id are cleared once events are half a year old (see the
-- scheduled handler). SQLite cannot drop NOT NULL in place, so the table is rebuilt.
CREATE TABLE events_new (
	id INTEGER PRIMARY KEY,
	received_at INTEGER NOT NULL,
	ts INTEGER NOT NULL,
	visitor_id TEXT,
	session_id TEXT,
	element TEXT NOT NULL,
	event TEXT NOT NULL,
	props TEXT,
	country TEXT
);

INSERT INTO events_new (id, received_at, ts, visitor_id, session_id, element, event, props, country)
SELECT id, received_at, ts, visitor_id, session_id, element, event, props, country FROM events;

DROP TABLE events;

ALTER TABLE events_new RENAME TO events;
