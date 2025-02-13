-- initialize the table --

create TABLE about_page (
    section_name VARCHAR(255),
    content TEXT,
    last_updated TIMESTAMP default current_timestamp on update current_timestamp
);

-- Basic table filling queries to populate our about page table --

Insert into about_page (section_name, content)
Values ('Version Number', '0.0.1');

insert into about_page (section_name, content)
values ('team_number', '22');

insert into about_page (section_name, content)
values ('release_date', '2/13/2025');

insert into about_page (section_name, content)
values ('product_name', 'Not Yet Decided');

insert into about_page (section_name, content)
values ('product_description', 'Hi there. Our Product Tracks you. Everywhere. No matter where you go. You cannot escape. No matter what you do. You are now a trucker for life.');

-- modifying rows --

update about_page
set content = 'Hi there. Our Product Tracks you. Everywhere. No matter where you go. You cannot escape. No matter what you do. You are now a trucker for life. A mother trucker.'
where section_name = 'product_description'; 

-- Show the table --

SELECT * FROM Team22DB.about_page;