const token =
localStorage.getItem("token");

async function loadFees(){

    const response = await fetch(

        `${BASE_URL}/fees/history`,

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

    data.forEach(fee => {

        html += `

            <tr>

                <td>${fee.month}</td>

                <td>${fee.amount}</td>

                <td>${fee.status}</td>

                <td>${fee.date}</td>

            </tr>
        `;

        cardsHtml += `

            <div class="student-card">

                <p><b>Month:</b> ${fee.month}</p>

                <p><b>Amount:</b> ₹${fee.amount}</p>

                <p><b>Status:</b> ${fee.status}</p>

                <p><b>Date:</b> ${fee.date}</p>

            </div>

        `;
    });

    document.getElementById(
        "feesTable"
    ).innerHTML = html;

    document.getElementById(
        "feesCards"
    ).innerHTML = cardsHtml;
}

loadFees();