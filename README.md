# hoshizora.sql

1. Clone the repository and change the current working directory:
```
git clone https://github.com/VocaDB/hoshizora.sql.git
cd hoshizora.sql
```
2. Download `dump.zip`, and unzip it.
3. Create a `.env` file with the following content:
```
MIKRO_ORM_TYPE = mariadb
MIKRO_ORM_DB_NAME = vocaloid_site
MIKRO_ORM_DEBUG = true
MIKRO_ORM_USER = 
MIKRO_ORM_PASSWORD = 
MIKRO_ORM_ENTITIES = ./dist/entities/**/*.js
MIKRO_ORM_ENTITIES_TS = ./src/entities/**/*.ts
MIKRO_ORM_MIGRATIONS_PATH = ./src/migrations
MIKRO_ORM_MIGRATIONS_DISABLE_FOREIGN_KEYS = false
MIKRO_ORM_SCHEMA_GENERATOR_DISABLE_FOREIGN_KEYS = false
MIKRO_ORM_FORCE_UNDEFINED = true
MIKRO_ORM_FORCE_UTC_TIMEZONE = true
MIKRO_ORM_ALLOW_GLOBAL_CONTEXT = false
MIKRO_ORM_AUTO_JOIN_ONE_TO_ONE_OWNER = false
```
4. Run the following commands:
```
yarn
yarn build
yarn mikro-orm migration:up
yarn start
```
