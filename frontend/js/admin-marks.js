async function addMarks(){

    const body = {

        student_id:
        parseInt(
            document.getElementById(
                "student_id"
            ).value
        ),

        subject:
        document.getElementById(
            "subject"
        ).value,

        marks:
        parseInt(
            document.getElementById(
                "marks"
            ).value
        ),

        exam_type:
        document.getElementById(
            "exam_type"
        ).value,

        date:
        document.getElementById(
            "date"
        ).value
    };

    const response = await fetch(

        `${BASE_URL}/marks/add`,

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
        "Marks Added"
    );
}