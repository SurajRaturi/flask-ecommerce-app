access_token = localStorage.getItem("access_token");
function noporudct() {
  const main = document.querySelector("main");
  main.innerHTML = `<h1>No product has been uploaded yet</h1>`;
  main.classList.add("no-product");
}
let user_info = async () => {
  const auth = await fetch("/user", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  const data = await auth.json();
  if (auth.status == 200) {
    if (data.role == "admin") {
      document.querySelectorAll(".icon-container").forEach((button) => {
        button.innerHTML =
          '<div class="admin-icon edit" ><i class="fa-solid fa-pen-to-square"></i></div>   <div class="admin-icon cross"><i class="fa-solid fa-xmark"></i></div>';
        button.className = "new-icon";
        button.style.display = "flex";
        button.style.gap = "10px";

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
      });
      document.querySelectorAll(".edit").forEach((button) => {
        let product = button.closest(".item");
        button.addEventListener("click", () => {
          console.log("button clicked");
          console.log(product.id);
          window.location.href = `/editproduct/${product.id}`;
        });
      });
    }
  }
};

async function fetch_product() {
  let fetch_response = await fetch("/products");
  let data = await fetch_response.json();
  if (data.length > 0) {
    data.forEach((product) => {
      let productdiv = document.createElement("div");
      productdiv.className = "item";
      productdiv.id = product.product_id;

      let stock = product.stock > 0 ? "Available" : "Not Available";
      let offer_visibilty = product.offer > 0 ? "visible" : "hidden";
      let original_price = (product.price * 100) / (100 - product.offer);

      productdiv.innerHTML = `<div class="image"><img src="${product.image_url}" alt="Product_image"></div>
              <p class="description">
                ${product.description}
              </p>
              <div class="price">
                <span><h2>₹${product.price}</h2></span>
                <span>MRP : <s>₹${original_price.toFixed(2)}</s></span>
              </div>
              <div class="lower">
                <div class="offer">${product.offer}%OFF</div>
                <div class="icon-container">
                  <div class="addtocart" data-product-id="${product.product_id}">
                    <i class="fa-solid fa-cart-arrow-down"></i></i>
                  </div>
                </div>
              </div>`;

      // 🔄 ADD THIS CHECK HERE:
      // If this product was already tracked in the cart across refresh, disable it immediately!
      const btn = productdiv.querySelector(".addtocart");
      if (
        typeof cartproducts !== "undefined" &&
        cartproducts.has(product.product_id.toString())
      ) {
        btn.innerText = "✓";
        btn.style.pointerEvents = "none";
        btn.style.opacity = "0.6";
      }

      document.querySelector("#main-content").append(productdiv);
    });
  } else {
    noporudct();
  }
}
(async () => {
  await fetch_product();
  await user_info();
})();

document.querySelector("search button").addEventListener("click", async () => {
  let input = document.querySelector("search input");
  let fetch_product_response = await fetch(`/products/${input.value}`);

  let data_search = await fetch_product_response.json();
  let stock;
  if (!!input.value) return;
  if (fetch_product_response.status == 200) {
    document.querySelector("#main-content").innerHTML = "";

    data_search.forEach((product) => {
      let productdiv = document.createElement("div");
      productdiv.className = "item";
      productdiv.id = product.product_id;
      if (product.stock > 0) {
        stock = "Available";
      } else {
        stock = "Not Available";
      }

      let offer_visibilty;
      if (product.offer > 0) {
        offer_visibilty = "visible";
      } else {
        offer_visibilty = "hidden";
      }

      let original_price = (product.price * 100) / (100 - product.offer);

      productdiv.innerHTML = `<div class="image"><img src="${product.image_url}" alt="Product_image"></div>
            <p class="description">
              ${product.description}
            </p>
            <div class="price">
              <span><h2>₹${product.price}</h2></span>
              <span>MRP : <s>₹${original_price.toFixed(2)}</s></span>
            </div>
            <div class="lower">
              <div class="offer">${product.offer}%OFF</div>
              <div class="icon-container">
                <div class="addtocart" data-product-id="${product.product_id}">
                  <i class="fa-solid fa-cart-arrow-down"></i></i>
                </div>
              </div>
            </div>`;

      document.querySelector("#main-content").append(productdiv);
      console.log(product);
    });

    (async () => {
      await user_info();
    })();
  } else if (fetch_product_response.status == 404) {
    document.querySelector("main").innerHTML =
      '<img src="static/errorsvg.svg" id="errorimage">';
    document.querySelector("#errorimage").style.width = "40%";
    document.querySelector("#errorimage").style.height = "70%";
    document.querySelector("main").style.fontFamily = "Gill Sans";
    document.querySelector("main").style.fontSize = "30px";
    document.querySelector("main").style.display = "flex";
    document.querySelector("main").style.alignItems = "center";
    document.querySelector("main").style.justifyContent = "center";
    document.querySelector("main").style.backgroundColor = "white";
    document.querySelector("main").style.height = "100%";
  }
});

document.querySelector("#search button").addEventListener("click", async () => {
  let input_mobile = document.querySelector("#search input");
  let mobile_Search_response = await fetch(`/products/${input_mobile.value}`);
  let mobile_data = await mobile_Search_response.json();
  let stock;
  if (!!input_mobile.value) return;
  if (mobile_Search_response.status == 200) {
    document.querySelector("#main-content").innerHTML = "";

    mobile_data.forEach((product) => {
      let productdiv = document.createElement("div");
      productdiv.className = "item";
      productdiv.id = product.product_id;

      if (product.stock > 0) {
        stock = "Available";
      } else {
        stock = "Not Available";
      }

      let offer_visibilty;
      if (product.offer > 0) {
        offer_visibilty = "visible";
      } else {
        offer_visibilty = "hidden";
      }

      let original_price = (product.price * 100) / (100 - product.offer);

      productdiv.innerHTML = `<div class="image"><img src="${product.image_url}" alt="Product_image"></div>
            <p class="description">
              ${product.description}
            </p>
            <div class="price">
              <span><h2>₹${product.price}</h2></span>
              <span>MRP : <s>₹${original_price.toFixed(2)}</s></span>
            </div>
            <div class="lower">
              <div class="offer">${product.offer}%OFF</div>
              <div class="icon-container">
                <div class="addtocart" data-product-id="${product.product_id}">
                  <i class="fa-solid fa-cart-arrow-down"></i></i>
                </div>
              </div>
            </div>`;

      document.querySelector("#main-content").append(productdiv);
      console.log(product);
    });
    (async () => {
      await user_info();
    })();
  } else if (mobile_Search_response.status == 404) {
    document.querySelector("main").innerHTML =
      '<img src="/static/errorsvg.svg">';
    document.querySelector("#errorimage").style.width = "40%";
    document.querySelector("#errorimage").style.height = "70%";
    document.querySelector("main").style.fontFamily = "Gill Sans";
    document.querySelector("main").style.fontSize = "30px";
    document.querySelector("main").style.display = "flex";
    document.querySelector("main").style.alignItems = "center";
    document.querySelector("main").style.justifyContent = "center";
    document.querySelector("main").style.backgroundColor = "white";
    document.querySelector("main").style.height = "100%";
  }
});
