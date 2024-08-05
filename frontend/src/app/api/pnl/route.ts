"use server"
import { NextResponse, NextRequest } from "next/server";
import { appConstants } from "../../lib/constants";

const API_URL = appConstants.backendURL;

/**
 * Dummy data for development
 */
const dummyData = (exchange: string, symbol: string, groupBy: string) => {
  switch (groupBy) {
    case 'hour': {
      return [
        { "timeGroup": "2022-10-17T15:00:00.000Z", "pnl": 3107.237098720672 },
        { "timeGroup": "2022-10-17T16:00:00.000Z", "pnl": 37709.89108874039 },
        { "timeGroup": "2022-10-17T17:00:00.000Z", "pnl": 24988.869416105583 },
        { "timeGroup": "2022-10-17T18:00:00.000Z", "pnl": 6973.396904360061 },
        { "timeGroup": "2022-10-17T19:00:00.000Z", "pnl": -22624.076859007382 }
      ];
    }
    /**
     * [{"timeGroup":"2022-10-17T15:13:00.000Z","pnl":-0.0000822529071262},{"timeGroup":"2022-10-17T15:14:00.000Z","pnl":1756.5750815631507},{"timeGroup":"2022-10-17T15:22:00.000Z","pnl":1199.2049525363434},{"timeGroup":"2022-10-17T15:30:00.000Z","pnl":2401.3929938064116},{"timeGroup":"2022-10-17T15:51:00.000Z","pnl":-2062.944537209139},{"timeGroup":"2022-10-17T15:53:00.000Z","pnl":-186.9913097231874},{"timeGroup":"2022-10-17T16:46:00.000Z","pnl":3722.0801583247444},{"timeGroup":"2022-10-17T16:49:00.000Z","pnl":8728.26040625487},{"timeGroup":"2022-10-17T16:51:00.000Z","pnl":4386.969061394597},{"timeGroup":"2022-10-17T16:52:00.000Z","pnl":10965.386656377152},{"timeGroup":"2022-10-17T16:53:00.000Z","pnl":6919.268043349762},{"timeGroup":"2022-10-17T16:54:00.000Z","pnl":2987.926763039264},{"timeGroup":"2022-10-17T17:00:00.000Z","pnl":4645.3943035856},{"timeGroup":"2022-10-17T17:05:00.000Z","pnl":4447.838202024985},{"timeGroup":"2022-10-17T17:40:00.000Z","pnl":486.52976275353996},{"timeGroup":"2022-10-17T17:48:00.000Z","pnl":15409.107147741457},{"timeGroup":"2022-10-17T18:44:00.000Z","pnl":6973.396904360061},{"timeGroup":"2022-10-17T19:03:00.000Z","pnl":-3241.461450971393},{"timeGroup":"2022-10-17T19:08:00.000Z","pnl":-6705.291296089892},{"timeGroup":"2022-10-17T19:19:00.000Z","pnl":-9614.400681250445},{"timeGroup":"2022-10-17T19:22:00.000Z","pnl":-3062.923430695653}]
     */
    case 'minute': {
      return [
        { "timeGroup": "2022-10-17T15:13:00.000Z", "pnl": -0.0000822529071262 },
        { "timeGroup": "2022-10-17T15:14:00.000Z", "pnl": 1756.5750815631507 },
        { "timeGroup": "2022-10-17T15:22:00.000Z", "pnl": 1199.2049525363434 },
        { "timeGroup": "2022-10-17T15:30:00.000Z", "pnl": 2401.3929938064116 },
        { "timeGroup": "2022-10-17T15:51:00.000Z", "pnl": -2062.944537209139 },
        { "timeGroup": "2022-10-17T15:53:00.000Z", "pnl": -186.9913097231874 },
        { "timeGroup": "2022-10-17T16:46:00.000Z", "pnl": 3722.0801583247444 },
        { "timeGroup": "2022-10-17T16:49:00.000Z", "pnl": 8728.26040625487 },
        { "timeGroup": "2022-10-17T16:51:00.000Z", "pnl": 4386.969061394597 },
        { "timeGroup": "2022-10-17T16:52:00.000Z", "pnl": 10965.386656377152 },
        { "timeGroup": "2022-10-17T16:53:00.000Z", "pnl": 6919.268043349762 },
        { "timeGroup": "2022-10-17T16:54:00.000Z", "pnl": 2987.926763039264 },
        { "timeGroup": "2022-10-17T17:00:00.000Z", "pnl": 4645.3943035856 },
        { "timeGroup": "2022-10-17T17:05:00.000Z", "pnl": 4447.838202024985 },
        { "timeGroup": "2022-10-17T17:40:00.000Z", "pnl": 486.52976275353996 },
        { "timeGroup": "2022-10-17T17:48:00.000Z", "pnl": 15409.107147741457 },
        { "timeGroup": "2022-10-17T18:44:00.000Z", "pnl": 6973.396904360061 },
        { "timeGroup": "2022-10-17T19:03:00.000Z", "pnl": -3241.461450971393 },
        { "timeGroup": "2022-10-17T19:08:00.000Z", "pnl": -6705.291296089892 },
        { "timeGroup": "2022-10-17T19:19:00.000Z", "pnl": -9614.400681250445 },
        { "timeGroup": "2022-10-17T19:22:00.000Z", "pnl": -3062.923430695653 }
      ];
    }
    case 'second': {
      return [
        { "timeGroup": "2022-10-17T15:13:43.000Z", "pnl": -0.0000822529071262 },
        { "timeGroup": "2022-10-17T15:14:21.000Z", "pnl": 1756.5750815631507 },
        { "timeGroup": "2022-10-17T15:22:47.000Z", "pnl": 1199.2049525363434 },
        { "timeGroup": "2022-10-17T15:30:07.000Z", "pnl": 2401.3929938064116 },
        { "timeGroup": "2022-10-17T15:51:38.000Z", "pnl": -2062.944537209139 },
        { "timeGroup": "2022-10-17T15:53:10.000Z", "pnl": -186.9913097231874 },
        { "timeGroup": "2022-10-17T16:46:09.000Z", "pnl": 1117.009225148682 },
        { "timeGroup": "2022-10-17T16:46:24.000Z", "pnl": 2605.070933176062 },
        { "timeGroup": "2022-10-17T16:49:04.000Z", "pnl": 8728.26040625487 },
        { "timeGroup": "2022-10-17T16:51:37.000Z", "pnl": 4386.969061394597 },
        { "timeGroup": "2022-10-17T16:52:09.000Z", "pnl": 1296.1403862432921 },
        { "timeGroup": "2022-10-17T16:52:53.000Z", "pnl": 9669.24627013386 },
        { "timeGroup": "2022-10-17T16:53:58.000Z", "pnl": 6919.268043349762 },
        { "timeGroup": "2022-10-17T16:54:17.000Z", "pnl": 2987.926763039264 },
        { "timeGroup": "2022-10-17T17:00:15.000Z", "pnl": 4645.3943035856 },
        { "timeGroup": "2022-10-17T17:05:12.000Z", "pnl": 4447.838202024985 },
        { "timeGroup": "2022-10-17T17:40:25.000Z", "pnl": 486.52976275353996 },
        { "timeGroup": "2022-10-17T17:48:18.000Z", "pnl": 15409.107147741457 },
        { "timeGroup": "2022-10-17T18:44:20.000Z", "pnl": 705.9047826057496 },
        { "timeGroup": "2022-10-17T18:44:21.000Z", "pnl": 1612.995904595056 },
        { "timeGroup": "2022-10-17T18:44:22.000Z", "pnl": 4654.496217159256 },
        { "timeGroup": "2022-10-17T19:03:54.000Z", "pnl": -3241.461450971393 },
        { "timeGroup": "2022-10-17T19:08:07.000Z", "pnl": -4441.031163708251 },
        { "timeGroup": "2022-10-17T19:08:39.000Z", "pnl": -2264.2601323816407 },
        { "timeGroup": "2022-10-17T19:19:29.000Z", "pnl": -9614.400681250445 },
        { "timeGroup": "2022-10-17T19:22:10.000Z", "pnl": -3062.923430695653 }
      ];
    }
    case 'day': {
      return [
        { "timeGroup": "2022-10-17T00:00:00.000Z", "pnl": 50155.31764891932 }
      ];
    }
    default: {
      return [
        { "timeGroup": "2022-10-17T00:00:00.000Z", "pnl": 0 }
      ];
    }
  }
};


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filters = {
    exchange: searchParams.get('exchange') || '',
    symbol: searchParams.get('symbol') || '',
    groupBy: searchParams.get('groupBy') || 'day',
  };

  let query = `groupBy=${filters.groupBy}`;
  if (filters.exchange) query += `&exchange=${filters.exchange}`;
  if (filters.symbol) query += `&symbol=${filters.symbol}`;
  const queryToGetData = `${API_URL}/fills/pnl?${query}`
  console.log(`inside function \`GET\`: \`queryToGetData\` = ${JSON.stringify(queryToGetData)}`)

  const data = await fetch(queryToGetData)
  const dataInJson = await data.json();
  console.log(`inside function \`GET\`: \`data\` = ${JSON.stringify(dataInJson)}`)
  const nextResponse = new NextResponse(JSON.stringify(dataInJson));

  // Good for debugging
  // const data = dummyData(filters.exchange, filters.symbol, filters.groupBy)
  // console.log(`inside function \`GET\`: \`dummyData(filters.exchange, filters.symbol, filters.groupBy)\` = ${JSON.stringify(data)}`)
  // const nextResponse = new NextResponse(JSON.stringify(data));

  return nextResponse;
}