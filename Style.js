document.addEventListener('DOMContentLoaded', function() {
  fetch('23.json')
    .then(response => response.json())
    .then(data => {
      // Menghitung total pesanan dan total pendapatan
      const totalOrders = data.length;
      const totalRevenue = data.reduce((acc, order) => acc + parseFloat(order.price), 0);

      // Menampilkan hasil analisis di dashboard
      document.getElementById('totalOrders').textContent = totalOrders;
      document.getElementById('totalRevenue').textContent = totalRevenue.toFixed(2);

      // Mengumpulkan data harga untuk setiap pizza_type_id
      const priceData = {};
      data.forEach(order => {
        if (!priceData[order.pizza_type_id]) {
          priceData[order.pizza_type_id] = [];
        }
        priceData[order.pizza_type_id].push(parseFloat(order.price));
      });

      // Menghitung harga rata-rata untuk setiap pizza_type_id
      const averagePriceTableBody = document.querySelector('#averagePriceTable tbody');
      const averagePrices = [];

      for (const typeId in priceData) {
        const averagePrice = priceData[typeId].reduce((acc, price) => acc + price, 0) / priceData[typeId].length;
        averagePrices.push({ typeId, averagePrice });
      }

      // Mengurutkan data berdasarkan harga rata-rata dari terbesar ke terkecil
      averagePrices.sort((a, b) => b.averagePrice - a.averagePrice);

      // Menampilkan data di tabel
      averagePrices.forEach(item => {
        const row = document.createElement('tr');

        const typeIdCell = document.createElement('td');
        typeIdCell.textContent = item.typeId;
        row.appendChild(typeIdCell);

        const averagePriceCell = document.createElement('td');
        averagePriceCell.textContent = `$${item.averagePrice.toFixed(2)}`;
        row.appendChild(averagePriceCell);

        averagePriceTableBody.appendChild(row);
      });

      // Mengelompokkan data berdasarkan kategori waktu
      const timeCategories = {
          "Pagi": { start: "09:00:00", end: "11:30:00", quantity: 0 },
          "Siang": { start: "11:30:01", end: "15:00:00", quantity: 0 },
          "Sore": { start: "15:00:01", end: "18:00:00", quantity: 0 },
          "Malam": { start: "18:00:01", end: "23:30:00", quantity: 0 },
      };

      data.forEach(order => {
          const orderTime = order.time_order;
          const quantity = parseInt(order.quantity, 10);

          for (const category in timeCategories) {
              const { start, end } = timeCategories[category];
              if (orderTime >= start && orderTime <= end) {
                  timeCategories[category].quantity += quantity;
              }
          }
      });

      // Menyiapkan data untuk chart dan mengurutkannya
      const labels = Object.keys(timeCategories);
      const quantities = labels.map(label => timeCategories[label].quantity);

      // Menggabungkan labels dan quantities ke dalam array objek
      const sortedData = labels.map((label, index) => {
          return { label, quantity: quantities[index] };
      });

      // Mengurutkan array objek berdasarkan quantity dari terbesar ke terkecil
      sortedData.sort((a, b) => b.quantity - a.quantity);

      // Memisahkan kembali menjadi labels dan quantities yang sudah diurutkan
      const sortedLabels = sortedData.map(item => item.label);
      const sortedQuantities = sortedData.map(item => item.quantity);

      // Membuat chart
      const ctx = document.getElementById('timeCategoryChart').getContext('2d');
      new Chart(ctx, {
          type: 'bar',
          data: {
              labels: sortedLabels,
              datasets: [{
                  label: 'Order Quantity',
                  data: sortedQuantities,
                  backgroundColor: 'rgba(0, 0, 139, 0.2)',  // Biru Tua dengan Transparansi
                  borderColor: 'rgba(0, 0, 139, 1)',       // Biru Tua Tanpa Transparansi
                  borderWidth: 1
              }]
          },
          options: {
              scales: {
                  x: {
                      beginAtZero: true
                  },
                  y: {
                      beginAtZero: true
                  }
              }
          }
      });

      // Mengelompokkan data berdasarkan hari dalam seminggu
      const dayOfWeekCategories = {
          "Senin": 0,
          "Selasa": 0,
          "Rabu": 0,
          "Kamis": 0,
          "Jumat": 0,
          "Sabtu": 0,
          "Minggu": 0,
      };

      data.forEach(order => {
          const orderDate = new Date(order.date_order);
          const dayOfWeek = orderDate.getDay(); // Mendapatkan hari dalam bentuk angka (0: Minggu, 1: Senin, ..., 6: Sabtu)

          const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
          const dayName = days[dayOfWeek];

          dayOfWeekCategories[dayName] += parseInt(order.quantity, 10);
      });

      // Menyiapkan data untuk chart dan mengurutkannya
      const dayLabels = Object.keys(dayOfWeekCategories);
      const dayQuantities = dayLabels.map(label => dayOfWeekCategories[label]);

      // Membuat chart untuk quantity berdasarkan hari dalam seminggu
      const dayCtx = document.getElementById('dayOfWeekChart').getContext('2d');
      new Chart(dayCtx, {
          type: 'bar',
          data: {
              labels: dayLabels,
              datasets: [{
                  label: 'Order Quantity',
                  data: dayQuantities,
                  backgroundColor: 'rgba(0, 0, 139, 0.2)',  // Biru Tua dengan Transparansi
                  borderColor: 'rgba(0, 0, 139, 1)',       // Biru Tua Tanpa Transparansi
                  borderWidth: 1
              }]
          },
          options: {
              scales: {
                  x: {
                      beginAtZero: true
                  },
                  y: {
                      beginAtZero: true
                  }
              }
          }
      });
    })
    .catch(error => console.error('Error loading JSON:', error));
});
