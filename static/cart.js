window.addEventListener("pageshow", (e) => {
  console.log("pageshow", e.persisted);
  if (e.persisted) {
    location.reload();
  }

  let quantity_update = async () => {
    const items = document.querySelectorAll(".cart-item");

    for (const button of items) {
      let new_quantity = button.querySelector(".qytxt").innerText;

      await fetch(`/updatecart/${Number(new_quantity)}/${button.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
    }
  };

  async function get_cart_items() {
    let get_cart = await fetch("/User_Cart", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    let get_cart_data = await get_cart.json();
    console.log(get_cart);
    console.log(get_cart_data);

    const container = document.querySelector(".cart-container");

    if (get_cart_data.length > 0) {
      get_cart_data.forEach((product) => {
        let cart_item = document.createElement("div");
        cart_item.className = "cart-item";
        cart_item.id = product.cart_id;

        cart_item.innerHTML = `
                    <div class="product">
                        <img src="${product.image}">
                        <div>
                            <h3>${product.name}</h3>
                            <i class="fa-solid fa-trash delete"></i>
                        </div>
                    </div>

                    <div class="quantity">
                        <button class="sub">-</button>
                        <span class="qytxt">${product.quantity}</span>
                        <button class="add">+</button>
                    </div>

                    <div class="price">₹${product.price}</div>

                    <div class="subtotal">
                        ₹${product.price * product.quantity}
                    </div>
                `;

        container.append(cart_item);

        const addBtn = cart_item.querySelector(".add");
        const subBtn = cart_item.querySelector(".sub");
        const qtyText = cart_item.querySelector(".qytxt");
        const subtotal = cart_item.querySelector(".subtotal");

        addBtn.addEventListener("click", () => {
          let qty = Number(qtyText.innerText) + 1;
          qtyText.innerText = qty;
          subtotal.innerText = `₹${qty * product.price}`;
        });

        subBtn.addEventListener("click", () => {
          let qty = Number(qtyText.innerText);

          if (qty > 1) {
            qty--;
            qtyText.innerText = qty;
            subtotal.innerText = `₹${qty * product.price}`;
          }
        });

        const removeBtn = cart_item.querySelector(".delete");

        removeBtn.addEventListener("click", async () => {
          let delete_cartitem_response = await fetch(
            `/Empty_Cart/${product.cart_id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
            },
          );
          let delete_cartitem_data = await delete_cartitem_response.json();
          if (delete_cartitem_response.status == 200) {
            cart_item.remove();
            alert("Item Removed From Cart");
          } else {
            alert(delete_cartitem_data.message);
          }
        });
      });
    } else {
      let cart_item = document.createElement("div");
      cart_item.className = "cart-item";
      cart_item.innerHTML = `<h1>The Cart is Empty Now</h1>`;
      cart_item.style.display = "flex";
      cart_item.style.alignItems = "center";
      cart_item.style.justifyContent = "center";
      document.querySelector("#button button").style.display = "none";

      container.append(cart_item);
    }
  }

  get_cart_items();
  document
    .querySelector("#button button")
    .addEventListener("click", async () => {
      await quantity_update();
      let order_response = await fetch("/OrderNow", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      let order_data = await order_response.json();
      console.log(order_response);
      console.log(order_data);
      if (order_response.status == 201) {
        alert(order_data.message);
        window.location.reload();
      } else {
        alert(order_data.message);
        window.location.reload();
      }
    });
});
