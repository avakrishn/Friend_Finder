DROP DATABASE IF EXISTS Friend_Finder_db;
CREATE DATABASE Friend_Finder_db;
USE Friend_Finder_db;

CREATE TABLE users(
	id INT NOT NULL AUTO_INCREMENT,
	username VARCHAR(255) NOT NULL, 
    picture_link TEXT NOT NULL,
	date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (id)
);

CREATE TABLE user_answers(
    users_id INT NOT NULL,
    q_1 INT NOT NULL,
    q_2 INT NOT NULL,
    q_3 INT NOT NULL,
    q_4 INT NOT NULL,
    q_5 INT NOT NULL,
    q_6 INT NOT NULL,
    q_7 INT NOT NULL,
    q_8 INT NOT NULL,
    q_9 INT NOT NULL,
    q_10 INT NOT NULL,
	FOREIGN KEY (users_id) REFERENCES users(id)   
);
