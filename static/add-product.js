let add_option=async ()=>{
    let option_response=await fetch("http://192.168.1.37:5000/Category",{
        method:"GET",
        headers:{
            "Authorization":`Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type":"application/json"
        }
    })
    data=await option_response.json();
    for(let i of data){
        let option=document.createElement("option");
        option.value=i.Category_name;
        option.innerText=i.Category_name;
        document.querySelector("#categoryselect").append(option);
    }
    console.log(document.querySelector("#categoryselect").value);
    document.querySelector("#categoryselect").addEventListener("change",()=>{
        console.log(document.querySelector("#categoryselect").value);
    })
    
}
add_option();
