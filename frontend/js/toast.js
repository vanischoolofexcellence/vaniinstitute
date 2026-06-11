function showToast(message){

    const toast =
    document.createElement("div");

    toast.classList.add("toast");

    toast.innerText = message;

    document.body.appendChild(
        toast
    );

    setTimeout(() => {

        toast.remove();

    },3000);
}