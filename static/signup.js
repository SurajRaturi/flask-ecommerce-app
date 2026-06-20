let base_url = "/";
let signupbtn = document.querySelector("#signup button");
let username = document.querySelector("#username input");
let password = document.querySelector("#password input");
let email = document.querySelector("#email input");
let eye = document.querySelector("#password .eye");
signupbtn.addEventListener("click", async () => {
  let signup_info = await fetch("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username.value,
      password: password.value,
      email: email.value,
    }),
  });
  let response = await signup_info.json();
  console.log(response);
  if (signup_info.status === 404) {
    alert(response.message);
  }
  if (signup_info.status == 201) {
    localStorage.setItem("access_token", response["Access token"]);
    localStorage.setItem("refresh_token", response["refersh token"]);
    console.log("Cookie stored!");
    alert(response.message);
    window.location.href = "/login";
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

window.addEventListener("pageshow", function (event) {
  if (event.persisted) {
    window.location.reload();
  }
});
