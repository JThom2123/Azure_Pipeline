-- give the "admin" user full privleges
CREATE USER 'admin'@'%' IDENTIFIED BY 'adminPassword';
GRANT ALL PRIVLEGES ON *.* TO 'admin'@'%' WITH GRANT OPTION;

-- give the "database manager" user full privleges
CREATE USER 'database_manager'@'%' IDENTIFIED BY 'managerPassword';
GRANT ALL PRIVLEGES ON *.* TO TO 'database_manager'@'%';


-- apply the changes
FLUSH PRIVILEGES;