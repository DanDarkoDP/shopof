    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartButton();

    fetch("https://cors-anywhere.herokuapp.com/https://docs.google.com/spreadsheets/d/e/2PACX-1vQjVwX605S9fHdJ3Itjic0Hhf9r-lDy79qmLb-ghEMZ9UosKFs8zhanjXfqmN_cgu0_WA7DDoobr6E4/pub?output=csv")
      .then(response => response.text())
      .then(csvText => {
        const products = parseCSV(csvText);
        renderProducts(products);
      })
      .catch(err => {
        console.error('Помилка завантаження даних:', err);
        document.getElementById("product-list").innerHTML = '<p>Не вдалося завантажити товари.</p>';
      });

    function parseCSV(csvText) {
      const lines = csvText.trim().split('\n');
      const headers = lines[0].split(',');
      return lines.slice(1).map(line => {
        const values = line.split(',');
        let obj = {};
        headers.forEach((header, i) => {
          obj[header.trim()] = values[i] ? values[i].trim() : '';
        });
        return obj;
      });
    }

    function renderProducts(products) {
      const list = document.getElementById("product-list");
      list.innerHTML = products.map((p, i) => `
        <article class="card">
          <img src="${p.image}" alt="${p.name}" />
          <div class="card-content">
            <h2>${p.name}</h2>
            <p class="price">${p.price} ₴</p>
            <p>${p.description}</p>
            <button class="add-to-cart" onclick='addToCart(${JSON.stringify(p)})'>Додати в кошик</button>
          </div>
        </article>
      `).join('');
    }

    function addToCart(product) {
      cart.push(product);
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartButton();
    }

    function updateCartButton() {
      const count = cart.length;
      document.getElementById('cart-button').innerText = `Кошик (${count})`;
    }