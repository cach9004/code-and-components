--
-- PostgreSQL database dump
--

SET statement_timeout
= 0;
SET lock_timeout
= 0;
SET client_encoding
= 'UTF8';
SET standard_conforming_strings
= on;
SET check_function_bodies
= false;
SET client_min_messages
= warning;



SET default_tablespace
= '';

SET default_with_oids
= false;

DROP TABLE IF EXISTS doctors;
DROP TABLE IF EXISTS ratings;
DROP TABLE IF EXISTS search_history;
DROP TABLE IF EXISTS visitors;

CREATE TABLE doctors
(
  docter_id smallint,
  name character varying
(50) NOT NULL,
  password_dr character varying
(50),
  username_dr character varying
(255) NOT NULL UNIQUE,
  phone_number character varying
(12),
  email_name character varying
(50) NOT NULL UNIQUE,
  picture bytea not NUll,
  location character varying
(60),
  gender character varying
(5) not null,
  spacalty character varying
(50) NOT NULL,
  photo_path character varying
(255)
);

CREATE TABLE ratings
(
  Docter_id smallint,
  visitor_id INT
  [],
  Actual_Rating DECIMAL,
  total_rating smallint,
  total_num_rating smallint
);

  CREATE TABLE visitors
  (
    visitor_id smallint,
    name character varying(50) NOT NULL,
    username character varying(50) NOT NULL UNIQUE,
    password_visitor character varying(50),
    phone_number character varying(12),
    email_name character varying
  (50) NOT NULL UNIQUE,
    picture bytea,
    location character varying
  (60),
    gender character varying
  (5) not null,
    Rating_id smallint
  );


  CREATE TABLE search_history
  (
    Visitor_id smallint,
    Docter_id smallint,
    spachalty character varying
  (50) NOT NULL
  );
  -- /*
  -- TABLE: Doctors, TAKES IN: Docter_id, name, password_dr, username_dr, phone_number, email_name, picture, location, gender, spacalty
  -- */
  INSERT INTO doctors
  VALUES(1, 'John Smith', '123456', 'johnsmith', '7205689543', 'john_smith@gmail.com', '\x', '10 locus street', 'M', 'Cardiologe', '\x');


  -- /*
  -- TABLE: Ratings, TAKES IN: Visitor_id, Actual_Rating, total_rating, total_num_rating, Docter_id
  -- */
  INSERT INTO ratings
  VALUES(1, array
  [1], 4.3, 43, 10 );


  -- /*
  -- TABLE: Visitor, TAKES IN: Visitor_id,name, username, password_visitor, phone_number, email name, picture, location, gender, Rating_id
  -- */
  INSERT INTO visitors
  VALUES(1, 'Adamie John', 'adamie_john', '12345', '7205678', 'adamie_john@gmail.com', '/x', '10th madrid street', 'F', 1);


  -- /*
  -- TABLE: Serach, TAKES IN:  Visitor_id, Docter_id, spachalty
  -- */
  INSERT INTO search_history
  VALUES(1, 1, '\x');


-- /* ___________________Other tables not in use___________________*/

-- # create table if not exists Search (
-- #   spachalty character varying(50) NOT NULL, 
-- #   Doctor_id smallint,       					       /* unique id for each doctor */
-- #   location address,	
-- #   ailment  character varying(50) NOT NULL,
-- #   cost smallint,
-- #   age smallint,
-- #   years_of_experiranice smallint,
-- #   /*procimity,*/
-- #   /*avalibility*/
-- # );

-- # CREATE TABLE IF NOT EXISTS Registration (
-- # 	Visitor_id smallint,       		           /* unique id for each visitor */
-- #   Docter_id smallint,      					/* the id to assine the rating too */
-- #   password_visitor smallint,                /* the doctores password */
-- #   password_Dr int,   							         /* the doctores password */
-- #   usernameDr character varying(50) NOT NULL,      /* there user name for prefoming there own searches*/  
-- #   usernameV character varying(50) NOT NULL           /* there user name for prefoming there own searches*/
-- # );