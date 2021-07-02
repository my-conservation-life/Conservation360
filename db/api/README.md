# Conservation360 api's

## Development

#### Install all dependecies using

`npm install -s`

#### PostgreSQL DB Configaration

enter psql interactive postgres terminal\
`sudo -i -u postgres`

connect to postgres database as postgres user\
`psql postgres`

connect to your existing database or create a new one

- existing\
  `\c <your_database>`

- new one\
  `CREATE DATABASE conservation360;`

download the [schema.sql](https://github.com/my-conservation-life/Conservation360/blob/dev/db/schema/schema.sql) file or if you have downloaded the git repo this file can be found at `Conservation360/db/schema/`

execute the schema.sql file using\
`\i \<path_to_schema.sql>\schema.sql`\
this will create MyConservationLife Schema on your postgres server and load the database with the sample data

#### Setup environment variables

create a `.env` file add following variables

```
PORT=5000
DATABASE_URL=postgres://<postgres_user>:<password>@localhost:5432/<database_name>
```

#### Run the development server using

`npm start`

- The development server will be available at `http://127.0.0.1:5000`
- Base path `/api/v1/`
- A sample get route `http://127.0.0.1:5000/api/v1/projects`
- Refer [Docs](https://github.com/my-conservation-life/Conservation360/tree/dev/db/docs) to learn more about api's
