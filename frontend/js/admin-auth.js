async function adminLogin(){

    const email = document.getElementById(
        "email"
    ).value;

    const password = document.getElementById(
        "password"
    ).value;

    const response = await fetch(

        `${BASE_URL}/auth/admin/login`,

        {
            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                email,
                password
            })
        }
    );

    const data = await response.json();
    console.log(data);

    if(response.ok){

        localStorage.setItem(
            "token",
            data.access_token
        );

        window.location.href =
        "dashboard.html";
    }

    else{
        showToast(
            data.detail ||
            "Login failed"
        );
    }
}