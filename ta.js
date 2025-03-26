const API_KEY = " ";

const fetchStockData = async () => {
    const symbol = document.getElementById("symbolInput").value.trim().toUpperCase();
    const indicator = document.getElementById("indicatorSelect").value;  // Get selected indicator
    const errorDiv = document.getElementById("error");

    if (!symbol) {
        errorDiv.textContent = "Please enter a valid stock symbol";
        return;
    }

    errorDiv.textContent = "";

    try {
        const response = await fetch(
            `https://www.alphavantage.co/query?function=${indicator}&symbol=${symbol}&interval=daily&apikey=${API_KEY}`
        );

        const data = await response.json();

        if (data["Error Message"]) {
            throw new Error("Invalid stock symbol or API limit reached.");
        }

        const formattedData = formatStockData(data, indicator);
        renderChart(formattedData, symbol, indicator);
    } catch (error) {
        errorDiv.textContent = error.message;
    }
};


const formatStockData = (data, indicator) => {
    const formattedData = [];

    if (data["Technical Analysis: " + indicator]) {
        Object.entries(data["Technical Analysis: " + indicator]).forEach(([date, values]) => {
            formattedData.push({
                x: new Date(date),
                y: [parseFloat(values[indicator])]
            });
        });
    }

    return formattedData.reverse();
};


const renderChart = (seriesData, symbol, indicator) => {
    const options = {
        chart: {
            type: "line",
            height: 500,
            background: "#111"
        },
        series: [{ name: indicator, data: seriesData }],
        title: {
            text: `${symbol} - ${indicator} Indicator`,
            align: "left",
            style: { color: "#fff" }
        },
        xaxis: {
            type: "datetime",
            labels: { style: { colors: "#ccc" } }
        },
        yaxis: {
            labels: { style: { colors: "#ccc" } }
        }
    };

    const chartDiv = document.querySelector("#chart");
    chartDiv.innerHTML = "";  

    const chart = new ApexCharts(chartDiv, options);
    chart.render();
};
