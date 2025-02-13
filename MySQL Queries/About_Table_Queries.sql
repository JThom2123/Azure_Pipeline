-- This is a basic insert query
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

-- display the table
SELECT * FROM Team22DB.about_page;