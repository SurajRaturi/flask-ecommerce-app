let cartproducts = new Set();
window.addEventListener("pageshow", (e) => {
  console.log("pageshow", e.persisted);
  if (e.persisted) {
    location.reload();
  }
  const access_token = localStorage.getItem("access_token");
  let username;
  let span = document.createElement("span");
  let icon = document.querySelector("nav #container");
  let dropdown = document.querySelector("#dropdown");
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
        document.querySelectorAll(".product").forEach((productEl) => {
          const titleEl =
            productEl.querySelector(".product-title") ||
            productEl.querySelector(".product-description");

          if (titleEl && titleEl.innerText.trim() === item.name) {
            // Lock it into the local memory tracker so frontend blocks clicks
            cartproducts.add(productEl.id.toString());

            // Modify the button design instantly so user knows it's added
            const btn = productEl.querySelector(".add-to-cart");
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

  console.log(access_token);

  if (access_token) {
    console.log("access token found");

    let user_info = async () => {
      const auth = await fetch("/user", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      console.log(auth.status);
      const data = await auth.json();
      username = data["username"];
      console.log("username added to variable");

      if (auth.status == 200) {
        console.log("get response 200 for authentication");

        if (data.role == "admin") {
          console.log("user is admin");

          dropdown.innerHTML = `<a href='#'>My Profile</a><a href='/admin' id='manage_product'>Manage Products</a><a href='#' id='Logout'>Logout</a>`;
          span.innerHTML = `<h3>Hello , ${username}</h3>`;
          document.querySelector("#cart").remove();
          document.querySelectorAll(".add-to-cart").forEach((button) => {
            button.innerHTML =
              '<div class="admin-icon edit" ><i class="fa-solid fa-pen-to-square"></i></div>   <div class="admin-icon cross"><i class="fa-solid fa-xmark"></i></div>';
            button.className = "new-icon";
            button.style.display = "flex";
            button.style.gap = "10px";
          });
          span.style.color = "black";
          span.style.fontFamily = "Gill Sans";
          span.style.display = "flex";
          span.style.alignItems = "center";
          dropdown.style.right = "20px";
          // icon.style.marginLeft="330px"
          icon.prepend(span);
          console.log("dropdown editted");
          document.querySelectorAll(".cross").forEach((button) => {
            button.addEventListener("click", async () => {
              let product = button.closest(".product");
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
            let product = button.closest(".product");
            button.addEventListener("click", () => {
              console.log("button clicked");
              console.log(product.id);
              window.location.href = `/editproduct/${product.id}`;
            });
          });
        } else {
          dropdown.innerHTML =
            "<a href='#'>My Profile</a><a href='/orders'>Orders</a><a href='#' id='Logout'>Logout</a>";
          span.innerHTML = `<h3>Hello , ${username}</h3>`;
          span.style.color = "black";
          span.style.fontFamily = "Gill Sans";
          span.style.display = "flex";
          span.style.alignItems = "center";
          // icon.style.marginLeft="330px"
          icon.prepend(span);
          console.log("greeting added");
        }
        const cart = document.querySelector("#cart");
        if (cart) {
          cart.addEventListener("click", () => {
            window.location.href = "/cart";
          });
        }
        document.addEventListener("click", async (e) => {
          // ✅ Change this to find the element or its closest parent with the class
          const button = e.target.closest(".add-to-cart");

          if (button) {
            console.log("button clicked");

            // Extract dataset from the validated button element
            const productId = button.dataset.productId;
            console.log("productid : ", productId);

            if (!cartproducts.has(productId)) {
              console.log("Before fetch");
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
              console.log("After fetch");
              if (cart_response.status == 201) {
                cartproducts.add(productId);
                document.querySelector("#cart-count").innerText =
                  cartproducts.size;
                document.querySelector("#cart-count").style.display = "flex";

                // ✅ Add this line so your total count refreshes accurately from the backend too!
                refreshCartCount();
              }
              console.log(cart_response);
              console.log(cartdata.message);
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
      if (e.target.classList.contains("add-to-cart")) {
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
