"use client";
import { useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { addSeconds, addMinutes, addHours, addDays, parseISO, format } from "date-fns";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  registerables,
  ChartOptions,
  ChartData,
} from "chart.js";
import {
  FormControl,
  TextField,
  Button,
  FormLabel,
  Stack,
  ButtonGroup,
  Box,
} from "@mui/material";
import { baseAppConstants } from "./lib/constants";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  ...registerables
);

const fetchData = async (query: any) => {
  try {
    const queryString = new URLSearchParams(query).toString();
    console.log(`Fetching data with query: ${queryString}`);
    const response = await fetch(`/api/pnl?${queryString}`);

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch data failed:", error);
    throw error;
  }
};

// const formatDataForChart = (data: any) => {
//   const labels = data.map((item: any) => item.timeGroup);
//   const pnlData = data.map((item: any) => item.pnl);

//   return {
//     labels,
//     datasets: [
//       {
//         label: "PnL",
//         data: pnlData,
//         borderColor: "rgba(75,192,192,1)",
//         backgroundColor: "rgba(75,192,192,0.2)",
//         fill: true,
//       },
//     ],
//   };
// };

const formatDataForChart = (data: any, groupBy: string) => {
  let cumulativePnl = 0;
  const sortedData = data.sort(
    (a: any, b: any) =>
      new Date(a.timeGroup).getTime() - new Date(b.timeGroup).getTime()
  );

  const formattedData = sortedData.map((item: any) => {
    cumulativePnl += item.pnl;
    return {
      x: parseISO(item.timeGroup),
      y: cumulativePnl,
    };
  });

  return {
    datasets: [
      {
        label: "Cumulative PnL",
        data: formattedData,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true,
      },
    ],
  };
};

const getTimeUnit = (groupBy: string) => {
  switch (groupBy) {
    case "second":
      return "second";
    case "minute":
      return "minute";
    case "hour":
      return "hour";
    case "day":
      return "day";
    default:
      return "day";
  }
};

const getTimeFormat = (groupBy: string) => {
  switch (groupBy) {
    case "second":
      return "h:mm:ss a";
    case "minute":
      return "h:mm a";
    case "hour":
      return "ha";
    case "day":
      return "MMM d";
    default:
      return "MMM d";
  }
};

// const options: ChartOptions<"line"> = {
//   scales: {
//     x: {
//       type: "time",
//       time: {
//         unit: "day",
//       },
//     },
//   },
// };

const HomePage = () => {
  const [exchange, setExchange] = useState<string>(
    baseAppConstants.defaultsQueryParameters.exchange
  );
  const [symbol, setSymbol] = useState<string>(
    baseAppConstants.defaultsQueryParameters.symbol
  );
  const [groupBy, setGroupBy] = useState<string>(
    baseAppConstants.defaultsQueryParameters.groupBy
  );
  // const [filters, setFilters] = useState(baseAppConstants.defaultsQueryParameters);
  const [chartData, setChartData] = useState<ChartData<"line">>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchData({ exchange, symbol, groupBy });
        setChartData(formatDataForChart(data, groupBy));

        // Update options with the correct time unit
        if (options.scales?.x?.type === "time") {
          options.scales.x.time = options.scales.x.time || {};
          options.scales.x.time.unit = getTimeUnit(groupBy);
          // Ensure the ticks callback uses the current groupBy value
          options.scales.x.ticks = {
            callback: function(value, index, ticks) {
              const date = new Date(value);
              return format(date, getTimeFormat(groupBy));
            }
          };
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    getData();
  }, [exchange, symbol, groupBy]);

  const options: ChartOptions<"line"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "time",
          time: {
            unit: getTimeUnit(groupBy),
            displayFormats: {
              second: "h:mm:ss a",
              minute: "h:mm a",
              hour: "ha",
              day: "MMM d",
            },
          },
          ticks: {
            source: "data",
            autoSkip: true,
            maxTicksLimit: 8,
            maxRotation: 45,
            minRotation: 45,
            callback: function (value, index, ticks) {
              const date = new Date(value);
              return format(date, getTimeFormat(groupBy));
            },
          },
        },
        y: {
          title: {
            display: true,
            text: "Cumulative PnL",
          },
        },
      },
    }),
    [groupBy]
  );

  // const handleChange = (event: SelectChangeEvent<{ name?: string; value: unknown }>) => {
  //   const { name, value } = event.target!;
  //   setFilters((prevFilters) => ({
  //     ...prevFilters,
  //     [name as string]: value as string,
  //   }));
  // };

  return (
    <Box p={10}>
      <Box fontSize={20} fontWeight={700} mb={4}>
        PnL Chart
      </Box>
      <Stack direction="row" spacing={3} mb={5}>
        {/* <FormControl variant="outlined">
        <TextField
          label="exchange"
          variant="outlined"
          name="exchange"
          value={filters.exchange}
          onChange={handleChange}
        />
      </FormControl> */}
        <FormControl variant="outlined">
          <FormLabel sx={{ mb: 1 }}>Exchange</FormLabel>
          <ButtonGroup variant="outlined">
            {baseAppConstants.queryParameters.exchanges.map((_exchange) => (
              <Button
                value={_exchange}
                onClick={() => setExchange(_exchange)}
                sx={{
                  backgroundColor:
                    exchange === _exchange ? "primary.main" : "transparent",
                  color: exchange === _exchange ? "white" : "inherit",
                  "&:hover": {
                    backgroundColor:
                      exchange === _exchange ? "primary.main" : "#e3f2fd",
                    color: exchange === _exchange ? "white" : "inherit",
                  },
                }}
                key={_exchange}
              >
                {_exchange}
              </Button>
            ))}
          </ButtonGroup>
        </FormControl>
        <FormControl variant="outlined">
          <FormLabel sx={{ mb: 1 }}>Symbol</FormLabel>
          <TextField
            // label="Symbol"
            variant="outlined"
            size="small"
            name="symbol"
            value={symbol}
            onChange={(event) => setSymbol(event.target.value)}
          />
        </FormControl>
        <FormControl variant="outlined">
          <FormLabel sx={{ mb: 1 }}>Group By</FormLabel>
          <ButtonGroup variant="outlined">
            {baseAppConstants.queryParameters.groupBy.map((groupByOption) => (
              <Button
                key={groupByOption}
                value={groupByOption}
                onClick={() => setGroupBy(groupByOption)}
                sx={{
                  backgroundColor:
                    groupBy === groupByOption ? "primary.main" : "transparent",
                  color: groupBy === groupByOption ? "white" : "inherit",
                  "&:hover": {
                    backgroundColor:
                      groupBy === groupByOption ? "primary.main" : "#e3f2fd",
                    color: groupBy === groupByOption ? "white" : "inherit",
                  },
                }}
              >
                {groupByOption.charAt(0).toUpperCase() + groupByOption.slice(1)}
              </Button>
            ))}
          </ButtonGroup>
          {/* <Select
            value={groupBy}
            onChange={(event) => setGroupBy(event.target.value)}
            label="Group By"
            name="groupBy"
          >
            <MenuItem value="second">Second</MenuItem>
            <MenuItem value="minute">Minute</MenuItem>
            <MenuItem value="hour">Hour</MenuItem>
            <MenuItem value="day">Day</MenuItem>
          </Select> */}
        </FormControl>
      </Stack>
      {/* <Button onClick={() => setFilters({ ...filters })}>Apply Filters</Button> */}
      <Box height={500} width="100%">
        <Line data={chartData} options={options} />
      </Box>
    </Box>
  );
};

export default HomePage;
