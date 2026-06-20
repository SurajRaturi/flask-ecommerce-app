console.log("js started");
let base_url = "/";
let loginbtn = document.querySelector("#login button");
let username = document.querySelector("#username input");
let password = document.querySelector("#password input");
let h4 = document.createElement("h4");
let eye = document.querySelector("#password .eye");
h4.id = "errormessage";
loginbtn.addEventListener("click", async () => {
  let login_info = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username.value,
      password: password.value,
    }),
  });
  let response = await login_info.json();
  console.log(login_info);
  console.log(response);
  if (login_info.status === 400) {
    alert(response.message);
  }
  if (login_info.status == 200) {
    localStorage.setItem("access_token", response["Access token"]);
    localStorage.setItem("refresh_token", response["refersh token"]);
    window.location.href = "/";

    console.log("Cookie stored!");
  }
});
let hiden = true;
eye.addEventListener("click", () => {
  if (hiden == true) {
    hiden = false;
    eye.innerHTML = "<i class='fa-solid fa-eye-slash' id='eye'></i>";
    password.type = "password";
  } else {
    hiden = true;
    eye.innerHTML = "<i class='fa-solid fa-eye' id='eye'></i>";
    password.type = "text";
  }
});

// loginbtn.addEventListener("click",()=>{
//     console.log(`username : ${username.value}\npassword: ${password.value}`)
// })
window.addEventListener("pageshow", function (event) {
  if (event.persisted) {
    window.location.reload();
  }
});
