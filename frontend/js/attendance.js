const token =
localStorage.getItem("token");
let attendanceData = {};

async function loadAttendance(){

    const response = await fetch(
        `${BASE_URL}/attendance/student/history`,
        {
            headers:{
                Authorization:
                `Bearer ${token}`
            }
        }
    );

    const data =
    await response.json();
    console.log(data);

    const grouped = {};

    data.forEach(item => {

        if(!grouped[item.date]){

            grouped[item.date] = {

                morning: "❌ Absent",
                evening: "❌ Absent"
            };
        }

        if(item.time_slot === "Morning"){

            grouped[item.date].morning =
            item.status === "Present"
            ?
            "✅ Present"
            :
            "❌Absent";
        }

        if(item.time_slot === "Evening"){

            grouped[item.date].evening =
            item.status === "Present"
            ?
            "✅ Present"
            :
            "❌Absent";

        }
    });

    attendanceData=grouped;

    let tableHtml = "";
    let cardHtml = "";

    Object.keys(grouped).forEach(date => {

        tableHtml += `

        <tr>

            <td>${date}</td>

            <td>
                ${grouped[date].morning}
            </td>

            <td>
                ${grouped[date].evening}
            </td>

        </tr>

        `;

        cardHtml += `

        <div class="mobile-card">

            <h3>
                📅 ${date}
            </h3>

            <p>
                🌅 Morning :
                ${grouped[date].morning}
            </p>

            <p>
                🌙 Evening :
                ${grouped[date].evening}
            </p>

        </div>

        `;
    });

    document.getElementById(
        "attendanceTable"
    ).innerHTML = tableHtml;

    document.getElementById(
        "attendanceCards"
    ).innerHTML = cardHtml;
}

loadAttendance();

function filterAttendance(){

    const selectedDate =
    document.getElementById(
        "attendanceSearch"
    ).value;

    let cardHtml = "";

    Object.keys(attendanceData)
    .forEach(date => {

        if(
            selectedDate === "" ||
            date === selectedDate
        ){

            cardHtml += `

            <div class="mobile-card">

                <h3>
                    📅 ${date}
                </h3>

                <p>
                    🌅 Morning :
                    ${attendanceData[date].morning}
                </p>

                <p>
                    🌙 Evening :
                    ${attendanceData[date].evening}
                </p>

            </div>

            `;
        }
    });

    document.getElementById(
        "attendanceCards"
    ).innerHTML = cardHtml;
}