let parts = window.location.pathname.split("/");
console.log(typeof parts[2]);
let form = document.querySelector("#productForm");
document
  .querySelector("#productForm button")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    let formdata = new FormData(form);
    formdata.delete("category");
    let form_response = await fetch(`/product/${Number(parts[2])}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: formdata,
    });
    console.log("beforedata");
    let data = await form_response.json();
    if (form_response.status == 201) {
      alert(data.message);
    } else if (
      400 <= form_response.status < 422 ||
      422 < form_response.status < 500
    ) {
      alert(data.message);
    } else if (add_response.status == 422) {
      alert(data.errors.form.Category_name[0]);
    }
    console.log(form_response);
    console.log(data);
  });
