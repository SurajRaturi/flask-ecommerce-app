let cartproducts = new Set();
window.addEventListener("pageshow", (e) => {
  if (e.persisted) {
    location.reload();
  }
  function get_footerlinks(role) {
    const orders = document.getElementById("orders");
    const cart = document.getElementById("cart");
    const manage_products = document.getElementById("Manageproducts");
    if (role === "user") {
      orders.classList.remove("hidden");
      cart.classList.remove("hidden");
    } else if (role === "admin") {
      orders.classList.add("hidden");
      cart.classList.add("hidden");
      manage_products.classList.remove("hidden");
    }
  }
  const access_token = localStorage.getItem("access_token");
  let username;
  let span = document.getElementById("greeting");
  let icon = document.querySelector("nav #user-icons");
  let dropdown = document.getElementById("dropdown");
  span.id = "current-user";
  async function refreshCartCount() {
    const access_token = localStorage.getItem("access_token"); // or wherever your token is stored

    // Fetch items currently residing in the database
    const response = await fetch("/User_Cart", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!response.ok) return;

    const cart_data = await response.json();
    const countElement = document.querySelector("#cart-count");

    if (cart_data.length > 0) {
      // Update the badge count accurately
      countElement.innerText = cart_data.length;
      countElement.style.display = "block";

      // 🔄 RESTORE STATE ON REFRESH:
      cart_data.forEach((item) => {
        // Match the cart item names with the product items rendered on your page
        document.querySelectorAll(".item").forEach((productEl) => {
          const titleEl =
            productEl.querySelector(".product-title") ||
            productEl.querySelector(".description");

          if (titleEl && titleEl.innerText.trim() === item.name) {
            // Lock it into the local memory tracker so frontend blocks clicks
            cartproducts.add(productEl.id.toString());

            // Modify the button design instantly so user knows it's added
            const btn = productEl.querySelector(".addtocart");
            if (btn) {
              btn.innerText = "✓";
              btn.style.pointerEvents = "none"; // Disables click actions completely
              btn.style.opacity = "0.6";
            }
          }
        });
      });
    } else {
      countElement.innerText = "";
      countElement.style.display = "none";
    }
  }

  if (access_token) {
    let user_info = async () => {
      const auth = await fetch("/user", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const data = await auth.json();
      username = data["username"];

      if (auth.status == 200) {
        get_footerlinks(data.role);

        if (data.role == "admin") {
          dropdown.innerHTML = `<a href='#'>My Profile</a><a href='/admin' id='manage_product'>Manage Products</a><a href='#' id='Logout'>Logout</a>`;
          span.innerHTML = `<h3>Hello , ${username}</h3>`;
          span.classList.remove("hidden");
          document.querySelector("#cart").remove();
          document.querySelectorAll(".add-to-cart").forEach((button) => {
            button.innerHTML =
              '<div class="admin-icon edit" ><i class="fa-solid fa-pen-to-square"></i></div>   <div class="admin-icon cross"><i class="fa-solid fa-xmark"></i></div>';
            button.className = "new-icon";
            button.style.display = "flex";
            button.style.gap = "10px";
          });
          span.style.color = "black";
          span.style.display = "flex";
          span.style.alignItems = "center";
          dropdown.style.right = "20px";
          // icon.style.marginLeft="330px"
          icon.prepend(span);
          document.querySelectorAll(".cross").forEach((button) => {
            button.addEventListener("click", async () => {
              let product = button.closest(".item");
              let delete_product_response = await fetch(
                `/product/${product.id}`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                  },
                },
              );
              let delete_product_data = await delete_product_response.json();
              console.log(delete_product_response);
              console.log(delete_product_data);
              if (delete_product_response.status == 200) {
                document.getElementById(product.id).remove();
                console.log("removing");
                alert(delete_product_data.message);
              } else {
                alert(delete_product_data.message);
              }

              console.log(product.id);
            });
          });

          document.querySelectorAll(".edit").forEach((button) => {
            console.log("element selected");
            let product = button.closest(".item");
            button.addEventListener("click", () => {
              console.log("button clicked");
              console.log(product.id);
              window.location.href = `/editproduct/${product.id}`;
            });
          });
        } else if (data.role === "user") {
          dropdown.innerHTML =
            "<a href='#'>My Profile</a><a href='/orders'>Orders</a><a href='#' id='Logout'>Logout</a>";
          span.innerHTML = `<h3>Hello , ${username}</h3>`;
          span.style.color = "black";

          span.style.display = "flex";
          span.style.alignItems = "center";
          // icon.style.marginLeft="330px"
          icon.prepend(span);
        }

        const cart = document.querySelector("#cart");
        if (cart) {
          cart.addEventListener("click", () => {
            window.location.href = "/cart";
          });
        }
        document.addEventListener("click", async (e) => {
          // ✅ Change this to find the element or its closest parent with the class
          const button = e.target.closest(".addtocart");

          if (button) {
            // Extract dataset from the validated button element
            const productId = button.dataset.productId;

            if (!cartproducts.has(productId)) {
              let cart_response = await fetch(
                `/addtocart/${Number(productId)}`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access_token}`,
                  },
                  body: JSON.stringify({
                    quantity: 1,
                  }),
                },
              );
              let cartdata = await cart_response.json();
              if (cart_response.status == 201) {
                cartproducts.add(productId);
                document.querySelector("#cart-count").innerText =
                  cartproducts.size;
                document.querySelector("#cart-count").style.display = "flex";

                // ✅ Add this line so your total count refreshes accurately from the backend too!
                refreshCartCount();
              }
            }
          }
        });

        refreshCartCount();
      } else if (auth.status == 401) {
        localStorage.removeItem("access_token");
        window.location.reload();
      }
      let logout = document.querySelector("#dropdown #Logout");
      if (logout) {
        logout.addEventListener("click", async () => {
          let logout_response = await fetch("/logout", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });
          if (logout_response["status"] == 200) {
            localStorage.removeItem("access_token");
            window.location.reload();
          }
        });
      }
    };
    user_info();
  } else {
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("addtocart")) {
        const productId = e.target.dataset.productId;
        if (!cartproducts.has(productId)) {
          cartproducts.add(productId);
          document.querySelector("#cart-count").innerText = cartproducts.size;
          document.querySelector("#cart-count").style.display = "block";
        }
      }
    });
  }
});
