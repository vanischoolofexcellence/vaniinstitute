async function addAttendance(){

    const body = {

        student_id:
        parseInt(
            document.getElementById(
                "student_id"
            ).value
        ),

        date:
        document.getElementById(
            "date"
        ).value,

        time_slot:
        document.getElementById(
            "time_slot"
        ).value,

        status:
        document.getElementById(
            "status"
        ).value
    };

    const response = await fetch(

        `${BASE_URL}/attendance/add`,

        {
            method:"POST",

            headers:{
                "Content-Type":"application/json",

                Authorization:
                `Bearer ${getToken()}`
            },

            body:JSON.stringify(body)
        }
    );

    const data = await response.json();

    showToast(
        data.message ||
        "Attendance Saved"
    );
}