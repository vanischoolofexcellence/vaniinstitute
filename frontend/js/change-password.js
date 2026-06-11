const token =
localStorage.getItem("token");
console.log("TOKEN=",token);

async function changePassword(){

    const old_password =
    document.getElementById(
        "oldPassword"
    ).value;

    const new_password =
    document.getElementById(
        "newPassword"
    ).value;

    const response =
    await fetch(

        `${BASE_URL}/student/change-password`,

        {

            method:"PUT",

            headers:{

                "Content-Type":
                "application/json",

                Authorization:
                `Bearer ${token}`
            },

            body:JSON.stringify({

                old_password,

                new_password

            })
        }
    );

    const data =
    await response.json();

    alert(data.message);

    if(response.ok){
        console.log("success block hit");
        localStorage.setItem(
            "must_change_password",
            "false"
        );

        alert("Going to Dashboard");

       

        window.location.replace(
            "dashboard.html"
        );
        
    }
}