-- Install PostGIS
-- CREATE EXTENSION postgis;

--
-- PostgreSQL database dump
--

-- Dumped from database version 11.2 (Ubuntu 11.2-1.pgdg16.04+1)
-- Dumped by pg_dump version 11.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY "public"."property" DROP CONSTRAINT IF EXISTS "property_data_type_fkey";
ALTER TABLE IF EXISTS ONLY "public"."property" DROP CONSTRAINT IF EXISTS "property_asset_type_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."project" DROP CONSTRAINT IF EXISTS "project_sponsor_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."asset_property" DROP CONSTRAINT IF EXISTS "asset_property_property_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."asset_property" DROP CONSTRAINT IF EXISTS "asset_property_asset_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."asset" DROP CONSTRAINT IF EXISTS "asset_project_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."asset" DROP CONSTRAINT IF EXISTS "asset_asset_type_id";
ALTER TABLE IF EXISTS ONLY "public"."sponsor" DROP CONSTRAINT IF EXISTS "sponsor_pkey";
ALTER TABLE IF EXISTS ONLY "public"."property" DROP CONSTRAINT IF EXISTS "property_pkey";
ALTER TABLE IF EXISTS ONLY "public"."project" DROP CONSTRAINT IF EXISTS "project_pkey";
ALTER TABLE IF EXISTS ONLY "public"."data_type" DROP CONSTRAINT IF EXISTS "data_type_pkey";
ALTER TABLE IF EXISTS ONLY "public"."asset_type" DROP CONSTRAINT IF EXISTS "asset_type_pkey";
ALTER TABLE IF EXISTS ONLY "public"."asset_property" DROP CONSTRAINT IF EXISTS "asset_property_pkey";
ALTER TABLE IF EXISTS ONLY "public"."asset" DROP CONSTRAINT IF EXISTS "asset_pkey";
ALTER TABLE IF EXISTS "public"."sponsor" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE IF EXISTS "public"."property" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE IF EXISTS "public"."project" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE IF EXISTS "public"."asset_type" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE IF EXISTS "public"."asset" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE IF EXISTS "public"."sponsor_id_seq";
DROP TABLE IF EXISTS "public"."sponsor";
DROP SEQUENCE IF EXISTS "public"."property_id_seq";
DROP TABLE IF EXISTS "public"."property";
DROP SEQUENCE IF EXISTS "public"."project_id_seq";
DROP TABLE IF EXISTS "public"."project";
DROP TABLE IF EXISTS "public"."data_type";
DROP SEQUENCE IF EXISTS "public"."asset_type_id_seq";
DROP TABLE IF EXISTS "public"."asset_type";
DROP TABLE IF EXISTS "public"."asset_property";
DROP SEQUENCE IF EXISTS "public"."asset_id_seq";
DROP VIEW IF EXISTS "public"."asset_expandedlocation";
DROP TABLE IF EXISTS "public"."asset";
DROP FUNCTION IF EXISTS "public"."get_xmlbinary"();
--
-- Name: get_xmlbinary(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION "public"."get_xmlbinary"() RETURNS character varying
    LANGUAGE "plpgsql"
    AS $$
                    DECLARE
                      xmlbin varchar;
                    BEGIN
                      select into xmlbin setting from pg_settings where name='xmlbinary';
                      RETURN xmlbin;
                    END;
                 $$;


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: asset; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."asset" (
    "id" integer NOT NULL,
    "project_id" integer,
    "asset_type_id" integer NOT NULL,
    "location" "public"."geometry"(Point)
);


--
-- Name: asset_expandedlocation; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW "public"."asset_expandedlocation" AS
 SELECT "asset"."id",
    "asset"."project_id",
    "asset"."asset_type_id",
    "public"."st_x"("asset"."location") AS "st_x",
    "public"."st_y"("asset"."location") AS "st_y"
   FROM "public"."asset";


--
-- Name: asset_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."asset_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: asset_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."asset_id_seq" OWNED BY "public"."asset"."id";


--
-- Name: asset_property; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."asset_property" (
    "asset_id" integer NOT NULL,
    "property_id" integer NOT NULL,
    "value" "text" NOT NULL
);


--
-- Name: asset_type; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."asset_type" (
    "id" integer NOT NULL,
    "name" character varying(50) NOT NULL,
    "description" "text"
);


--
-- Name: asset_type_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."asset_type_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: asset_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."asset_type_id_seq" OWNED BY "public"."asset_type"."id";


--
-- Name: data_type; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."data_type" (
    "name" character varying(50) NOT NULL
);


--
-- Name: project; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."project" (
    "id" integer NOT NULL,
    "sponsor_id" integer NOT NULL,
    "name" character varying NOT NULL,
    "description" "text",
    "region" "polygon"[]
);


--
-- Name: project_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."project_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: project_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."project_id_seq" OWNED BY "public"."project"."id";


--
-- Name: property; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."property" (
    "id" integer NOT NULL,
    "asset_type_id" integer NOT NULL,
    "data_type" character varying(50) NOT NULL,
    "name" character varying(50) NOT NULL,
    "required" boolean DEFAULT false NOT NULL,
    "is_private" boolean DEFAULT false NOT NULL
);


--
-- Name: property_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."property_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: property_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."property_id_seq" OWNED BY "public"."property"."id";


--
-- Name: sponsor; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."sponsor" (
    "id" integer NOT NULL,
    "name" character varying(50) NOT NULL,
    "description" "text",
    "location" "point"
);


--
-- Name: sponsor_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."sponsor_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sponsor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."sponsor_id_seq" OWNED BY "public"."sponsor"."id";


--
-- Name: asset id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."asset" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."asset_id_seq"'::"regclass");


--
-- Name: asset_type id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."asset_type" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."asset_type_id_seq"'::"regclass");


--
-- Name: project id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."project" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."project_id_seq"'::"regclass");


--
-- Name: property id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."property" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."property_id_seq"'::"regclass");


--
-- Name: sponsor id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."sponsor" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."sponsor_id_seq"'::"regclass");


--
-- Name: asset asset_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."asset"
    ADD CONSTRAINT "asset_pkey" PRIMARY KEY ("id");


--
-- Name: asset_property asset_property_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."asset_property"
    ADD CONSTRAINT "asset_property_pkey" PRIMARY KEY ("asset_id", "property_id");


--
-- Name: asset_type asset_type_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."asset_type"
    ADD CONSTRAINT "asset_type_pkey" PRIMARY KEY ("id");


--
-- Name: data_type data_type_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."data_type"
    ADD CONSTRAINT "data_type_pkey" PRIMARY KEY ("name");


--
-- Name: project project_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."project"
    ADD CONSTRAINT "project_pkey" PRIMARY KEY ("id");


--
-- Name: property property_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."property"
    ADD CONSTRAINT "property_pkey" PRIMARY KEY ("id");


--
-- Name: sponsor sponsor_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."sponsor"
    ADD CONSTRAINT "sponsor_pkey" PRIMARY KEY ("id");


--
-- Name: asset asset_asset_type_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."asset"
    ADD CONSTRAINT "asset_asset_type_id" FOREIGN KEY ("asset_type_id") REFERENCES "public"."asset_type"("id") ON DELETE RESTRICT;


--
-- Name: asset asset_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."asset"
    ADD CONSTRAINT "asset_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id");


--
-- Name: asset_property asset_property_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."asset_property"
    ADD CONSTRAINT "asset_property_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "public"."asset"("id") ON DELETE RESTRICT;


--
-- Name: asset_property asset_property_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."asset_property"
    ADD CONSTRAINT "asset_property_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE RESTRICT;


--
-- Name: project project_sponsor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."project"
    ADD CONSTRAINT "project_sponsor_id_fkey" FOREIGN KEY ("sponsor_id") REFERENCES "public"."sponsor"("id") ON DELETE RESTRICT;


--
-- Name: property property_asset_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."property"
    ADD CONSTRAINT "property_asset_type_id_fkey" FOREIGN KEY ("asset_type_id") REFERENCES "public"."asset_type"("id") ON DELETE RESTRICT;


--
-- Name: property property_data_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."property"
    ADD CONSTRAINT "property_data_type_fkey" FOREIGN KEY ("data_type") REFERENCES "public"."data_type"("name") ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

