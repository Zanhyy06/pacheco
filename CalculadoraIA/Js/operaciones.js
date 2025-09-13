class Product {
  constructor(name, price, quantity) {
    this.name = name;
    this.price = parseFloat(price);
    this.quantity = parseInt(quantity);
  }

  get subtotal() {
    return this.price * this.quantity;
  }
}

class Invoice {
  constructor() {
    this.products = [];
    this.history = [];
  }

  addProduct(product) {
    this.products.push(product);
    this.render();
  }

  deleteProduct(index) {
    this.products.splice(index, 1);
    this.render();
  }

  editProduct(index, newProduct) {
    this.products[index] = newProduct;
    this.render();
  }

  get subtotal() {
    return this.products.reduce((acc, p) => acc + p.subtotal, 0);
  }

  get discount() {
    return this.subtotal * 0.05;
  }

  get tax() {
    return (this.subtotal - this.discount) * 0.19;
  }

  get total() {
    return this.subtotal - this.discount + this.tax;
  }

  saveInvoice() {
    const invoiceData = {
      products: [...this.products],
      date: new Date().toLocaleString(),
      total: this.total.toFixed(2)
    };
    this.history.push(invoiceData);
    this.products = [];
    this.render();
    this.renderHistory();
  }

  render() {
    const body = document.getElementById("invoice-body");
    body.innerHTML = "";
    this.products.forEach((product, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${product.name}</td>
        <td>${product.price.toFixed(2)}</td>
        <td>${product.quantity}</td>
        <td>${product.subtotal.toFixed(2)}</td>
        <td>
          <button onclick="editProduct(${index})">Editar</button>
          <button onclick="invoice.deleteProduct(${index})">Eliminar</button>
        </td>
      `;

      body.appendChild(row);
    });

    document.getElementById("subtotal").textContent = this.subtotal.toFixed(2);
    document.getElementById("discount").textContent = this.discount.toFixed(2);
    document.getElementById("tax").textContent = this.tax.toFixed(2);
    document.getElementById("net-total").textContent = this.total.toFixed(2);
  }

  renderHistory() {
    const list = document.getElementById("history");
    list.innerHTML = "";
    this.history.forEach((inv, i) => {
      const li = document.createElement("li");
      li.textContent = `#${i + 1} - ${inv.date} - Total: $${inv.total}`;
      list.appendChild(li);
    });
  }
}

const invoice = new Invoice();

document.getElementById("product-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("product").value;
  const price = document.getElementById("price").value;
  const quantity = document.getElementById("quantity").value;

  const newProduct = new Product(name, price, quantity);
  invoice.addProduct(newProduct);

  this.reset();
});

document.getElementById("save-invoice").addEventListener("click", () => {
  invoice.saveInvoice();
});

window.editProduct = function (index) {
  const product = invoice.products[index];
  document.getElementById("product").value = product.name;
  document.getElementById("price").value = product.price;
  document.getElementById("quantity").value = product.quantity;

  invoice.deleteProduct(index);
};
