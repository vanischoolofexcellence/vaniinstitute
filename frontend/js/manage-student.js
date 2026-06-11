const params = new URLSearchParams(
    window.location.search
);

const studentId = params.get(
    "id"
);

function openAttendance(){

    window.location.href =

    `attendance.html?student=${studentId}`;
}

function openMarks(){

    window.location.href =

    `marks.html?student=${studentId}`;
}

function openFees(){

    window.location.href =

    `fees.html?student=${studentId}`;
}

function editStudent(){

    window.location.href =

    `edit-student.html?id=${studentId}`;
}