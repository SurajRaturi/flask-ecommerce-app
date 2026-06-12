window.addEventListener("pageshow",(e)=>{

    console.log("pageshow", e.persisted);
    if (e.persisted) {
        location.reload();
    }
    async function get_order_items() {

        let get_order = await fetch("http://192.168.1.37:5000/Your-Orders", {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`
            }
        });

        let get_order_data = await get_order.json();
        console.log(get_order)
        console.log(get_order_data);

        const container = document.querySelector(".cart-container");

        if (get_order_data.length > 0) {

            get_order_data.forEach(product => {

                let order_item = document.createElement("div");
                order_item.className = "cart-item";
                order_item.id = product.order_id;
                
                let bgcolor;
                let color;
                if(product.status=="Received"){
                    bgcolor="rgba(20, 234, 16, 0.29)";
                    color="rgb(30, 94, 0)";
                }else if(product.status=="Pending"){
                    bgcolor="rgba(234, 16, 16, 0.29)";
                    color="rgb(218, 0, 0)";
                }else if(product.status=="Dispatched"){
                    bgcolor="rgba(255, 98, 0, 0.29)";
                    color="rgb(218, 51, 0)";
                }

                order_item.innerHTML = `
                    <div class="product">
                        <img src="http://192.168.1.37:5000/${product.image}">
                        <div>
                            <h3>${product.name}(${product.quantity})</h3>
                            <h4>Order ID - #3F004GHTZQ-${product.order_id}</h4>
                            <button class="cancel-btn" id="${product.order_id}">Cancel Order</div>
                        </div>
                    </div>

                    <div class="status" style="padding:5px;background-color:${bgcolor};color:${color};width:70px;border-radius:10px">${product.status}</div>

                    <div class="price">₹${product.price}</div>

                    <div class="subtotal">
                        ₹${product.price * product.quantity}
                    </div>
                `;

                container.append(order_item);

            });

        } else {

            let order_item = document.createElement("div");
            order_item.className = "cart-item";
            order_item.innerHTML = `<h1>No order has been placed</h1>`;

            order_item.style.display = "flex";
            order_item.style.alignItems = "center";
            order_item.style.justifyContent = "center";

            container.append(order_item);
        }
        document.querySelectorAll(".cancel-btn").forEach(button=>{
            button.addEventListener("click",async()=>{
                let cancel_order_response=await fetch(`http://192.168.1.37:5000/cancel-order/${Number(button.id)}`,{
                    method:"DELETE",
                    headers:{
                        "Authorization":`Bearer ${localStorage.getItem("access_token")}`
                    }
                });
                let cancel_order_data=await cancel_order_response.json();
                if(cancel_order_response.status==200){
                    alert(cancel_order_data.message);
                    window.location.reload();

                }else{
                    alert(cancel_order_data.message);
                }
            })
        })
    }

    get_order_items();
    
});