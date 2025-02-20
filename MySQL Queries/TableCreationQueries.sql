
create table Team22DB.audit_logs (logID INT primary key);
create table Team22DB.users(userID int primary key, 
	userType enum('admin', 'driver', 'sponsor') NOT NULL,
    username varchar(20) not null);
create table Team22DB.admin_users (userID int primary key);
create table Team22DB.sponsor_users (userID int primary key);

-- driver users are the only account to have points
create table Team22DB.driver_users (userID int primary key);
create table Team22DB.application (appID int primary key);
create table Team22DB.organizations (orgID int primary key, 
	orgName varchar(50) NOT NULL);
create table Team22DB.catalogue (catItemID int primary key, 
	orgID int not null, -- This is the org catalogue an item is in --
    itemName varchar(50) not null, 
    itemPrice decimal(10, 2) not null);
create table Team22DB.notifications (notifID int primary key,
	-- The user that the notif goes to. Might change type, given one notif can be sent to a ton of users.
	userID int, 
	notifName varchar(20),
    notifDesc TEXT);
    -- This table keeps track of what events have been used for a given user's point history.
create table Team22DB.point_history (pointEventID int primary key, 
	userID int, -- Easier if you just read as driver ID. This should only ever be a driver.
    eventID int,
    prevVal decimal(10, 2),
    newVal decimal(10, 2),
    pointEventDate timestamp default current_timestamp);
    
    -- This table contains events to be triggered. An admin can create an event on the spot to 
    -- adjust point amount, but they cannot edit points directly -> they must create an event
create table Team22DB.point_events(
	eventID int primary key,
    eventName varchar(20),
    eventDesc TEXT,
    -- value to be added (or subtracted) when event is triggered
    eventValue decimal(10, 2));
    
    -- We could keep this as a table, but I'm also 
    -- thinking we could make this a dynamic event 
    -- with generated text? It would be great if we 
    -- could merge it with the point history table.
create table Team22DB.purchase_history (purchaseID int primary key,
	catItemID int,
    prevVal decimal(10, 2),
    newVal decimal(10, 2));