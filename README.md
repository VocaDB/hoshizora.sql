# hoshizora.sql

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

```
yarn
yarn build
yarn mikro-orm migration:up
yarn start
```
