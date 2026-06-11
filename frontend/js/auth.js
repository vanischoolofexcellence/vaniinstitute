async function studentLogin(){


    const student_id =
    document.getElementById(
        "student_id"
    ).value;

    const password =
    document.getElementById(
        "password"
    ).value;

    const response = await fetch(

        `${BASE_URL}/student/login`,

        {
            method:"POST",

            headers:{
                "Content-Type":
                "application/json"
            },

            body:JSON.stringify({

                student_id,
                password

            })
        }
    );

    const data =
    await response.json();
    console.log("full response=",data);
    alert(JSON.stringify(data));
    localStorage.setItem(
        "token",
        data.access_token
    );

    console.log(
        "LOGIN RESPONSE:",
        data
    );

    if(!response.ok){

        alert(
            data.detail ||
            data.message ||
            "Login Failed"
        );

        return;
    }
    console.log("full response=",data);
    console.log("token from api=",data.access_token);



    localStorage.setItem(

        "token",

        data.access_token
    );

    localStorage.setItem(

        "must_change_password",

        data.must_change_password
    );

    if(
        data.must_change_password
    ){

        window.location.href =
        "change-password.html";

        return;
    }

    window.location.href =
    "dashboard.html";
}