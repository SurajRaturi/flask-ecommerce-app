let user_info=async ()=>{
    const auth = await fetch("http://192.168.1.37:5000/user",{
        headers:{
            "Authorization":`Bearer ${access_token}`
        }
    });
    console.log(auth.status)
    const data=await auth.json();
    if(auth.status==200){
        if(data.role=="admin"){
            document.querySelectorAll(".add-to-cart").forEach(button =>{
                button.innerHTML='<div class="admin-icon edit" ><i class="fa-solid fa-pen-to-square"></i></div>   <div class="admin-icon cross"><i class="fa-solid fa-xmark"></i></div>';
                button.className="new-icon";
                button.style.display="flex";
                button.style.gap="10px";
            
                document.querySelectorAll(".cross").forEach(button=>{
                    button.addEventListener("click",async()=>{
                        let product=button.closest(".product");
                        let delete_product_response=await fetch(`http://192.168.1.37:5000/product/${product.id}`,{
                            method:"DELETE",
                            headers:{
                                "Authorization":`Bearer ${localStorage.getItem("access_token")}`
                            }
                        });
                        let delete_product_data=await delete_product_response.json();
                        console.log(delete_product_response);
                        console.log(delete_product_data)
                        if(delete_product_response.status==200){
                            document.getElementById(product.id).remove();
                            console.log("removing")
                            alert(delete_product_data.message);
                            
                        }
                        else{
                            alert(delete_product_data.message);
                        }
                        
                        console.log(product.id)
                    })
                });
            });
            document.querySelectorAll(".edit").forEach(button  =>{
                console.log("element selected")
                let product=button.closest(".product");
                button.addEventListener("click",()=>{
                    console.log("button clicked");
                    console.log(product.id);
                    window.location.href=`/editproduct/${product.id}`;
                });
            });
        }
    };


}


async function fetch_product() {
    let fetch_response = await fetch("http://192.168.1.37:5000/products");
    let data = await fetch_response.json();

    data.forEach(product => {
        let productdiv = document.createElement("div");
        productdiv.className = "product";
        productdiv.id = product.product_id;
        
        let stock = product.stock > 0 ? "Available" : "Not Available";
        let offer_visibilty = product.offer > 0 ? "visible" : "hidden";
        let original_price = (product.price * 100) / (100 - product.offer);

        productdiv.innerHTML = `<div class="inner">
                    <img src="http://192.168.1.37:5000/${product.image_url}">
                </div>
                <div class="product-description">${product.description}</div>
                <div class="price">
                    <h1>₹${product.price}</h1>
                    <span>MRP : <s>₹${original_price.toFixed(2)}</s></span>
                    <h4>${stock}</h4>
                </div>
                <div class="container-2">
                    <div class="offer" style="visibility:${offer_visibilty}">${product.offer}% OFF</div>
                    <div class="add-to-cart" data-product-id="${product.product_id}">+</div>
                </div>`;
                
        // 🔄 ADD THIS CHECK HERE: 
        // If this product was already tracked in the cart across refresh, disable it immediately!
        const btn = productdiv.querySelector(".add-to-cart");
        if (typeof cartproducts !== 'undefined' && cartproducts.has(product.product_id.toString())) {
            btn.innerText = "✓";
            btn.style.pointerEvents = "none";
            btn.style.opacity = "0.6";
        }

        document.querySelector("#products").append(productdiv);
    });
}
(async()=>{
    await fetch_product();
    await user_info();

})();

document.querySelector("#search-icon").addEventListener("click", async () => {
    
    let input = document.querySelector(".nav-searchbox input");
    let fetch_product_response =await fetch(`http://192.168.1.37:5000/products/${input.value}`);

    let input_lower=document.querySelector("#outer");

    let data_search = await fetch_product_response.json();
    let stock;
    if (fetch_product_response.status == 200) {

        document.querySelector("#products").innerHTML = "";

        data_search.forEach(product => {
            let productdiv = document.createElement("div");
            productdiv.className = "product";
            productdiv.id=product.product_id;
            if(product.stock>0){
                stock="Available";
            }else{
                stock="Not Available";
            };

            let offer_visibilty;
            if(product.offer>0){
                offer_visibilty="visible";
            }
            else{
                offer_visibilty="hidden";
            }

            let original_price =
                (product.price * 100) / (100 - product.offer);

            productdiv.innerHTML = `<div class="inner">
                    <img src="http://192.168.1.37:5000/${product.image_url}">
                </div>
                <div  class="product-description">${product.description}</div>
                <div class="price">
                    <h1>₹${product.price}</h1>
                    <span>MRP : <s>₹${original_price.toFixed(2)}</s></span>
                    <h4>${stock}</h4>
                </div>
                <div class="container-2">
                    <div class="offer" style="visibility:${offer_visibilty}">${product.offer}% OFF</div>
                    <div class="add-to-cart" data-product-id="${product.product_id}">+</div>
                </div>
                    
                    
                </div>`;

            document.querySelector("#products").append(productdiv);
            console.log(product)
        });

        (async()=>{
            await user_info();
        })();

        
    }
    else if(fetch_product_response.status==404){
        document.querySelector("main").innerHTML='<img src="static/errorsvg.svg" id="errorimage">';
        document.querySelector("#errorimage").style.width="40%";
        document.querySelector("#errorimage").style.height="70%";
        document.querySelector("main").style.fontFamily="Gill Sans";
        document.querySelector("main").style.fontSize="30px";
        document.querySelector("main").style.display="flex";
        document.querySelector("main").style.alignItems="center";
        document.querySelector("main").style.justifyContent="center";
        document.querySelector("main").style.backgroundColor="white";
        document.querySelector("main").style.height="100%";
    }
    



})



document.querySelector("#search-icon-lower").addEventListener("click", async () => {
    
    let input_mobile = document.querySelector("#searchbox input");
    let mobile_Search_response =await fetch(`http://192.168.1.37:5000/products/${input_mobile.value}`);
    let mobile_data = await mobile_Search_response.json();
    let stock;
    if (mobile_Search_response.status == 200) {

        document.querySelector("#products").innerHTML = "";

        mobile_data.forEach(product => {
            let productdiv = document.createElement("div");
            productdiv.className = "product";
            productdiv.id=product.product_id;


            if(product.stock>0){
                stock="Available";
            }else{
                stock="Not Available";
            };



            let offer_visibilty;
            if(product.offer>0){
                offer_visibilty="visible";
            }
            else{
                offer_visibilty="hidden";
            };

            let original_price =
                (product.price * 100) / (100 - product.offer);

            productdiv.innerHTML = `<div class="inner">
                    <img src="http://192.168.1.37:5000/${product.image_url}">
                </div>
                <div  class="product-description">${product.description}</div>
                <div class="price">
                    <h1>₹${product.price}</h1>
                    <span>MRP : <s>₹${original_price.toFixed(2)}</s></span>
                    <h4>${stock}</h4>
                </div>
                <div class="container-2">
                    <div class="offer" style="visibility:${offer_visibilty}">${product.offer}% OFF</div>
                    <div class="add-to-cart" data-product-id="${product.product_id}">+</div>
                </div>
                    
                    
                </div>`;

            document.querySelector("#products").append(productdiv);
            console.log(product)
        });
        (async()=>{
            await user_info();
        })();
    }
    else if(mobile_Search_response.status==404){
        document.querySelector("main").innerHTML='<img src="/static/errorsvg.svg">';
        document.querySelector("#errorimage").style.width="40%";
        document.querySelector("#errorimage").style.height="70%";
        document.querySelector("main").style.fontFamily="Gill Sans";
        document.querySelector("main").style.fontSize="30px";
        document.querySelector("main").style.display="flex";
        document.querySelector("main").style.alignItems="center";
        document.querySelector("main").style.justifyContent="center";
        document.querySelector("main").style.backgroundColor="white";
        document.querySelector("main").style.height="100%";
    }
    



})