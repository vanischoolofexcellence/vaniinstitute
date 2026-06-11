

const token =
localStorage.getItem(
    "token"
);



async function sendMessage(){

    try{

        const body = {

            title:
            document.getElementById(
                "messageTitle"
            ).value,

            message:
            document.getElementById(
                "messageText"
            ).value,

            class_name:
            document.getElementById(
                "messageClass"
            ).value
        };

        console.log(body);

        const response = await fetch(

            `${BASE_URL}/message/send`,

            {

                method: "POST",

                headers: {

                    "Content-Type":
                    "application/json",

                    Authorization:
                    `Bearer ${token}`
                },

                body:
                JSON.stringify(body)
            }
        );

        const data =
        await response.json();

        if(response.ok){

            alert(
                "Message Sent Successfully"
            );

            document.getElementById(
                "messageTitle"
            ).value = "";

            document.getElementById(
                "messageText"
            ).value = "";

            document.getElementById(
                "messageClass"
            ).value = "all";
        }

        else{

            alert(
                "Message Failed"
            );

            console.log(data);
        }
    }

    catch(error){

        console.log(error);

        alert(
            "Server Error"
        );
    }
}

window.sendMessage =
sendMessage;