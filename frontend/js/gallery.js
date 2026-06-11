async function loadGallery(){

    const response = await fetch(
        `${BASE_URL}/student/gallery`,

        {
            headers:{
                Authorization:
                `Bearer ${getToken()}`
            }
        }
    );

    const data = await response.json();

    let html = "";

    data.forEach(item => {
        const uploadedDate =
        item.created_at
        ? new Date(
            item.created_at
        ).toLocaleString(
            "en-IN",
            {
                day:"2-digit",
                month:"short",
                year:"numeric",
                hour:"2-digit",
                minute:"2-digit"
            }
        )
        :"No Date";
        
        if(item.file_type === "image"){

            html += `
                <div class="gallery-card">

                    <img
                        src="${BASE_URL}/${item.file_url}"
                        alt="${item.title}"
                    >

                    <h3>${item.title}</h3>
                    
                    <small>
                        ${uploadedDate}
                    </small>
                    

                </div>
            `;
        }

        else{

            html += `
                <div class="gallery-card">

                    <video controls>

                        <source
                            src="${BASE_URL}/${item.file_url}"
                        >

                    </video>

                    <h3>${item.title}</h3>

                    <small>
                        ${uploadedDate}
                    </small>

                    

                </div>
            `;
        }
    });

    document.getElementById(
        "galleryGrid"
    ).innerHTML = html;
}

loadGallery();