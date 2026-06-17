const BASE_URL =
"https://vani-backend-s9ll.onrender.com";


const token =
localStorage.getItem(
    "token"
);


const params =
new URLSearchParams(
    window.location.search
);


const className =
params.get("class");


document.getElementById(
    "classTitle"
).innerText =


`${className} Management`;


const dateInput =
document.getElementById(
    "attendanceDate"
);


dateInput.value =
new Date()
.toISOString()
.split("T")[0];


let attendanceData = [];
let pendingAttendance = [];




// LOAD ATTENDANCE


async function loadAttendanceMode(){

    document.getElementById(
        "mobileCards"
    ).innerHTML="";


    try{

        const selectedDate =
        dateInput.value;

        const response = await fetch(

            `${BASE_URL}/attendance/class/${className}?date=${selectedDate}`,

            {
                headers:{
                    Authorization:
                    `Bearer ${token}`
                }
            }
        );

        attendanceData =
        await response.json();

        renderAttendanceTable();

        
    }

    catch(error){

        console.log(error);
    }
}




// RENDER TABLE


function renderAttendanceTable(){

    document.getElementById(
        "extraSection"
    ).innerHTML = `
        <button
            class="present-btn"
            onclick="saveAllAttendance()"
        >
            Save Attendance
        </button>
    `;

    document.getElementById(
        "tableHead"
    ).innerHTML = `
        <th>Name</th>
        <th>Phone</th>
        <th>Morning</th>
        <th>Evening</th>
    `;

    let html = "";
    let mobileHtml = "";

    attendanceData.forEach(student => {

        html += `
            <tr>
                <td>${student.name}</td>
                <td>${student.phone}</td>

                <td>
                    ${renderAttendanceButtons(
                        student.id,
                        "Morning",
                        student.morning
                    )}
                </td>

                <td>
                    ${renderAttendanceButtons(
                        student.id,
                        "Evening",
                        student.evening
                    )}
                </td>

            </tr>
        `;

        mobileHtml += `
            <div class="student-card">

                <h3>${student.name}</h3>

                <p>${student.phone}</p>

                <br>

                <b>Morning</b>

                <br><br>

                ${renderAttendanceButtons(
                    student.id,
                    "Morning",
                    student.morning
                )}

                <br><br>

                <b>Evening</b>

                <br><br>

                ${renderAttendanceButtons(
                    student.id,
                    "Evening",
                    student.evening
                )}

            </div>
        `;
    });

    document.getElementById(
        "tableBody"
    ).innerHTML = html;

    document.getElementById(
        "mobileCards"
    ).innerHTML = mobileHtml;

    loadAbsentees();
}



// ATTENDANCE BUTTONS


function renderAttendanceButtons(


    studentId,
    slot,
    currentStatus


){


    if(currentStatus){


        return `


            <div
                class="
                attendance-actions
                "
            >


                <span>


                    ${
                        currentStatus
                        ===
                        "Present"


                        ?


                        "✅ Present"


                        :


                        "❌ Absent"
                    }


                </span>


                <button


                    class="
                    edit-btn
                    "


                    onclick="
                        editAttendance(
                            ${studentId},
                            '${slot}'
                        )
                    "
                >


                    Edit


                </button>


            </div>
        `;
    }


    return `


        <div
            class="
            attendance-actions
            "
        >


            <button


                class="
                present-btn
                "


                onclick="
                    markAttendance(
                        ${studentId},
                        '${slot}',
                        'Present'
                    )
                "
            >


                Present


            </button>


            <button


                class="
                absent-btn
                "


                onclick="
                    markAttendance(
                        ${studentId},
                        '${slot}',
                        'Absent'
                    )
                "
            >


                Absent


            </button>


        </div>
    `;
}




// SAVE ATTENDANCE
function markAttendance(

    studentId,
    slot,
    status

){

    const existing =
    pendingAttendance.find(

        item =>

        item.student_id === studentId

        &&

        item.time_slot === slot
    );

    if(existing){

        existing.status =
        status;
    }

    else{

        pendingAttendance.push({

            student_id:
            studentId,

            time_slot:
            slot,

            status:
            status
        });
    }

    attendanceData =
    attendanceData.map(student => {

        if(student.id === studentId){

            if(slot === "Morning"){

                student.morning =
                status;
            }

            if(slot === "Evening"){

                student.evening =
                status;
            }
        }

        return student;
    });

    renderAttendanceTable();
    document.getElementById(
        "saveAttendanceBtn"
    ).style.display = "block";
    
}



async function saveAttendance(


    studentId,
    slot,
    status


){


    try{


        const body = {


            student_id:
            studentId,


            date:
            dateInput.value,


            time_slot:
            slot,


            status:
            status
        };


        await fetch(


            `${BASE_URL}/attendance/mark`,


            {
                method:"POST",


                headers:{
                    "Content-Type":
                    "application/json",


                    Authorization:
                    `Bearer ${token}`
                },


                body:
                JSON.stringify(body)
            }
        );


        loadAttendanceMode();


    }


    catch(error){


        console.log(error);
    }
}

async function saveAllAttendance(){
    alert("save function called");
    console.log(pendingAttendance);

    try{

        for(const item of pendingAttendance){

            await fetch(

                `${BASE_URL}/attendance/mark`,

                {

                    method:"POST",

                    headers:{

                        "Content-Type":
                        "application/json",

                        Authorization:
                        `Bearer ${token}`
                    },

                    body:JSON.stringify({

                        student_id:
                        item.student_id,

                        date:
                        dateInput.value,

                        time_slot:
                        item.time_slot,

                        status:
                        item.status
                    })
                }
            );
        }

        pendingAttendance = [];
        document.getElementById(
            "saveAttendanceBtn"
        ).style.display ="none";

        alert(
            "Attendance Saved Successfully"
        );

        loadAttendanceMode();
    }

    catch(error){

        console.log(error);

        alert(
            "Failed To Save Attendance"
        );
    }
}


// EDIT ATTENDANCE


function editAttendance(


    studentId,
    slot


){


    attendanceData =
    attendanceData.map(student => {


        if(student.id === Number(studentId)){


            if(slot === "Morning"){


                student.morning = null;
            }


            if(slot === "Evening"){


                student.evening = null;
            }
        }


        return student;
    });


    renderAttendanceTable();
}




// ABSENTEES


function loadAbsentees(){


    let html = `


        <div
            style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            "
        >


            <h2>
                Today's Absentees
            </h2>


           
                 
                 
               
               
                 
               


           
               
           
        </div>


            <br>
    `;


    let found = false;


    attendanceData.forEach(student => {


        if(


            student.morning
            ===
            "Absent"


            ||


            student.evening
            ===
            "Absent"
        ){


            found = true;


            html += `


                <div
                    class="
                    absent-card
                    "
                >


                    <h3>
                        ${student.name}
                    </h3>


                    <p>
                        ${student.phone}
                    </p>


                    <p>
                        ${
                            student.morning === "Absent"
                            &&
                            student.evening === "Absent"
                            ?
                            "Absent In: Morning & Evening"
                            :
                            student.morning === "Absent"
                            ?
                            "Absent In: Morning"  
                            :
                            "Absent In: Evening"
                        }
                    </p>






                    <br>


                    <a
                        href="
                        tel:${student.phone}
                        "
                    >


                        📞 Call


                    </a>


                    &nbsp;&nbsp;


                    <a


                        href="
                        https://wa.me/91${student.phone}
                        "


                        target="
                        _blank
                        "
                    >


                        💬 WhatsApp


                    </a>
                    &nbsp;&nbsp;
                    <button
                        class="
                        present-btn
                        "
                        onclick="
                            sendSingleWhatsApp(
                           
                                '${student.name}',
                                '${student.phone}',
                                '${
                                    student.morning === "Absent"
                               
                               
                           


                                     &&


                                     student.evening  === "Absent"
                                     ?
                                     "Morning & Evening"
                                     :
                                     student.morning === "Absent"
                                     ?
                                     "Morning"
                                     :
                                    "Evening"
                               }'
                            )
                        "
                   
                    >
                        Send Message
                    </button>
                       




                </div>
            `;
        }
    });


    if(!found){


        html += `
            No Absentees
        `;
    }


    html += `
        </div>
    `;


    document.getElementById(
        "extraSection"
    ).innerHTML = html;
}


function sendSingleWhatsApp(


    name,
    phone,
    slot


){


    const message =


`Dear Parent,


Your child ${name} was absent in ${slot} attendance today.


Please send your child regularly to the institute.


Thank You.`;


    const whatsappURL =


    `https://wa.me/91${phone}?text=${
        encodeURIComponent(message)
    }`;


    window.open(
        whatsappURL,
        "_blank"
    );
}






function sendAbsenteesWhatsApp(){


    attendanceData.forEach(student => {


        if(


            student.morning === "Absent"


            ||


            student.evening === "Absent"
        ){


            let slot = "";


            if(


                student.morning === "Absent"


                &&


                student.evening === "Absent"
            ){


                slot =
                "Morning & Evening";
            }


            else if(


                student.morning === "Absent"
            ){


                slot =
                "Morning";
            }


            else{


                slot =
                "Evening";
            }


            const message =


            `Dear Parent,


Your child ${student.name} was absent in ${slot} attendance today.


Please send your child regularly to the institute.


Thank You.`;


            const whatsappURL =


            `https://wa.me/91${student.phone}?text=${
                encodeURIComponent(message)
            }`;


            window.open(
                whatsappURL,
                "_blank"
            );
        }
    });
}






// DATE CHANGE


dateInput.addEventListener(


    "change",


    loadAttendanceMode
);




// FEES MODE


async function loadFeesMode(){
    document.getElementById(
        "mobileCards"
    ).innerHTML = "";


    try{


        const response = await fetch(


            `${BASE_URL}/fees/class/${className}`,


            {
                headers:{
                    Authorization:
                    `Bearer ${token}`
                }
            }
        );


        const data =
        await response.json();


        renderFeesTable(data);


    }


    catch(error){


        console.log(error);
    }
}


function renderFeesTable(data){

    document.getElementById(
        "tableHead"
    ).innerHTML = `
        <th>Student</th>
        <th>Fee Card</th>
        <th>Action</th>
    `;

    let html = "";
    let mobileHtml = "";

    data.forEach(student => {

        html += `
            <tr>

                <td>${student.name}</td>

                <td>

                    <button
                        class="present-btn"
                        onclick="
                            openFeeCard(
                                ${student.id},
                                '${student.name}'
                            )
                        "
                    >
                        Check Fee Card
                    </button>

                </td>

                <td>

                    <button
                        class="absent-btn"
                        onclick="
                            openAddPayment(
                                ${student.id},
                                '${student.name}',
                                '${student.class_name}'
                            )
                        "
                    >
                        Add Payment
                    </button>

                </td>

            </tr>
        `;

        mobileHtml += `
            <div class="student-card">

                <h3>${student.name}</h3>

                <br>

                <button
                    class="present-btn"
                    onclick="
                        openFeeCard(
                            ${student.id},
                            '${student.name}'
                        )
                    "
                >
                    Check Fee Card
                </button>

                <br><br>

                <button
                    class="absent-btn"
                    onclick="
                        openAddPayment(
                            ${student.id},
                            '${student.name}',
                            '${student.class_name}'
                        )
                    "
                >
                    Add Payment
                </button>

            </div>
        `;
    });

    document.getElementById(
        "tableBody"
    ).innerHTML = html;

    document.getElementById(
        "mobileCards"
    ).innerHTML = mobileHtml;
}


async function openFeeCard(


    studentId,
    studentName


){


    try{


        const response = await fetch(


            `${BASE_URL}/fees/student/${studentId}`,


            {
                headers:{


                    Authorization:
                    `Bearer ${token}`
                }
            }
        );


        let payments =
        await response.json();


        console.log(payments);


        if(
            !Array.isArray(payments)
        ){


            payments =
            payments.fees || [];
        }


        let rows = "";


        // ONLY SAVED PAYMENTS


        payments
        .filter(item =>
            item.amount
            &&
            item.payment_method
            &&
            item.date
        )
        .forEach(item => {


            rows += `


                <tr>


                    <td>
                        ${item.date || "-"}
                    </td>


                    <td>
                        ${item.month || "-"}
                    </td>


                    <td>
                        ₹${item.amount || "-"}
                    </td>


                    <td>
                        ${item.payment_method || "-"}
                    </td>


                </tr>
            `;
        });


        // IF NO PAYMENTS


        if(rows === ""){


            rows = `


                <tr>


                    <td
                        colspan="4"


                        style="
                        text-align:center;
                        "
                    >


                        No Payments Yet


                    </td>


                </tr>
            `;
        }


        document.getElementById(
            "extraSection"
        ).innerHTML = `


            <div class="fee-modal">


                <div class="fee-modal-content">


                    <h2>


                        ${studentName}


                    </h2>


                    <br>


                    <table class="table">


                        <thead>


                            <tr>


                                <th>
                                    Date
                                </th>


                                <th>
                                    Month
                                </th>


                                <th>
                                    Amount
                                </th>


                                <th>
                                    Payment Method
                                </th>


                            </tr>


                        </thead>


                        <tbody>


                            ${rows}


                        </tbody>


                    </table>


                    <br>


                    <button


                        class="
                        absent-btn
                        "


                        onclick="
                            closeFeeModal()
                        "
                    >


                        Close


                    </button>


                </div>


            </div>
        `;
    }


    catch(error){


        console.log(error);


        alert(
            "Failed To Load Fee Card"
        );
    }
}


function openAddPayment(


    studentId,
    studentName,
    studentClass


){


    document.getElementById(
        "extraSection"
    ).innerHTML = `


        <div
            class="
            fee-modal
            "
        >


            <div
                class="
                fee-modal-content
                "
            >


                <h2>


                    Add Payment


                </h2>


                <br>


                <input
                    type="text"


                    id="feeStudentName"


                    value="${studentName}"


                    readonly
                >


                <br><br>


                <input
                    type="text"


                    id="feeClassName"


                    value="${studentClass}"


                    readonly


                <br><br>


                <select
                    id="feeMonth"
                >


                    <option>
                        January
                    </option>


                    <option>
                        February
                    </option>


                    <option>
                        March
                    </option>


                    <option>
                        April
                    </option>


                    <option>
                        May
                    </option>


                    <option>
                        June
                    </option>


                    <option>
                        July
                    </option>


                    <option>
                        August
                    </option>


                    <option>
                        September
                    </option>


                    <option>
                        October
                    </option>


                    <option>
                        November
                    </option>


                    <option>
                        December
                    </option>


                </select>


                <br><br>


                <input
                    type="number"


                    id="feeAmount"


                    placeholder="
                    Amount
                    "
                >


                <br><br>
                <input
                    type="date"
                    id="feeDate"


               
                <br><br>




                <select
                    id="paymentMethod"
                >


                    <option>
                        Cash
                    </option>


                    <option>
                        UPI
                    </option>


                    <option>
                        Online
                    </option>


                </select>


                <br><br>


                <button


                    class="
                    present-btn
                    "


                    onclick="
                        saveFeePayment(
                            ${studentId}
                        )
                    "
                >


                    Save Payment


                </button>


                <button


                    class="
                    absent-btn
                    "


                    onclick="
                        closeFeeModal()
                    "
                >


                    Close


                </button>


            </div>


        </div>
    `;
}


async function saveFeePayment(studentId){
   


    try{


        const body = {
       


            student_id:
            studentId,


            student_name:
            document.getElementById(
                "feeStudentName"
            ).value,


            student_class:
            document.getElementById(
                "feeClassName"
            ).value,


            date:
            document.getElementById(
                "feeDate"
            ).value,


            month:
            document.getElementById(
                "feeMonth"
            ).value,


            amount:
            document.getElementById(
                "feeAmount"
            ).value,


            payment_method:
            document.getElementById(
                "paymentMethod"
            ).value,


            status:
            "paid"
        };
        alert(JSON.stringify(body));
        console.log(body);


        const response = await fetch(


            `${BASE_URL}/fees/save`,


            {
                method:"POST",


                headers:{


                    "Content-Type":
                    "application/json",


                    Authorization:
                    `Bearer ${token}`
                },


                body:
                JSON.stringify(body)
            }
        );


        if(response.ok){


            alert(
                "Payment Saved"
            );


            closeFeeModal();


            loadFeesMode();
        }


        else{


            alert(
                "Payment Failed"
            );
        }
    }


    catch(error){


        console.log(error);
    }
}
function closeFeeModal(){


    document.getElementById(
        "extraSection"
    ).innerHTML = "";
}


function renderFeeButton(


    studentId,
    month,
    currentStatus


){


    if(currentStatus){


        return `


            <button


                class="
                ${
                    currentStatus === "Paid"


                    ?


                    "present-btn"


                    :


                    "absent-btn"
                }
                "


                onclick="
                    toggleFee(
                        ${studentId},
                        '${month}',
                        '${
                            currentStatus === "Paid"


                            ?


                            "Due"


                            :


                            "Paid"
                        }'
                    )
                "
            >


                ${currentStatus}


            </button>
        `;
    }


    return `


        <button


            class="
            absent-btn
            "


            onclick="
                toggleFee(
                    ${studentId},
                    '${month}',
                    'Paid'
                )
            "
        >


            Due


        </button>
    `;
}


async function toggleFee(


    studentId,
    month,
    status


){


    try{


        const body = {


            student_id:
            studentId,


            month:
            month,


            status:
            status
        };


        await fetch(


            `${BASE_URL}/fees/save`,


            {
                method:"POST",


                headers:{
                    "Content-Type":
                    "application/json",


                    Authorization:
                    `Bearer ${token}`
                },


                body:
                JSON.stringify(body)
            }
        );


        loadFeesMode();


    }


    catch(error){


        console.log(error);
    }
}




// MARKS MODE


async function loadMarksMode(){
    document.getElementById(
        "mobileCards"
    ).innerHTML = "";
    


    document.getElementById(
        "tableHead"
    ).innerHTML = `


        <th>Name</th>


        <th>Marks</th>
    `;


    document.getElementById(
        "extraSection"
    ).innerHTML = `


        <div class="card">


            <div
                style="
                    display:flex;
                    gap:15px;
                    flex-wrap:wrap;
                    margin-bottom:20px;
                "
            >


                <input


                    type="text"


                    id="examName"


                    placeholder="Exam Name"
                >


                <input


                    type="text"


                    id="subjectName"


                    placeholder="Subject"
                >


                <input


                    type="date"


                    id="marksDate"
                >


                <button


                    class="
                    present-btn
                    "


                    onclick="
                        fetchMarks()
                    "
                >


                    Load


                </button>


            </div>


            <div id="previousExams">


            </div>


        </div>
    `;


    document.getElementById(
        "marksDate"
    ).value =


    new Date()
    .toISOString()
    .split("T")[0];


    loadPreviousExams();
}


async function fetchMarks(){
    console.log("fetch marks called");


    try{


        const examName =
        document.getElementById(
            "examName"
        ).value;


        const subject =
        document.getElementById(
            "subjectName"
        ).value;


        const date =
        document.getElementById(
            "marksDate"
        ).value;


        const url =


        `${BASE_URL}/marks/class/${
            encodeURIComponent(className)
        }?exam_name=${
            encodeURIComponent(examName)
        }&subject=${
            encodeURIComponent(subject)
        }&date=${date}`;


        console.log(url);


        const response = await fetch(


            url,


            {
                method:"GET",


                headers:{
                    Authorization:
                    `Bearer ${token}`
                }
            }
        );


        const data =
        await response.json();


        console.log(data);


        renderMarksTable(


            data,


            examName,


            subject
        );
    }


    catch(error){


        console.log(error);


        alert(
            "Failed To Load Marks"
        );
    }
}


function renderMarksTable(
    data,
    examName,
    subject
){
    console.log("render marks called");
    console.log(data);

    document.getElementById(
        "tableHead"
    ).innerHTML = `
        <th>Name</th>
        <th>Marks</th>
    `;

    let html = "";
    let mobileHtml = "";

    data.forEach(student => {

        html += `
            <tr>

                <td>${student.name}</td>

                <td>

                    <input
                        type="number"
                        value="${student.marks || ""}"
                        id="marks-${student.id}"
                        placeholder="Enter Marks"
                    >

                </td>

            </tr>
        `;

        mobileHtml += `
            <div class="student-card">

                <h3>${student.name}</h3>

                <br>

                <input
                    type="number"
                    value="${student.marks || ""}"
                    id="marks-${student.id}"
                    placeholder="Enter Marks"
                >

            </div>
        `;
    });

    html += `
        <tr>
            <td colspan="2">

                <button
                    class="present-btn"
                    onclick="
                        saveAllMarks(
                            '${examName}',
                            '${subject}'
                        )
                    "
                >
                    Save Marks
                </button>

            </td>
        </tr>
    `;

    mobileHtml += `
        <button
            class="present-btn"
            onclick="
                saveAllMarks(
                    '${examName}',
                    '${subject}'
                )
            "
        >
            Save Marks
        </button>
    `;

    document.getElementById(
        "tableBody"
    ).innerHTML = html;

    document.getElementById(
        "mobileCards"
    ).innerHTML = mobileHtml;
}

async function saveAllMarks(


    examName,
    subject


){


    try{


        const date =
        document.getElementById(
            "marksDate"
        ).value;


        const rows =
        document.querySelectorAll(
            "#tableBody tr"
        );


        for(const row of rows){


            const input =
            row.querySelector("input");


            if(!input){
                continue;
            }


            const studentId =
            input.id.replace(
                "marks-",
                ""
            );


            const marks =
            input.value;


            const body = {


                student_id:
                parseInt(studentId),


                exam_name:
                examName,


                subject:
                subject,


                marks:
                parseInt(marks || 0),


                date:
                date
            };


            await fetch(


                `${BASE_URL}/marks/save`,


                {
                    method:"POST",


                    headers:{
                        "Content-Type":
                        "application/json",


                        Authorization:
                        `Bearer ${token}`
                    },


                    body:
                    JSON.stringify(body)
                }
            );
        }


        alert(


            `${examName}
            - ${subject}
            Marks Saved Successfully`
        );

        
        loadPreviousExams();


    }


    catch(error){


        console.log(error);


        alert(
            "Failed To Save Marks"
        );
    }
}

async function loadPreviousExams(){

    try{

        const response = await fetch(

            `${BASE_URL}/marks/all`,

            {
                headers:{
                    Authorization:
                    `Bearer ${token}`
                }
            }
        );

        const data =
        await response.json();

        const uniqueExams = [];

        data.forEach(item => {

            const exists =
            uniqueExams.find(exam =>

                exam.exam_name
                ===
                item.exam_name

                &&

                exam.subject
                ===
                item.subject

                &&

                exam.date
                ===
                item.date
            );

            if(!exists){

                uniqueExams.push(item);
            }
        });

        // MOBILE VIEW
        if(window.innerWidth <= 768){

            let mobileHtml = `

                <h3>
                    Previous Exams
                </h3>

                <br>
            `;

            uniqueExams.forEach(item => {

                mobileHtml += `

                    <div

                        class="student-card"

                        style="
                            cursor:pointer;
                            margin-bottom:12px;
                        "

                        onclick="
                            loadPreviousExamMarks(
                                '${item.exam_name}',
                                '${item.subject}',
                                '${item.date}'
                            )
                        "
                        style="
                            cursor:pointer;
                        "

                    >

                        <h3>
                            ${item.exam_name}
                        </h3>

                        <br>

                        <p>

                            <b>
                                Subject:
                            </b>

                            ${item.subject}

                        </p>

                        <p>

                            <b>
                                Date:
                            </b>

                            ${item.date}

                        </p>

                    </div>
                `;
            });

            document.getElementById(
                "previousExams"
            ).innerHTML = mobileHtml;

            return;
        }

        // DESKTOP VIEW
        else{

            let html = `

                <h3>
                    Previous Exams
                </h3>

                <br>

                <table class="table">

                    <thead>

                        <tr>

                            <th>
                                Date
                            </th>

                            <th>
                                Exam Name
                            </th>

                            <th>
                                Subject
                            </th>

                        </tr>

                    </thead>

                    <tbody>
            `;

            uniqueExams.forEach(item => {

                html += `

                    <tr

                        style="
                            cursor:pointer;
                        "

                        onclick="
                            loadPreviousExamMarks(
                                '${item.exam_name}',
                                '${item.subject}',
                                '${item.date}'
                            )
                        "
                    >

                        <td>
                            ${item.date}
                        </td>

                        <td>
                            ${item.exam_name}
                        </td>

                        <td>
                            ${item.subject}
                        </td>

                    </tr>
                `;
            });

            html += `

                    </tbody>

                </table>
            `;

            document.getElementById(
                "previousExams"
            ).innerHTML = html;
        }
    }

    catch(error){

        console.log(error);
    }
}




async function loadPreviousExamMarks(


    examName,
    subject,
    date


){


    try{


        const response = await fetch(


            `${BASE_URL}/marks/class/${
                encodeURIComponent(className)
            }?exam_name=${
                encodeURIComponent(examName)
            }&subject=${
                encodeURIComponent(subject)
            }&date=${date}`,


            {
                headers:{
                    Authorization:
                    `Bearer ${token}`
                }
            }
        );


        const data =
        await response.json();


        document.getElementById(
            "modalTitle"
        ).innerText =


        `${examName}
        - ${subject}
        (${date})`;


        let html = "";


        data.forEach(student => {


            html += `


                <tr>


                    <td>
                        ${student.name}
                    </td>


                    <td>
                        ${student.marks || 0}
                    </td>


                </tr>
            `;
        });


        document.getElementById(
            "modalMarksBody"
        ).innerHTML = html;


        document.getElementById(
            "marksModal"
        ).style.display = "flex";
    }


    catch(error){


        console.log(error);
    }
}


function closeMarksModal(){


    document.getElementById(
        "marksModal"
    ).style.display = "none";
}




async function loadStudentsMode(){


    try{


        const response = await fetch(
            `${BASE_URL}/student/class/${
                encodeURIComponent(className)
            }`,
            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        );


        const students = await response.json();


        document.getElementById(
            "tableHead"
        ).innerHTML = `
            <th>Student Name</th>
            <th>Student ID</th>
            <th>Phone</th>
            <th>Date Of Joining</th>
            <th>Attendance</th>
            <th>Edit</th>
            <th>Delete</th>
        `;


        let html = "";
        let mobileHtml = "";


        for(const student of students){


            const attendanceResponse = await fetch(
                `${BASE_URL}/attendance/student-summary/${student.id}`,
                {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }
            );


            const attendanceData =
            await attendanceResponse.json();


            const joiningDate =
            student.joining_date
            ?
            new Date(
                student.joining_date
            ).toLocaleDateString("en-GB")
            :
            "_";


            html += `
                <tr>


                    <td>${student.name}</td>


                    <td>${student.student_id}</td>


                    <td>${student.phone}</td>


                    <td>${joiningDate}</td>


                    <td>


                        <div>
                            Morning:
                            ${attendanceData.morning_present}
                            /
                            ${attendanceData.total_days}
                        </div>


                        <div>
                            Evening:
                            ${attendanceData.evening_present}
                            /
                            ${attendanceData.total_days}
                        </div>


                    </td>


                    <td>


                        <button
                            class="btn"
                            onclick="editStudent(${student.id})"
                        >
                            Edit
                        </button>


                    </td>


                    <td>


                        <button
                            class="absent-btn"
                            onclick="deleteStudent(${student.id})"
                        >
                            Delete
                        </button>


                    </td>


                </tr>
            `;


            mobileHtml += `
                <div class="student-card">


                    <h3>${student.name}</h3>


                    <p>
                        <b>ID:</b>
                        ${student.student_id}
                    </p>


                    <p>
                        <b>Phone:</b>
                        ${student.phone}
                    </p>


                    <p>
                        <b>Joining:</b>
                        ${joiningDate}
                    </p>


                    <p>
                        <b>Morning:</b>
                        ${attendanceData.morning_present}
                        /
                        ${attendanceData.total_days}
                    </p>


                    <p>
                        <b>Evening:</b>
                        ${attendanceData.evening_present}
                        /
                        ${attendanceData.total_days}
                    </p>


                    <div
                        style="
                        display:flex;
                        gap:10px;
                        margin-top:10px;
                        "
                    >


                        <button
                            class="btn"
                            onclick="editStudent(${student.id})"
                        >
                            Edit
                        </button>


                        <button
                            class="absent-btn"
                            onclick="deleteStudent(${student.id})"
                        >
                            Delete
                        </button>


                    </div>


                </div>
            `;
        }


        document.getElementById(
            "tableBody"
        ).innerHTML = html;


        document.getElementById(
            "mobileCards"
        ).innerHTML = mobileHtml;


        document.getElementById(
            "extraSection"
        ).innerHTML = "";


    }


    catch(error){


        console.log(error);
    }
}




async function deleteStudent(studentId){


    const confirmed = confirm(
        `Delete Student?


        This will also Delete:
        .Attendance
        .Fees Records
        .Marks Records


        Continue?`
    );


    if(!confirmed){
        return;
    }


    try{


        const response = await fetch(


            `${BASE_URL}/student/delete/${studentId}`,


            {


                method:"DELETE",


                headers:{
                    Authorization:
                    `Bearer ${token}`
                }
            }
        );


        const data =
        await response.json();


        alert(
            data.message
        );


        loadStudentsMode();


    }


    catch(error){


        console.log(error);
    }
}




async function editStudent(studentId){


    const response = await fetch(


        `${BASE_URL}/student/details/${studentId}`,


        {
            headers:{
                Authorization:
                `Bearer ${token}`
            }
        }
    );


    const student =
    await response.json();
    console.log(student);


    document.getElementById(
        "extraSection"
    ).innerHTML = `


        <div class="card">


            <h2>Edit Student</h2>


            <br>


            <input
                id="editName"
                value="${student.name}"
            >


            <br><br>


            <input
                id="editFather"
                value="${student.father_name}"
            >


            <br><br>


            <input
                id="editPhone"
                value="${student.phone}"
            >


            <br><br>


            <input
                id="editClass"
                value="${student.class_name}"
            >


            <br><br>


            <input
                id="editSchool"
                value="${student.school_name}"
            >


            <br><br>


            <input
                type="date"
                id="editJoiningDate"
                value="${student.joining_date}"
            >


            <br><br>


            <textarea
                id="editAddress"
            >${student.address}</textarea>


            <br><br>


            <button


                class="present-btn"


                onclick="
                    updateStudent(
                        ${student.id}
                    )
                "
            >


                Update Student


            </button>


        </div>
    `;
}




async function updateStudent(studentId){


    const body = {


        name:
        document.getElementById(
            "editName"
        ).value,


        father_name:
        document.getElementById(
            "editFather"
        ).value,


        phone:
        document.getElementById(
            "editPhone"
        ).value,


        class_name:
        document.getElementById(
            "editClass"
        ).value,


        school_name:
        document.getElementById(
            "editSchool"
        ).value,


        joining_date:
        document.getElementById(
            "editJoiningDate"
        ).value,


        address:
        document.getElementById(
            "editAddress"
        ).value
    };


    const response = await fetch(


        `${BASE_URL}/student/update/${studentId}`,


        {


            method:"PUT",


            headers:{


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


    alert(
        data.message
    );


    loadStudentsMode();


    document.getElementById(
        "extraSection"
    ).innerHTML = "";
}




window.loadPreviousExamMarks =
loadPreviousExamMarks;
window.saveAllMarks =
saveAllMarks;
window.fetchMarks =
fetchMarks;


window.saveAllMarks =
saveAllMarks;


window.loadAttendanceMode =
loadAttendanceMode;


window.loadFeesMode =
loadFeesMode;


window.loadMarksMode =
loadMarksMode;


window.saveAttendance =
saveAttendance;


window.editAttendance =
editAttendance;


window.toggleFee =
toggleFee;


window.closeMarksModal =
closeMarksModal;


window.loadStudentsMode =
loadStudentsMode;






window.sendSingleWhatsApp =
sendSingleWhatsApp;


window.openFeeCard=
openFeeCard;


window.openAddPayment =
openAddPayment;


window.saveFeePayment =
saveFeePayment;


window.closeFeeModal =
closeFeeModal;




// INITIAL LOAD


loadStudentsMode();




