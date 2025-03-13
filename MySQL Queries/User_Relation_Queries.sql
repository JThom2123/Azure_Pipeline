CREATE TABLE user_Relationships (
    relationship_id SERIAL PRIMARY KEY, 								-- Optional auto-incrementing ID for easier handling
    email_1 VARCHAR(30) NOT NULL, 										-- Represents one user in the relationship (e.g., sponsor)
    email_2 VARCHAR(30) NOT NULL, 										-- Represents the other user (e.g., driver)
    relationship_type VARCHAR(50) NOT NULL, 							-- Describes the type of relationship (e.g., 'sponsor-driver')
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 					-- Tracks when the relationship was created
    FOREIGN KEY (email_1) REFERENCES users(email) ON DELETE CASCADE, 	-- Links to the users table
    FOREIGN KEY (email_2) REFERENCES users(email) ON DELETE CASCADE 	-- Links to the users table
);

INSERT INTO user_Relationships (email_1, email_2, relationship_type)
SELECT s.email, d.email, 'sponsor-driver'
FROM users s, users d
WHERE s.email = 'sponsor@email.com' AND s.userType = 'sponsor'
  AND d.email = 'driver@email.com' AND d.userType = 'driver';

SELECT * FROM Team22DB.user_Relationships;

-- Find drivers of a given sponsor --
SELECT u.*
FROM user_Relationships r
JOIN users u ON r.email_2 = u.email
WHERE r.email_1 = 'sponsor@email.com' AND r.relationship_type = 'sponsor-driver';

-- find sponsors of a given driver --
SELECT u.*
FROM user_Relationships r
JOIN users u ON r.email_1 = u.email
WHERE r.email_2 = 'driver@email.com' AND r.relationship_type = 'sponsor-driver';

