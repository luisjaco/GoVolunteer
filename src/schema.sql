-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.categories (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name character varying NOT NULL,
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.events (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  category_id bigint NOT NULL,
  description text NOT NULL,
  state text NOT NULL,
  city text NOT NULL,
  max_volunteers smallint NOT NULL CHECK (max_volunteers > 0),
  current_volunteers smallint DEFAULT '0'::smallint,
  image_url text,
  date_time timestamp with time zone NOT NULL,
  organization_id uuid DEFAULT gen_random_uuid(),
  name text NOT NULL,
  CONSTRAINT events_pkey PRIMARY KEY (id),
  CONSTRAINT events_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.users(id),
  CONSTRAINT events_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id)
);
CREATE TABLE public.organizations (
  title text NOT NULL,
  phone character varying NOT NULL UNIQUE CHECK (phone::text ~ '^\d{3}-\d{3}-\d{4}$'::text),
  organization_url text NOT NULL,
  state character varying NOT NULL,
  city text NOT NULL,
  address text,
  description text,
  profile_picture_url text,
  user_id uuid NOT NULL,
  motto text,
  CONSTRAINT organizations_pkey PRIMARY KEY (user_id),
  CONSTRAINT organizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.rsvps (
  event_id bigint NOT NULL,
  volunteer_id uuid NOT NULL,
  CONSTRAINT rsvps_pkey PRIMARY KEY (event_id, volunteer_id),
  CONSTRAINT rsvps_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id),
  CONSTRAINT rsvps_volunteer_id_fkey FOREIGN KEY (volunteer_id) REFERENCES public.users(id)
);
CREATE TABLE public.users (
  email text NOT NULL UNIQUE,
  is_organization boolean NOT NULL DEFAULT false,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT users_pkey PRIMARY KEY (id)
);
CREATE TABLE public.volunteers (
  first_name character varying NOT NULL,
  last_name character varying NOT NULL,
  phone character varying UNIQUE CHECK (phone::text ~ '^\d{3}-\d{3}-\d{4}$'::text),
  age smallint CHECK (age > 0),
  gender USER-DEFINED,
  profile_picture_url text,
  user_id uuid NOT NULL,
  CONSTRAINT volunteers_pkey PRIMARY KEY (user_id),
  CONSTRAINT volunteers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
