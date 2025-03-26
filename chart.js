const API_KEY = " ";

const fetchStockData = async () => {

    const symbol = document.getElementById("symbolInput").value.trim().toUpperCase(); //trim
    const errorDiv = document.getElementById("error");

    if (!symbol) {
        errorDiv.textContent = "Please enter a valid stock symbol";
        return;
    }

    errorDiv.textContent = "";

    try {
        const response = await fetch(
            `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}` 
        );

        const data = await response.json();

        if (data["Error Message"]) {
            throw new Error("Invalid stock symbol. Please try again.");
        }

        const formattedData = formatStockData(data);
        renderChart(formattedData, symbol);
    } catch (error) {
        errorDiv.textContent = error.message;
    }
};

const formatStockData = (data) => {
    const formattedData = [];

    if (data["Time Series (Daily)"]) {
        Object.entries(data["Time Series (Daily)"]).forEach(([date, values]) => {
            formattedData.push({
                x: new Date(date),
                y: [
                    parseFloat(values["1. open"]),
                    parseFloat(values["2. high"]),
                    parseFloat(values["3. low"]),
                    parseFloat(values["4. close"])
                ]
            });
        });
    }

    return formattedData.reverse();  
};

const renderChart = (seriesData, symbol) => {
    const options = {
        chart: {
            type: "candlestick",
            height: 500,
            background: "#111"
        },
        series: [{ data: seriesData }],
        title: {
            text: `${symbol} Candlestick Chart`,
            align: "left",
            style: { color: "#fff" }
        },
        xaxis: {
            type: "datetime",
            labels: { style: { colors: "#ccc" } }
        },
        yaxis: {
            tooltip: { enabled: true },
            labels: { style: { colors: "#ccc" } }
        },
        plotOptions: {
            candlestick: {
                colors: {
                    upward: "#00B746",
                    downward: "#EF403C"
                }
            }
        }
    };

    const chartDiv = document.querySelector("#chart");
    chartDiv.innerHTML = "";  

    const chart = new ApexCharts(chartDiv, options);
    chart.render();
};
