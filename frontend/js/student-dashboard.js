const token =
localStorage.getItem("token");

async function loadDashboard(){

    const response = await fetch(

        `${BASE_URL}/student/me`,

        {
            headers:{
                Authorization:
                `Bearer ${token}`
            }
        }
    );

    const student =
    await response.json();

    document.getElementById(
        "studentGreeting"
    ).innerText =
    `Hello, ${student.name} 👋`;

    document.getElementById(
        "studentName"
    ).innerText =
    "Welcome Back";

    const attendanceResponse =
    await fetch(

        `${BASE_URL}/attendance/student/my-summary`,

        {
            headers:{
                Authorization:
                `Bearer ${token}`
            }
        }
    );

    const attendance =
    await attendanceResponse.json();

    document.getElementById(
        "attendanceSummary"
    ).innerHTML = `

        <p>
            Morning:
            ${attendance.morning_present}
            /
            ${attendance.total_days}
        </p>

        <p>
            Evening:
            ${attendance.evening_present}
            /
            ${attendance.total_days}
        </p>

    `;
}

loadDashboard();