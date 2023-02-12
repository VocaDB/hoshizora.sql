# hoshizora.sql

## Prerequisites

-   [Node.js](https://nodejs.org/en/) (18.12.1 LTS)
-   [yarn](https://yarnpkg.com/) (1.22.19)
-   [MariaDB](https://mariadb.org/) (10.4.22)

## Usage

1. Clone the repository and change the current working directory:

```
git clone https://github.com/VocaDB/hoshizora.sql.git
cd hoshizora.sql
```

2. Download `dump.zip`, and unzip it.
3. Run the following commands:

```
yarn
yarn build
yarn start
mariadb -u root vocaloid_site < ./output/mariadb.sql
```
