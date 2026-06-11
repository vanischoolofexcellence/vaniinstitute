const token =
localStorage.getItem(
    "token"
);

async function addStudent(){

    try{

        const body = {

            name:
            document.getElementById(
                "name"
            ).value,

            father_name:
            document.getElementById(
                "father_name"
            ).value,

            phone:
            document.getElementById(
                "phone"
            ).value,

            class_name:
            document.getElementById(
                "class_name"
            ).value,

            school_name:
            document.getElementById(
                "school_name"
            ).value,

            joining_date:
            document.getElementById(
                "joining_date"
            ).value,

            address:
            document.getElementById(
                "address"
            ).value
        };

        const response = await fetch(

            `${BASE_URL}/student/add`,

            {
                method:"POST",

                headers:{

                    "Content-Type":
                    "application/json",

                    Authorization:
                    `Bearer ${token}`
                },

                body:
                JSON.stringify(body)
            }
        );

        const data =
        await response.json();

        if(response.ok){

            alert(
                data.message
            );
        }

        else{

            alert(
                data.detail
                ||
                "Failed To Add Student"
            );
        }
    }

    catch(error){

        console.log(error);

        alert(
            "Server Error"
        );
    }
}