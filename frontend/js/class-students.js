const params = new URLSearchParams(
    window.location.search
);

const className = params.get(
    "class"
);

document.getElementById(
    "classTitle"
).innerText =

`${className} Students`;

async function loadStudents(){

    console.log("Loading students...");

    const response = await fetch(

        `${BASE_URL}/student/class/${className}`,

        {
            headers:{
                Authorization:
                `Bearer ${getToken()}`
            }
        }
    );

    const students = await response.json();

    console.log(students);

    let html = "";

    students.forEach(student => {

        html += `

            <tr>

                <td>
                    ${student.student_id}
                </td>

                <td>
                    ${student.name}
                </td>

                <td>
                    ${student.phone}
                </td>

                <td>

                    <button
                        class="present-btn"
                        onclick="
                            markAttendance(
                                ${student.id},
                                'Present'
                            )
                        "
                    >
                        Present
                    </button>

                    <button
                        class="absent-btn"
                        onclick="
                            markAttendance(
                                ${student.id},
                                'Absent'
                            )
                        "
                    >
                        Absent
                    </button>

                </td>

            </tr>
        `;
    });

    document.getElementById(
        "studentsTable"
    ).innerHTML = html;
}

async function markAttendance(
    studentId,
    status
){

    console.log(
        "BUTTON CLICKED"
    );

    const today =
    new Date()
    .toISOString()
    .split("T")[0];

    const body = {

        student_id: studentId,

        date: today,

        time_slot: "Morning",

        status: status
    };

    console.log(body);

    try{

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

        console.log(response);

        const data =
        await response.json();

        console.log(data);

        showToast(
            data.message
        );

    }

    catch(error){

        console.log(error);

        alert(error);
    }
}

loadStudents();