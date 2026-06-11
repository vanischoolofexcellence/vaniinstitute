async function addFees(){

    const body = {

        student_id:
        parseInt(
            document.getElementById(
                "student_id"
            ).value
        ),

        amount:
        parseInt(
            document.getElementById(
                "amount"
            ).value
        ),

        paid_month:
        document.getElementById(
            "paid_month"
        ).value,

        payment_date:
        document.getElementById(
            "payment_date"
        ).value,

        status:
        document.getElementById(
            "status"
        ).value
    };

    const response = await fetch(

        `${BASE_URL}/fees/add`,

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
        "Fees Added"
    );
}