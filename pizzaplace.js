fetch('pizza.json')
  .then(response => response.json())
  .then(data => {
    const dashboard = document.getElementById('dashboard');
    const datePicker = document.getElementById('datePicker');
    const totalRevenueElem = document.getElementById('totalRevenue');
    const totalPizzasSoldElem = document.getElementById('totalPizzasSold');
    const avgSalesDayElem = document.getElementById('avgSalesDay');
    const avgSalesMonthElem = document.getElementById('avgSalesMonth');
    const sortAscButton = document.getElementById('sortAsc');
    const sortDescButton = document.getElementById('sortDesc');
    const resetButton = document.getElementById('reset');
    const showDayButton = document.getElementById('showDay');
    const showMonthButton = document.getElementById('showMonth');
    let totalRevenueChart, avgSalesChart, salesByTypeChart, salesByCategoryChart;
    let isSortedAsc = true;
    let showPerDay = true;

    // Initialize dashboard with all data
    updateDashboard(data);

    datePicker.addEventListener('change', function() {
      const selectedDate = this.value;
      const filteredData = data.filter(item => item.date_order === selectedDate);
      updateDashboard(filteredData);
    });

    sortAscButton.addEventListener('click', function() {
      isSortedAsc = true;
      const selectedDate = datePicker.value;
      const filteredData = selectedDate ? data.filter(item => item.date_order === selectedDate) : data;
      filteredData.sort((a, b) => a.price - b.price);
      updateDashboard(filteredData, true);
    });

    sortDescButton.addEventListener('click', function() {
      isSortedAsc = false;
      const selectedDate = datePicker.value;
      const filteredData = selectedDate ? data.filter(item => item.date_order === selectedDate) : data;
      filteredData.sort((a, b) => b.price - a.price);
      updateDashboard(filteredData, true);
    });

    resetButton.addEventListener('click', function() {
      datePicker.value = '';
      updateDashboard(data);
    });

    showDayButton.addEventListener('click', function() {
      showPerDay = true;
      updateDashboard(data);
    });

    showMonthButton.addEventListener('click', function() {
      showPerDay = false;
      updateDashboard(data);
    });

    function updateDashboard(filteredData, isSorted = false) {
      dashboard.innerHTML = '';
      const limitedData = filteredData.slice(0, 5);
      limitedData.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
          <h2>${item.name}</h2>
          <p><strong>Category:</strong> ${item.category}</p>
          <p><strong>Price:</strong> $${item.price}</p>
          <p><strong>Size:</strong> ${item.size}</p>
          <p><strong>Ingredients:</strong> ${item.ingredients}</p>
        `;
        dashboard.appendChild(card);
      });

      // Calculate insights
      const totalRevenue = filteredData.reduce((sum, item) => sum + parseFloat(item.price), 0);
      const totalPizzasSold = filteredData.length;
      const avgSalesDay = calculateAvgSalesPerDay(filteredData);
      const avgSalesMonth = calculateAvgSalesPerMonth(data); // Use all data for monthly average

      totalRevenueElem.textContent = formatDollar(totalRevenue);
      totalPizzasSoldElem.textContent = totalPizzasSold;
      avgSalesDayElem.textContent = formatDollar(avgSalesDay);
      avgSalesMonthElem.textContent = formatDollar(avgSalesMonth);

      // Prepare data for charts
      const salesByType = {};
      const salesByCategory = {};
      const revenueByTime = { breakfast: 0, lunch: 0, dinner: 0, lateNight: 0 };

      filteredData.forEach(item => {
        if (!salesByType[item.name]) {
          salesByType[item.name] = 0;
        }
        salesByType[item.name] += parseFloat(item.price);

        if (!salesByCategory[item.category]) {
          salesByCategory[item.category] = 0;
        }
        salesByCategory[item.category] += parseFloat(item.price);

        const time = new Date(item.date_order + ' ' + item.time_order).getHours();
        if (time >= 7 && time < 12) {
          revenueByTime.breakfast += parseFloat(item.price);
        } else if (time >= 12 && time < 15) {
          revenueByTime.lunch += parseFloat(item.price);
        } else if (time >= 15 && time < 18) {
          revenueByTime.dinner += parseFloat(item.price);
        } else {
          revenueByTime.lateNight += parseFloat(item.price);
        }
      });

      // Update charts
      const ctxTotalRevenue = document.getElementById('totalRevenueChart').getContext('2d');
      const ctxAvgSales = document.getElementById('avgSalesChart').getContext('2d');
      const ctxSalesByType = document.getElementById('salesByTypeChart').getContext('2d');
      const ctxSalesByCategory = document.getElementById('salesByCategoryChart').getContext('2d');

      if (totalRevenueChart) totalRevenueChart.destroy();
      if (avgSalesChart) avgSalesChart.destroy();
      if (salesByTypeChart) salesByTypeChart.destroy();
      if (salesByCategoryChart) salesByCategoryChart.destroy();

      totalRevenueChart = new Chart(ctxTotalRevenue, {
        type: 'bar',
        data: {
          labels: ['Pagi', 'Siang', 'Sore', 'Malam'],
          datasets: [{
            label: 'Total Revenue ($)',
            data: [revenueByTime.breakfast, revenueByTime.lunch, revenueByTime.dinner, revenueByTime.lateNight],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return formatDollar(value);
                }
              }
            }
          }
        }
      });

      if (showPerDay) {
        const salesPerDay = calculateTotalSalesPerDay(filteredData);

        avgSalesChart = new Chart(ctxAvgSales, {
          type: 'line',
          data: {
            labels: Object.keys(salesPerDay),
            datasets: [{
              label: 'Total Sales per Day ($)',
              data: Object.values(salesPerDay),
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1,
              fill: false
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return formatDollar(value);
                  }
                }
              }
            }
          }
        });
      } else {
        const salesPerMonth = calculateTotalSalesPerMonth(data); // Use all data for monthly total

        avgSalesChart = new Chart(ctxAvgSales, {
          type: 'line',
          data: {
            labels: Object.keys(salesPerMonth),
            datasets: [{
              label: 'Total Sales per Month ($)',
              data: Object.values(salesPerMonth),
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1,
              fill: false
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return formatDollar(value);
                  }
                }
              }
            }
          }
        });
      }

      const sortedSalesByType = Object.entries(salesByType)
        .sort((a, b) => isSortedAsc ? a[1] - b[1] : b[1] - a[1])
        .slice(0, 5);

      const salesByTypeLabels = sortedSalesByType.map(item => item[0]);
      const salesByTypeData = sortedSalesByType.map(item => item[1]);
      const salesByTypeColors = salesByTypeData.map((value, index) => {
        if (index === 0) return 'rgba(255, 99, 132, 0.2)'; // Highest value
        if (index === salesByTypeData.length - 1) return 'rgba(54, 162, 235, 0.2)'; // Lowest value
        return 'rgba(75, 192, 192, 0.2)'; // Default color
      });

      salesByTypeChart = new Chart(ctxSalesByType, {
        type: 'bar',
        data: {
          labels: salesByTypeLabels,
          datasets: [{
            label: 'Sales by Pizza Types ($)',
            data: salesByTypeData,
            backgroundColor: salesByTypeColors,
            borderColor: salesByTypeColors.map(color => color.replace('0.2', '1')),
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return formatDollar(value);
                }
              }
            }
          }
        }
      });

      salesByCategoryChart = new Chart(ctxSalesByCategory, {
        type: 'pie',
        data: {
          labels: Object.keys(salesByCategory),
          datasets: [{
            label: 'Sales by Category ($)',
            data: Object.values(salesByCategory),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              callbacks: {
                label: function(tooltipItem) {
                  return `${tooltipItem.label}: ${formatDollar(tooltipItem.raw)}`;
                }
              }
            }
          }
        }
      });
    }

    function calculateAvgSalesPerDay(data) {
      const salesPerDay = data.reduce((acc, item) => {
        const date = item.date_order;
        if (!acc[date]) acc[date] = 0;
        acc[date] += parseFloat(item.price);
        return acc;
      }, {});

      const totalSales = Object.values(salesPerDay).reduce((sum, value) => sum + value, 0);
      const numDays = Object.keys(salesPerDay).length;
      return totalSales / numDays;
    }

    function calculateAvgSalesPerMonth(data) {
      const salesPerMonth = data.reduce((acc, item) => {
        const month = item.date_order.slice(0, 7); // Get YYYY-MM
        if (!acc[month]) acc[month] = 0;
        acc[month] += parseFloat(item.price);
        return acc;
      }, {});

      const totalSales = Object.values(salesPerMonth).reduce((sum, value) => sum + value, 0);
      const numMonths = Object.keys(salesPerMonth).length;
      return totalSales / numMonths;
    }

    function calculateTotalSalesPerMonth(data) {
      const salesPerMonth = data.reduce((acc, item) => {
        const month = item.date_order.slice(0, 7); // Get YYYY-MM
        if (!acc[month]) acc[month] = 0;
        acc[month] += parseFloat(item.price);
        return acc;
      }, {});

      return salesPerMonth;
    }

    function calculateTotalSalesPerDay(data) {
      const salesPerDay = data.reduce((acc, item) => {
        const date = item.date_order;
        if (!acc[date]) acc[date] = 0;
        acc[date] += parseFloat(item.price);
        return acc;
      }, {});

      return salesPerDay;
    }

    function formatDollar(value) {
      if (value >= 100) {
        return `$${value.toFixed(0)}`;
      } else {
        return `$${value.toFixed(2)}`;
      }
    }
  })
  .catch(error => console.error('Error:', error));
