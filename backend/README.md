<div align="center">
  <img src="../assets/logo_200w.jpeg" width="200">
</div>
<p>

<div align="center"><p>
<h1>Pattern Research Assignment</h1><p>
<h2>Backend</h2>
<img src="https://img.shields.io/badge/%3E=typescript-4.0-blue.svg" alt="TypeScript compat">

</div>

# Objective

This document discusses the project organization, design principles / philosophies and implementation details, decisions and again, design principles / philosophies.

# DevOpsSec

Attempts to make sure the application is 'secured' at a code level is done by encapsulating the secrets needed to run the application in a [`Secret<T>`](./src/vendors/jacob-bot-common/dist/src/secret.d.ts#Secret) class.

The class counts the number of times the secret has been 'exposed' (via calls to its method `.exposeSecret()`) and one can set a maximum number of times it can be exposed.

The exposed secret is redacted when logged.

# Decision One

Chose to use `typeorm` as Object-Relational Mapper, instead of `prisma`.

Error:

```
Inconsistent column data: Conversion failed: Value 288230377817712534 does not fit in an INT column, try migrating the 'order_id' column type to BIGINT
    at _n.handleRequestError (/root/typescript_projects/pattern-research-jul-24/node_modules/@prisma/client/runtime/library.js:121:7749)
    at _n.handleAndLogRequestError (/root/typescript_projects/pattern-research-jul-24/node_modules/@prisma/client/runtime/library.js:121:7057)
    at _n.request (/root/typescript_projects/pattern-research-jul-24/node_modules/@prisma/client/runtime/library.js:121:6741)
    at async l (/root/typescript_projects/pattern-research-jul-24/node_modules/@prisma/client/runtime/library.js:130:9355)
    at async checkDatabaseIsSetUp (/root/typescript_projects/pattern-research-jul-24/backend/build-dev/src/bin/main.js:12:27)
    at async bootstrap (/root/typescript_projects/pattern-research-jul-24/backend/build-dev/src/bin/main.js:25:5) {
  code: 'P2023',
  clientVersion: '5.17.0',
  meta: {
    modelName: 'Fills',
    message: "Conversion failed: Value 288230377817712534 does not fit in an INT column, try migrating the 'order_id' column type to BIGINT"
  }
}
```

GitHub Issues:

https://github.com/prisma/prisma/issues/13178
https://github.com/prisma/prisma/issues/23865
https://github.com/prisma/prisma/issues/18532

# How to Use

## Basic Commands

```
npm run run-dev
```

The `npm run run-dev` commands directly attempts to run the application in the `dev` environment.

The logs when running this command should look like so:

```
backend# npm run run-dev

> backend@0.1.0 run-dev
> npm run build-dev && dotenv -e secrets/.db.development -e .env.development -- node build-dev/src/bin/main.js


> backend@0.1.0 build-dev
> bash scripts/npm-build.sh development

[npm-build.sh::INFO] `TS_CONFIG_FILENAME` = `tsconfig.build-dev`

> backend@0.1.0 copy-files-dev
> bash scripts/copyfiles.sh development

Copying files for development...
[npm-build.sh::INFO] Calling copyfiles.sh for development...
[npm-build.sh::INFO] Since `NODE_ENV = 'development'`, no minification of transpiled JS files is done!
[npm-build.sh::INFO] Making logs directory in ./build-dev/development_logs
Copying files for development...
`databaseFilePath` exists and is at /root/typescript_projects/pattern-research-jul-24/backend/db/trades.sqlite
[Nest] 2509595  - 07/28/2024, 4:58:32 PM     LOG [NestFactory] Starting Nest application...
[Nest] 2509595  - 07/28/2024, 4:58:32 PM     LOG [InstanceLoader] TypeOrmModule dependencies initialized +18ms
[Nest] 2509595  - 07/28/2024, 4:58:32 PM     LOG [InstanceLoader] AppModule dependencies initialized +0ms
[Nest] 2509595  - 07/28/2024, 4:58:32 PM     LOG [InstanceLoader] TypeOrmCoreModule dependencies initialized +34ms
[Nest] 2509595  - 07/28/2024, 4:58:32 PM     LOG [InstanceLoader] TypeOrmModule dependencies initialized +0ms
[Nest] 2509595  - 07/28/2024, 4:58:32 PM     LOG [InstanceLoader] FillsModule dependencies initialized +2ms
[Nest] 2509595  - 07/28/2024, 4:58:32 PM     LOG [RoutesResolver] AppController {/}: +7ms
[Nest] 2509595  - 07/28/2024, 4:58:32 PM     LOG [RouterExplorer] Mapped {/api/health, GET} route +4ms
[Nest] 2509595  - 07/28/2024, 4:58:32 PM     LOG [RoutesResolver] FillsController {/fills}: +1ms
[Nest] 2509595  - 07/28/2024, 4:58:32 PM     LOG [RouterExplorer] Mapped {/fills, POST} route +1ms
[Nest] 2509595  - 07/28/2024, 4:58:32 PM     LOG [RouterExplorer] Mapped {/fills, GET} route +1ms
[Nest] 2509595  - 07/28/2024, 4:58:32 PM     LOG [RouterExplorer] Mapped {/fills/count, GET} route +2ms
[Nest] 2509595  - 07/28/2024, 4:58:32 PM     LOG [RouterExplorer] Mapped {/fills/pnl, GET} route +1ms
[Nest] 2509595  - 07/28/2024, 4:58:32 PM     LOG [RouterExplorer] Mapped {/fills/:id, GET} route +1ms
[Nest] 2509595  - 07/28/2024, 4:58:32 PM     LOG [RouterExplorer] Mapped {/fills/:id, PATCH} route +0ms
[Nest] 2509595  - 07/28/2024, 4:58:32 PM     LOG [RouterExplorer] Mapped {/fills/:id, DELETE} route +0ms
[Nest] 2509595  - 07/28/2024, 4:58:32 PM     LOG [NestApplication] Nest application successfully started +21ms
```

Once this is done, you can try the following command to see if it works:

```
curl -X GET "http://localhost:3000/fills/pnl?exchange=BINANCE&symbol=BTC-PERPETUAL&groupBy=day&startDate=2022-10-17T00:00:00Z&endDate=2022-10-17T23:59:59Z"
```

This should return:

```
[{"time_group":"2022-10-17","pnl":18324224.01806435}]
```

## Development

For **LOCAL** development, you can run `npm run watch-dev`, which will launch the application in `development` environment and reload when there are any file changes.

For deploying in `development` environment, you can run `npm run run-dev`, which will launch the application in `development` environment but it will not reload to any code changes.

# Stratchpad

## Useful SQL Queries

```sql
WITH RunningTotals AS (
    SELECT
        timestamp,
        datetime(timestamp / 1000000, 'unixepoch') AS datetime,
        strftime('%Y-%m-%d', datetime(timestamp / 1000000, 'unixepoch')) AS time_group,
        fill_price,
        fill_quantity,
        side,
        fees,
        SUM(CASE WHEN side = 'BUY' THEN fill_quantity ELSE 0 END) OVER (PARTITION BY symbol, exchange ORDER BY timestamp) - 
        SUM(CASE WHEN side = 'SELL' THEN fill_quantity ELSE 0 END) OVER (PARTITION BY symbol, exchange ORDER BY timestamp) AS net_quantity,
        SUM(CASE WHEN side = 'BUY' THEN fill_quantity * fill_price ELSE 0 END) OVER (PARTITION BY symbol, exchange ORDER BY timestamp) - 
        SUM(CASE WHEN side = 'SELL' THEN fill_quantity * fill_price ELSE 0 END) OVER (PARTITION BY symbol, exchange ORDER BY timestamp) AS net_value
    FROM fills
    WHERE 
        exchange = 'BINANCE' AND
        symbol = 'BTC-PERPETUAL' AND
        datetime(timestamp / 1000000, 'unixepoch') >= '2022-10-17 00:00:00' AND 
        datetime(timestamp / 1000000, 'unixepoch') <= '2022-10-17 23:59:59'
)
SELECT
    time_group,
    SUM(CASE WHEN side = 'SELL' THEN fill_quantity * (fill_price - (net_value / net_quantity)) ELSE 0 END) - SUM(fees) AS pnl
FROM RunningTotals
GROUP BY time_group
ORDER BY time_group ASC;
```

``` sql 
SELECT strftime('%Y-%m-%d', datetime("fills"."timestamp" / 1000000, 'unixepoch')) AS time_group, fill_price, fill_quantity, side, fees
FROM "fills" 
WHERE "fills"."exchange" = 'BINANCE'
AND "fills"."symbol" = 'BTC-PERPETUAL'
AND datetime("fills"."timestamp" / 1000000, 'unixepoch') >= '2022-10-17 00:00:00.000' 
AND datetime("fills"."timestamp" / 1000000, 'unixepoch') <= '2022-10-17 23:59:59.000'
GROUP BY time_group, side ORDER BY time_group ASC;
```

```
WITH RunningTotals AS (
      SELECT
          timestamp,
          datetime(timestamp / 1000000, 'unixepoch') AS datetime,
          strftime('%Y-%m-%d %H:%M', datetime(timestamp / 1000000, 'unixepoch')) AS time_group,
          fill_price,
          fill_quantity,
          side,
          fees,
          SUM(CASE WHEN side = 'BUY' THEN fill_quantity ELSE 0 END) OVER (PARTITION BY symbol, exchange ORDER BY timestamp) - 
          SUM(CASE WHEN side = 'SELL' THEN fill_quantity ELSE 0 END) OVER (PARTITION BY symbol, exchange ORDER BY timestamp) AS net_quantity,
          SUM(CASE WHEN side = 'BUY' THEN fill_quantity * fill_price ELSE 0 END) OVER (PARTITION BY symbol, exchange ORDER BY timestamp) - 
          SUM(CASE WHEN side = 'SELL' THEN fill_quantity * fill_price ELSE 0 END) OVER (PARTITION BY symbol, exchange ORDER BY timestamp) AS net_value
      FROM fills
      WHERE 
          exchange = 'OKEX' AND
          symbol = 'BTC-30DEC22' AND
          datetime(timestamp / 1000000, 'unixepoch') >= '2022-10-17 02:00:00' AND 
          datetime(timestamp / 1000000, 'unixepoch') <= '2022-10-18 01:59:59'
  )
  SELECT
      time_group as timeGroup,
      SUM(CASE WHEN side = 'SELL' THEN fill_quantity * (fill_price - (net_value / net_quantity)) ELSE 0 END) - SUM(fees) AS pnl
  FROM RunningTotals
  GROUP BY time_group
  ORDER BY time_group ASC;
```

## Useful tests commands

```
curl -X GET "http://localhost:3690/fills/pnl?exchange=BINANCE&symbol=BTC-PERPETUAL&groupBy=day&startDate=2022-10-17T00:00:00Z&endDate=2022-10-17T23:59:59Z"

curl -X GET "http://localhost:3690/fills/pnl?exchange=BINANCE&symbol=ETH-PERPETUAL-USDT&groupBy=day&startDate=2022-10-17T00:00:00Z&endDate=2022-10-17T23:59:59Z"

curl -X GET "http://localhost:3690/fills/pnl?exchange=OKEX&symbol=BTC-30DEC22&groupBy=day&startDate=2022-10-17T00:00:00Z&endDate=2022-10-17T23:59:59Z"

curl -X GET "http://localhost:3690/fills/pnl?exchange=OKEX&symbol=BTC-30DEC22&groupBy=minute"
```

Example:

Running the following:

```
curl -X GET "http://localhost:3690/fills/pnl?exchange=OKEX&symbol=BTC-30DEC22&groupBy=minute"
```

will return the following output:

```
[{"timeGroup":"2022-10-17 15:13","pnl":-0.0000822529071262},{"timeGroup":"2022-10-17 15:14","pnl":1756.5750815631507},{"timeGroup":"2022-10-17 15:22","pnl":1199.2049525363434},{"timeGroup":"2022-10-17 15:30","pnl":2401.3929938064116},{"timeGroup":"2022-10-17 15:51","pnl":-2062.944537209139},{"timeGroup":"2022-10-17 15:53","pnl":-186.9913097231874},{"timeGroup":"2022-10-17 16:46","pnl":3722.0801583247444},{"timeGroup":"2022-10-17 16:49","pnl":8728.26040625487},{"timeGroup":"2022-10-17 16:51","pnl":4386.969061394597},{"timeGroup":"2022-10-17 16:52","pnl":10965.386656377152},{"timeGroup":"2022-10-17 16:53","pnl":6919.268043349762},{"timeGroup":"2022-10-17 16:54","pnl":2987.926763039264},{"timeGroup":"2022-10-17 17:00","pnl":4645.3943035856},{"timeGroup":"2022-10-17 17:05","pnl":4447.838202024985},{"timeGroup":"2022-10-17 17:40","pnl":486.52976275353996},{"timeGroup":"2022-10-17 17:48","pnl":15409.107147741457},{"timeGroup":"2022-10-17 18:44","pnl":6973.396904360061},{"timeGroup":"2022-10-17 19:03","pnl":-3241.461450971393},{"timeGroup":"2022-10-17 19:08","pnl":-6705.291296089892},{"timeGroup":"2022-10-17 19:19","pnl":-9614.400681250445},{"timeGroup":"2022-10-17 19:22","pnl":-3062.923430695653}]
```

```
curl -X GET "http://localhost:3690/fills/pnl?exchange=OKEX&symbol=BTC-30DEC22&groupBy=minute"
curl -X GET "http://localhost:3690/fills/pnl?exchange=OKEX&symbol=BTC-30DEC22&groupBy=hour"
curl -X GET "http://localhost:3690/fills/pnl?exchange=OKEX&symbol=BTC-30DEC22&groupBy=day"
curl -X GET "http://localhost:3690/fills/pnl?exchange=OKEX&symbol=BTC-30DEC22&groupBy=second"
```