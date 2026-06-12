
window.addEventListener("pageshow",(e)=>{

    console.log("pageshow", e.persisted);
    if (e.persisted) {
        location.reload();
    }
    const access_token=localStorage.getItem("access_token");
    let username;
    let span=document.createElement("span");
    let icon=document.querySelector("nav #container");
    let dropdown=document.querySelector("#dropdown");
    span.id="current-user";
    async function refreshCartCount() {
        const response = await fetch("http://192.168.1.37:5000/User_Cart", {
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        })


        const cart_data = await response.json();

        const countElement = document.querySelector("#cart-count");

        if (cart_data.length > 0) {
            countElement.innerText = cart_data.length;
            countElement.style.display = "block";
        } else {
            countElement.innerText = "";
            countElement.style.display = "none";
        }
    }
    let cartproducts=new Set();

    console.log(access_token);

    if(access_token){
        console.log("access token found")





        let user_info=async ()=>{
            const auth = await fetch("http://192.168.1.37:5000/user",{
                headers:{
                    "Authorization":`Bearer ${access_token}`
                }
            });
            console.log(auth.status)
            const data=await auth.json();
            username=data["username"];
            console.log("username added to variable")

            if(auth.status==200){

                console.log("get response 200 for authentication")


                if(data.role=="admin"){

                    console.log("user is admin")



                    dropdown.innerHTML=`<a href='#'>My Profile</a><a href='/admin' id='manage_product'>Manage Products</a><a href='#' id='Logout'>Logout</a>`;
                    span.innerHTML=`<h3>Hello , ${username}</h3>`;
                    document.querySelector("#cart").remove();
                    document.querySelectorAll(".add-to-cart").forEach(button =>{
                        button.innerHTML='<div class="admin-icon edit" ><i class="fa-solid fa-pen-to-square"></i></div>   <div class="admin-icon cross"><i class="fa-solid fa-xmark"></i></div>';
                        button.className="new-icon";
                        button.style.display="flex";
                        button.style.gap="10px"
                        
                    })
                    span.style.color="black";
                    span.style.fontFamily="Gill Sans";
                    span.style.display="flex";
                    span.style.alignItems="center";
                    dropdown.style.right="20px";
                    // icon.style.marginLeft="330px"
                    icon.prepend(span);
                    console.log("dropdown editted")
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

                    document.querySelectorAll(".edit").forEach(button  =>{
                        console.log("element selected")
                        let product=button.closest(".product");
                        button.addEventListener("click",()=>{
                            console.log("button clicked");
                            console.log(product.id);
                            window.location.href=`/editproduct/${product.id}`;
                        });
                    });

                }else{
                    dropdown.innerHTML="<a href='#'>My Profile</a><a href='/orders'>Orders</a><a href='#' id='Logout'>Logout</a>";
                    span.innerHTML=`<h3>Hello , ${username}</h3>`;
                    span.style.color="black";
                    span.style.fontFamily="Gill Sans";
                    span.style.display="flex";
                    span.style.alignItems="center";
                    // icon.style.marginLeft="330px"
                    icon.prepend(span);
                    console.log("greeting added");
                }
                const cart=document.querySelector("#cart");
                if(cart){
                    cart.addEventListener("click",()=>{
                        window.location.href="/cart";
                    });
                }
            document.addEventListener("click", async (e) => {
                if (e.target.classList.contains("add-to-cart")) {

                    console.log("button clicked"); 

                    const productId=e.target.dataset.productId;
                    console.log("productid : ",productId);
                    if(!cartproducts.has(productId)){
                        console.log("Before fetch");
                        let cart_response=await fetch(`http://192.168.1.37:5000/addtocart/${Number(productId)}`,{
                            method:"POST",
                            headers:{
                                "Content-Type":"application/json",
                                "Authorization":`Bearer ${access_token}`
                            },
                            body:JSON.stringify({
                                "quantity":1
                            })
                        });
                        let cartdata=await cart_response.json();
                        console.log("After fetch")
                        if(cart_response.status==201){
                            
                            cartproducts.add(productId);
                            document.querySelector("#cart-count").innerText = cartproducts.size;
                            document.querySelector("#cart-count").style.display = "flex";
                            
                        };
                        console.log(cart_response);
                        console.log(cartdata.message);
                        

                    };
                    
                }
            });

            refreshCartCount();
            }
            else if(auth.status==401){
                localStorage.removeItem("access_token");
                window.location.reload();
            
            }
            let logout=document.querySelector("#dropdown #Logout");
            if(logout){
                logout.addEventListener("click", async()=>{
                    let logout_response=await fetch("http://192.168.1.37:5000/logout",{
                        method:"POST",
                        headers:{
                            "Authorization":`Bearer ${access_token}`
                        }
                    })
                    if(logout_response["status"]==200){
                        localStorage.removeItem("access_token");
                        window.location.reload();
                    }
                })
            };
            
        }
        user_info();
        
    }else{
        document.addEventListener("click", (e) => {
            if (e.target.classList.contains("add-to-cart")) {
                const productId=e.target.dataset.productId;
                if(!cartproducts.has(productId)){
                    cartproducts.add(productId);
                    document.querySelector("#cart-count").innerText = cartproducts.size;
                    document.querySelector("#cart-count").style.display = "block";
                };
            
            }
        });
        
    }

});