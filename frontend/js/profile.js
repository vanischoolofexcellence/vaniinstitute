const token =
localStorage.getItem("token");

async function loadProfile(){

    const response = await fetch(

        `${BASE_URL}/student/profile`,

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
        "profileData"
    ).innerHTML = `

    <div class ="profile-top-card">

        <h2>${student.name}</h2>
        <span>
            Class${student.class_name}
        </span>
    </div>

    <div class="profile-grid">
        <div class="profile-box">
            <h3>Student ID</h3>
            <p>${student.student_id}</p>
        </div>

        <div class="profile-box">
            <h3>Father Name</h3>
            <p>${student.father_name}</p>
        </div>

        <div class="profile-box">
            <h3>Phone</h3>
            <p>${student.phone}</p>
        </div>

        <div class="profile-box">
        <h3>School</h3>
        <p>${student.school_name}</p>
        </div>

        <div class="profile-box">
        <h3>Joining Date</h3>
        <p>${student.joining_date}</p>
        </div>

        <div class ="profile-box">
        <h3>Address</h3>
        <p>${student.address}</p>
        </div>


            

    </div>

    `;
}

loadProfile();