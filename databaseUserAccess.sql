-- give the "admin" user full privleges
CREATE USER 'admin'@'%' IDENTIFIED BY 'adminPassword';
GRANT SELECT, INSERT, UPDATE, DELETE ON mydatabase.* TO 'admin'@'%';

-- give the "database manager" user full privleges
CREATE USER 'database_manager'@'%' IDENTIFIED BY 'managerPassword';
GRANT ALL PRIVLEGES ON *.* TO TO 'database_manager'@'%';


-- apply the changes
FLUSH PRIVILEGES;

-- mysql -h cpsc4910-team22-db.cobd8enwsupz.us-east-1.rds.amazonaws.com -P 3306 -u admin -p ***password***
-- then once the sql is entered add this