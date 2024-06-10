// animasi scrolldown navbar
document.querySelectorAll('a[data-target]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('data-target');
        const targetElement = document.querySelector(targetId);

        window.scrollTo({
            top: targetElement.offsetTop,
            behavior: 'smooth'
        });
    });
});

window.onload = function() {
    var welcomeModal = document.getElementById("welcomeModal");
    welcomeModal.style.display = "block";

    // Close the modal when the user clicks on <span> (x)
    document.getElementsByClassName("close")[0].onclick = function() {
        welcomeModal.style.display = "none";
    }

    // Close the modal when the user clicks anywhere outside of the modal
    window.onclick = function(event) {
        if (event.target == welcomeModal) {
            welcomeModal.style.display = "none";
        }
    }
}

// Fungsi Slider Card Team Section //
var swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    slidesPerGroup: 1,
    loop: true,
    loopFillGroupWithBlank: true,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    breakpoints: {
        640: {
            slidesPerView: 'auto',
            spaceBetween: 20,
        },
        768: {
            slidesPerView: 'auto',
            spaceBetween: 30,
        },
        1024: {
            slidesPerView: 3,
            spaceBetween: 40,
            slidesPerGroup: 3,
        },
    },
});


// Fungsi untuk menghitung penjualan berdasarkan kategori
function calculateSalesByCategory(data) {
    const categories = {};
    data.forEach(order => {
        const category = order.category;
        if (categories[category]) {
            categories[category] += parseFloat(order.price) * parseInt(order.quantity);
        } else {
            categories[category] = parseFloat(order.price) * parseInt(order.quantity);
        }
    });

    const labels = Object.keys(categories);
    const values = Object.values(categories);

    const salesByCategoryData = {
        labels: labels,
        datasets: [{
            label: 'Sales by Category',
            data: values,
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 206, 86)',
                'rgb(75, 192, 192)'
            ],
            borderColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 206, 86)',
                'rgb(75, 192, 192)'
            ],
            borderWidth: 1
        }]
    };

    return salesByCategoryData;
}

// Fungsi untuk menghitung top 3 penjualan tertinggi
function calculateTop3HighestSales(data) {
    const pizzaSales = {};

    data.forEach(order => {
        const pizzaType = order.pizza_type_id;
        const quantity = parseInt(order.quantity);

        if (pizzaSales[pizzaType]) {
            pizzaSales[pizzaType] += quantity;
        } else {
            pizzaSales[pizzaType] = quantity;
        }
    });

    const sortedData = Object.entries(pizzaSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    const labels = sortedData.map(item => item[0]);
    const values = sortedData.map(item => item[1]);

    const top3HighestSalesData = {
        labels: labels,
        datasets: [{
            label: 'Top 3 Highest Sales (by Quantity)',
            data: values,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
        }]
    };

    return top3HighestSalesData;
}


// Fungsi untuk menghitung top 3 penjualan terendah
function calculateTop3LowestSales(data) {
    const pizzaSales = {};
    data.forEach(order => {
        const pizzaType = order.pizza_type_id;
        const quantity = parseInt(order.quantity);

        if (pizzaSales[pizzaType]) {
            pizzaSales[pizzaType] += quantity;
        } else {
            pizzaSales[pizzaType] = quantity;
        }
    });

    const sortedData = Object.entries(pizzaSales)
        .sort((a, b) => a[1] - b[1])
        .slice(0, 3);

    const labels = sortedData.map(item => item[0]);
    const values = sortedData.map(item => item[1]);

    const top3LowestSalesData = {
        labels: labels,
        datasets: [{
            label: 'Top 3 Lowest Sales (by Quantity)',
            data: values,
            backgroundColor: [
                'rgba(255, 159, 64, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
                'rgba(255, 159, 64, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
        }]
    };

    return top3LowestSalesData;
}


// Fungsi untuk menghitung rata-rata harga pizza
function calculateSalesByQuarter(data) {
    const quarters = {
        Q1: 0,
        Q2: 0,
        Q3: 0,
        Q4: 0
    };

    data.forEach(order => {
        const date = new Date(order.date_order);
        const month = date.getMonth() + 1; // getMonth() returns month from 0-11

        if (month >= 1 && month <= 3) {
            quarters.Q1 += parseFloat(order.price) * parseInt(order.quantity);
        } else if (month >= 4 && month <= 6) {
            quarters.Q2 += parseFloat(order.price) * parseInt(order.quantity);
        } else if (month >= 7 && month <= 9) {
            quarters.Q3 += parseFloat(order.price) * parseInt(order.quantity);
        } else if (month >= 10 && month <= 12) {
            quarters.Q4 += parseFloat(order.price) * parseInt(order.quantity);
        }
    });

    const labels = Object.keys(quarters);
    const values = Object.values(quarters);

    const salesByQuarterData = {
        labels: labels,
        datasets: [{
            label: 'Sales by Quarter',
            data: values,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
        }]
    };

    return salesByQuarterData;
}

// Fungsi untuk menghitung harga rata-rata per jenis pizza
function calculateAveragePricePerPizza(data) {
    const pizzaTypes = {};
    data.forEach(order => {
        const pizzaType = order.pizza_type_id;
        if (!pizzaTypes[pizzaType]) {
            pizzaTypes[pizzaType] = {
                totalPrice: 0,
                totalQuantity: 0
            };
        }
        pizzaTypes[pizzaType].totalPrice += parseFloat(order.price) * parseInt(order.quantity);
        pizzaTypes[pizzaType].totalQuantity += parseInt(order.quantity);
    });

    const averagePrices = Object.entries(pizzaTypes).map(([pizzaType, data]) => ({
        pizzaType,
        averagePrice: data.totalPrice / data.totalQuantity
    }));

    return averagePrices;
}

// Fungsi untuk menampilkan tabel harga rata-rata
function displayAveragePriceTable(data) {
    const averagePrices = calculateAveragePricePerPizza(data);
    const tableBody = document.querySelector('#averagePriceTable tbody');
    tableBody.innerHTML = '';

    averagePrices.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.pizzaType}</td>
            <td>$${item.averagePrice.toFixed(2)}</td>
        `;
        tableBody.appendChild(row);
    });
}
// Modifikasi fungsi displayAveragePriceTable dalam file main.js

// Fungsi untuk mengurutkan dan membatasi data
function sortAndLimitData(data, limit) {
    return data.sort((a, b) => b.averagePrice - a.averagePrice).slice(0, limit);
}

// Fungsi untuk menampilkan tabel harga rata-rata
function displayAveragePriceTable(data) {
    const averagePrices = calculateAveragePricePerPizza(data);
    const topAveragePrices = sortAndLimitData(averagePrices, 10); // Ambil 10 teratas
    const tableBody = document.querySelector('#averagePriceTable tbody');
    tableBody.innerHTML = '';

    topAveragePrices.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.pizzaType}</td>
            <td>$${item.averagePrice.toFixed(2)}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Panggil fungsi ini setelah data dimuat
document.addEventListener("DOMContentLoaded", function () {
    fetch('pizza.json')
        .then(response => response.json())
        .then(data => {
            // ... kode untuk menampilkan chart ...

            // Tambahkan ini untuk menampilkan tabel harga rata-rata
            displayAveragePriceTable(data);
        })
});

// Tambahkan fungsi ini di file main.js

// Fungsi untuk mendapatkan nama hari dari tanggal
function getDayOfWeek(dateString) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateString);
    return days[date.getDay()];
}

// Fungsi untuk menghitung total pesanan per hari
function calculateOrdersByDay(data) {
    const ordersByDay = {
        'Monday': 0,
        'Tuesday': 0,
        'Wednesday': 0,
        'Thursday': 0,
        'Friday': 0,
        'Saturday': 0,
        'Sunday': 0
    };

    data.forEach(order => {
        const day = getDayOfWeek(order.date_order);
        ordersByDay[day] += parseInt(order.quantity);
    });

    const labels = Object.keys(ordersByDay);
    const values = Object.values(ordersByDay);

    const ordersByDayData = {
        labels: labels,
        datasets: [{
            label: 'Orders by Day of Week',
            data: values,
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(199, 199, 199, 0.6)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(159, 159, 159, 1)'
            ],
            borderWidth: 1
        }]
    };

    return ordersByDayData;
}

// Modifikasi fungsi displayAveragePriceTable untuk memasukkan data hari
document.addEventListener("DOMContentLoaded", function () {
    fetch('pizza.json')
        .then(response => response.json())
        .then(data => {
            // ... kode untuk chart lainnya ...

            // Tambahkan chart untuk Orders by Day of Week
            const ordersByDayData = calculateOrdersByDay(data);
            const ordersByDayChart = new Chart(document.getElementById('ordersByDayChart'), {
                type: 'bar',
                data: ordersByDayData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Total Quantity'
                            }
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});

// Fungsi untuk menghitung penjualan berdasarkan waktu
function calculateSalesByTime(data) {
    // Inisialisasi objek untuk menyimpan total penjualan untuk masing-masing kategori waktu
    const revenueByTime = {
        breakfast: 0,
        lunch: 0,
        dinner: 0,
        lateNight: 0
    };

    // Iterasi data untuk mengelompokkan penjualan berdasarkan kategori waktu
    data.forEach(order => {
        const date = new Date(order.date_order + ' ' + order.time_order);
        const time = date.getHours();

        if (time >= 7 && time < 12) {
            revenueByTime.breakfast += parseFloat(order.price) * parseInt(order.quantity);
        } else if (time >= 12 && time < 15) {
            revenueByTime.lunch += parseFloat(order.price) * parseInt(order.quantity);
        } else if (time >= 15 && time < 18) {
            revenueByTime.dinner += parseFloat(order.price) * parseInt(order.quantity);
        } else {
            revenueByTime.lateNight += parseFloat(order.price) * parseInt(order.quantity);
        }
    });

    // Menghasilkan label (kategori waktu) dan data (total penjualan) untuk digunakan dalam Chart.js
    const labels = Object.keys(revenueByTime);
    const values = Object.values(revenueByTime);

    const salesByTimeData = {
        labels: ['pagi','siang','sore','malam'],
        datasets: [{
            label: 'Sales by Time of Day',
            data: values,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
        }]
    };

    return salesByTimeData;
}


function calculateSalesBySize(data) {
    const sizeSales = data.reduce((acc, order) => {
        const size = order.size;
        const price = parseFloat(order.price);
        if (!acc[size]) {
            acc[size] = 0;
        }
        acc[size] += price;
        return acc;
    }, {});

    const sizes = Object.keys(sizeSales);
    const sales = Object.values(sizeSales);

    return {
        labels: sizes,
        datasets: [{
            label: 'Sales by Size ($)',
            data: sales,
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
    };
}


document.addEventListener("DOMContentLoaded", function () {
    let originalData = [];
    let salesByCategoryChart, top3HighestSalesChart, top3LowestSalesChart, salesByQuarterChart, salesByTimeChart, salesBySizeChart;
    let currentPage = 1;
    const itemsPerPage = 10; // Ubah sesuai kebutuhan
    const maxPages = 10;

    fetch('pizza.json')
        .then(response => response.json())
        .then(data => {
            originalData = data;
            updateDashboard(data);

            document.getElementById('applyFilter').addEventListener('click', function () {
                const startDate = new Date(document.getElementById('startDate').value);
                const endDate = new Date(document.getElementById('endDate').value);
                const filteredData = originalData.filter(order => {
                    const orderDate = new Date(order.date_order);
                    return orderDate >= startDate && orderDate <= endDate;
                });
                updateDashboard(filteredData);
            });

            document.getElementById('resetFilter').addEventListener('click', function () {
                document.getElementById('startDate').value = ''; // Kosongkan input tanggal mulai
                document.getElementById('endDate').value = ''; // Kosongkan input tanggal akhir
                updateDashboard(originalData);
            });
        })
        .catch(error => console.error('Error fetching data:', error));

    function updateDashboard(data) {
        destroyCharts(); // Hancurkan grafik yang ada jika ada

        // Tampilkan grafik dan tabel dengan data tanpa filter
        const salesByCategoryData = calculateSalesByCategory(data);
        salesByCategoryChart = new Chart(document.getElementById('salesByCategoryChart'), {
            type: 'bar',
            data: salesByCategoryData,
            options: { responsive: true, maintainAspectRatio: false }
        });

        const top3HighestSalesData = calculateTop3HighestSales(data);
        top3HighestSalesChart = new Chart(document.getElementById('top3HighestSalesChart'), {
            type: 'bar',
            data: top3HighestSalesData,
            options: { responsive: true, maintainAspectRatio: false }
        });

        const top3LowestSalesData = calculateTop3LowestSales(data);
        top3LowestSalesChart = new Chart(document.getElementById('top3LowestSalesChart'), {
            type: 'bar',
            data: top3LowestSalesData,
            options: { responsive: true, maintainAspectRatio: false }
        });

        const salesByQuarterData = calculateSalesByQuarter(data);
        salesByQuarterChart = new Chart(document.getElementById('salesByQuarterChart'), {
            type: 'bar',
            data: salesByQuarterData,
            options: { responsive: true, maintainAspectRatio: false }
        });

        const salesByTimeData = calculateSalesByTime(data);
        salesByTimeChart = new Chart(document.getElementById('salesByTimeChart'), {
            type: 'bar',
            data: salesByTimeData,
            options: { responsive: true, maintainAspectRatio: false }
        });

        const sizeSales = calculateSalesBySize(data);
        salesBySizeChart = new Chart(document.getElementById('salesBySizeChart'), {
            type: 'pie',
            data: sizeSales,
            options: { responsive: true, maintainAspectRatio: false }
        });

        displayTable(data);
    }

    function displayTable(data) {
        const tableBody = document.querySelector('#dataTable tbody');
        tableBody.innerHTML = '';

        const paginatedData = paginate(data, currentPage, itemsPerPage);
        paginatedData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.order_id}</td>
                <td>${item.pizza_id}</td>
                <td>${item.quantity}</td>
                <td>$${item.price}</td>
                <td>${item.date_order}</td>
                <td>${item.time_order}</td>
                <td>${item.size}</td>
                <td>${item.category}</td>
                <td>${item.ingredients}</td>
            `;
            tableBody.appendChild(row);
        });

        setupPagination(data);
    }

    function paginate(array, page, perPage) {
        return array.slice((page - 1) * perPage, page * perPage);
    }

    function setupPagination(data) {
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';

        const totalPages = Math.ceil(data.length / itemsPerPage);
        const displayedPages = Math.min(totalPages, maxPages);

        for (let i = 1; i <= displayedPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.classList.add('page');
            if (i === currentPage) pageButton.classList.add('active');
            pageButton.addEventListener('click', () => {
                currentPage = i;
                displayTable(data);
            });
            pagination.appendChild(pageButton);
        }
    }

    function destroyCharts() {
        if (salesByCategoryChart) salesByCategoryChart.destroy();
        if (top3HighestSalesChart) top3HighestSalesChart.destroy();
        if (top3LowestSalesChart) top3LowestSalesChart.destroy();
        if (salesByQuarterChart) salesByQuarterChart.destroy();
        if (salesByTimeChart) salesByTimeChart.destroy();
        if (salesBySizeChart) salesBySizeChart.destroy();
    }
});

// Fungsi Form contact us
document.getElementById("emailForm").addEventListener("submit", function(event){
    event.preventDefault(); // Mencegah halaman refresh

    var email = document.getElementById("email").value;
    var subject = document.getElementById("subject").value;
    var message = document.getElementById("message").value;

    Email.send({
        Host: "smtp.elasticemail.com",
        Username: "revousurabaya23@gmail.com",
        Password: "87CA9E2B1DC917BA8453E12DA2D05C27D4D1",
        To: 'recipient@example.com',
        From: email,
        Subject: subject,
        Body: message
    }).then(
      message => alert("Email successfully sent!")
    );
   });
