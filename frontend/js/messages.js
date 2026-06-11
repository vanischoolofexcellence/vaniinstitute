const token =
localStorage.getItem("token");


async function loadMessages(){
    

    const response = await fetch(

        `${BASE_URL}/student/messages`,

        {
            headers:{
                Authorization:
                `Bearer ${token}`
            }
        }
    );

    const messages =
    await response.json();
    console.log(messages);

    let html = "";

    messages.forEach(msg => {
        const dateTime =
        new Date(
            msg.created_at
        ).toLocaleString(
            "en-IN",
            {
                day:"2-digit",
                month:"short",
                year:"numeric",
                hour:"2-digit",
                minute:"2-digit"
            }
        );

        html += `

            <div class="card">

                <h3>
                    ${msg.title}
                </h3>

                <p>
                    ${msg.message}
                </p>

                <small>
                    ${dateTime}
                </small>

            </div>

            <br>
        `;
    });

    document.getElementById(
        "messagesContainer"
    ).innerHTML = html;
}

loadMessages();