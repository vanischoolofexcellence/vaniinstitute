async function loadDashboard(){

    try{

        const response = await fetch(

            `${BASE_URL}/admin/analytics`,

            {
                headers:{
                    Authorization:
                    `Bearer ${getToken()}`
                }
            }
        );

        const data =
        await response.json();

        document.getElementById(
            "analyticsCards"
        ).innerHTML = `

            <div class="dashboard-card">

                <h2>
                    Total Students
                </h2>

                <h1>
                    ${data.total_students}
                </h1>

            </div>



            <div class="dashboard-card">

                <h2>
                    This Month Revenue
                </h2>

                <h1>
                    ₹${data.monthly_revenue || 0}
                </h1>

            </div>

        `;

    }

    catch(error){

        console.log(error);

        alert(
            "Failed To Load Dashboard"
        );
    }
}


async function loadMonthRevenue(){

    try{

        const month =
        document.getElementById(
            "monthSelect"
        ).value;

        const response = await fetch(

            `${BASE_URL}/admin/revenue/${month}`,

            {
                headers:{
                    Authorization:
                    `Bearer ${getToken()}`
                }
            }
        );

        const data =
        await response.json();

        document.getElementById(
            "monthRevenue"
        ).innerText =

        `₹${data.revenue}`;

    }

    catch(error){

        console.log(error);
    }
}


loadDashboard();

document.addEventListener(

    "DOMContentLoaded",

    () => {

        const monthSelect =
        document.getElementById(
            "monthSelect"
        );

        if(monthSelect){

            monthSelect.addEventListener(

                "change",

                loadMonthRevenue
            );

            loadMonthRevenue();
        }
    }
);