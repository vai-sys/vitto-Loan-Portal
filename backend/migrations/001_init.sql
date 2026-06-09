CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    purpose TEXT NOT NULL,
    language VARCHAR(50) NOT NULL,

    status VARCHAR(20)
    CHECK (status IN ('pending','approved','rejected'))
    DEFAULT 'pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);