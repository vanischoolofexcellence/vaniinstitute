async function loadStudents(){

    const response = await fetch(

        `${BASE_URL}/student/students-by-class`,

        {
            headers:{
                Authorization:
                `Bearer ${getToken()}`
            }
        }
    );

    const data =
    await response.json();

    const search = document
    .getElementById("search")
    .value
    .toLowerCase();

    let html = "";

    for(const className in data){

        let tableRows = "";
        let cardRows = "";

        data[className].forEach(student => {

            if(

                !student.name
                .toLowerCase()
                .includes(search)

                &&

                !student.student_id
                .toLowerCase()
                .includes(search)

                &&

                !student.phone
                .includes(search)

            ){
                return;
            }

            tableRows += `

                <tr>

                    <td>${student.student_id}</td>

                    <td>${student.name}</td>

                    <td>${student.phone}</td>

                </tr>

            `;

            cardRows += `

                <div class="student-card">

                    <h3>
                        ${student.name}
                    </h3>

                    <p>
                        <b>ID:</b>
                        ${student.student_id}
                    </p>

                    <p>
                        <b>Phone:</b>
                        ${student.phone}
                    </p>

                    <p>
                        <b>Class:</b>
                        ${className}
                    </p>

                </div>

            `;
        });

        if(tableRows === ""){
            continue;
        }

        html += `

            <div class="card">

                <h2>
                    Class ${className}
                </h2>

                <br>

                <div class="table-container">

                    <table class="table">

                        <thead>

                            <tr>

                                <th>
                                    Student ID
                                </th>

                                <th>
                                    Name
                                </th>

                                <th>
                                    Phone
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            ${tableRows}

                        </tbody>

                    </table>

                </div>

                <div class="mobile-students">

                    ${cardRows}

                </div>

            </div>

            <br>

        `;
    }

    document.getElementById(
        "studentsContainer"
    ).innerHTML = html;
}

loadStudents();