CREATE TABLE IF NOT EXISTS analyses (
  id SERIAL PRIMARY KEY,
  resume_text TEXT NOT NULL,
  job_description TEXT NOT NULL,
  score INTEGER NOT NULL,
  missing_skills JSONB,
  feedback JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
