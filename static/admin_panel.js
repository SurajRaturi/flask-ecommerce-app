let btn = document.querySelector("#add-category-btn");
let input = document.querySelector("#textinput");
// let h4=document.createElement("h4");
// document.querySelector("#addcatgeory").after(h4);
console.log("js started")
console.log(btn);
console.log(input);
// document.querySelector("#addcatgeory").append(h4)
btn.addEventListener("click", async () => {
    console.log("Button clicked")
    let add_response=await fetch("http://192.168.1.37:5000/Category",{
        method:"POST",
        headers:{
            "Authorization":`Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            "Category_name":input.value
        })
    });
    console.log("get response",add_response);
    let data=await add_response.json();
    if(add_response.status==201){
        alert(data.message);
    }
    else if(add_response.status==422){
        alert(data.errors.json.Category_name[0]);
    }
    else if(400<=add_response.status<422 || 422<add_response.status<500){
        alert(data.message);
    }
    console.log(add_response);
    console.log(data)

    
});
// console.log(select)

let delete_btn=document.querySelector("#delete-caetgory-btn");
let delete_category_input=document.querySelector("#delete_input");
delete_btn.addEventListener("click",async ()=>{
    let delete_category_response=await fetch(`http://192.168.1.37:5000/Catgeory/${delete_category_input.value}`,{
        method:"DELETE",
        headers:{
            "Authorization":`Bearer ${localStorage.getItem("access_token")}`
        }
    });
    let delete_category_data=await delete_category_response.json();
    if(delete_category_response.status==200){
        alert(delete_category_data.message);
    }
    else{
        alert(delete_category_data.message);
    }
})