const token =
localStorage.getItem("token");

async function loadMarks(){

    const response = await fetch(

        `${BASE_URL}/marks/student/history`,

        {
            headers:{
                Authorization:
                `Bearer ${token}`
            }
        }
    );

    const data =
    await response.json();

    let html = "";
    let cardsHtml = "";

    data.forEach(mark => {

        html += `

            <tr>

                <td>${mark.date}</td>

                <td>${mark.subject}</td>

                <td>${mark.marks}</td>

                <td>${mark.exam_name}</td>

            </tr>
        `;

        cardsHtml += `

            <div class="student-card">

                <p><b>Date:</b> ${mark.date}</p>

                <p><b>Subject:</b> ${mark.subject}</p>

                <p><b>Marks:</b> ${mark.marks}</p>

                <p><b>Exam:</b> ${mark.exam_name}</p>

            </div>

        `;
    });

    document.getElementById(
        "marksTable"
    ).innerHTML = html;

    document.getElementById(
        "marksCards"
    ).innerHTML = cardsHtml;
}

loadMarks();