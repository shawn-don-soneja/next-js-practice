
/**
 * This function is for Alpha Vantage formatting
 * @param timeSeries 
 * @returns 
 */
export function formatForGoogleLineChart(timeSeries: Record<string, any>) {
  return [
    ...Object.entries(timeSeries)
      .map(([date, values]) => [
        convertDateStringToUnix(date),
        Number(values['4. close'])
      ])
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()) // ascending
  ];
}

/**
 * This function is for Alpaca formatting, taking an array like:
 * ```
 * {timestamps: [], equity: [], other attributes...}
 * ```
 * @param timeSeries 
 * @returns 
 */
export function formatAlpacaForGoogleLineChart(timeSeries: Record<string, any>) {
  let output: Array<[string | number, number]> = [];
  for (const timestampIndex in timeSeries['timestamp']){
    const timestamp = timeSeries['timestamp'][timestampIndex];
    const value = timeSeries['equity'][timestampIndex];
    output.push([timestamp, value])
  }

  return output;
}

export function mergeSeries(series_1: [number, number][], series_2: [number, number][], startingEquity?: number) {
  console.log('merging!');
  console.log(series_1, series_2);
  let timestamps_1 = new Map();
  let timestamps_2 = new Map();
  let all_timestamps: Set<string> = new Set();

  const shares = startingEquity ? startingEquity / series_2[0][1] : 1;
  // Number of shares
  // Multiply all spy values by number of shares to be normalized 

  // create maps from unix time stamp, to value, for both series
  // Alpaca Portfolio data
  for (const entry of series_1){
    const dateString = convertUnixtoDateString(entry[0]);
    timestamps_1.set(dateString, entry[1]);
    all_timestamps.add(dateString);
  }

  // SPY data
  for (const entry of series_2){
    const dateString = convertUnixtoDateString(entry[0]);
    timestamps_2.set(dateString, entry[1] * shares);
    all_timestamps.add(dateString);
  }

  const sortedDatesArray: string[] = [...all_timestamps].sort((a: string, b: string) => {
    // Convert string 'MM/DD/YYYY' to a Date object for comparison
    const dateA = new Date(a); 
    const dateB = new Date(b);
    
    // Subtracting dates gives the difference in milliseconds, allowing numeric sort
    return dateA.getTime() - dateB.getTime(); 
  });

  // unix date, value, value
  let chartEntries: [number | string, number | string, number | string][] =  sortedDatesArray.map((timestamp: string) => {
    const portfolioValue = timestamps_1.get(timestamp);
    const spyValue = timestamps_2.get(timestamp);
    return [timestamp, portfolioValue, spyValue];
  });

  chartEntries.unshift(['Date', 'Equity', 'SPY'])

  return chartEntries;

}

function convertDateStringToUnix(date: string): number {
  // Input date string
  const dateString = date;

  // Create a Date object in UTC by appending "T00:00:00Z"
  // 'T00:00:00Z' means Time 00:00:00 Zulu (UTC)
  const dateObjectUTC = new Date(dateString + "T00:00:00Z");

  // Get the time in milliseconds since the epoch (getTime())
  const milliseconds = dateObjectUTC.getTime();

  // Convert milliseconds to seconds (Unix timestamp)
  const unixTimestamp = Math.floor(milliseconds / 1000);

  return unixTimestamp
}

function convertUnixtoDateString(unixTimestamp: number): string {
  const dateObject = new Date(unixTimestamp * 1000);
  const month = String(dateObject.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(dateObject.getUTCDate()).padStart(2, '0');
  const year = dateObject.getUTCFullYear();
  return `${month}/${day}/${year}`;
}


export default formatForGoogleLineChart;