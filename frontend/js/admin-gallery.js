async function uploadGallery(){

    const formData = new FormData();

    formData.append(
        "title",

        document.getElementById(
            "title"
        ).value
    );

    formData.append(
        "file",

        document.getElementById(
            "file"
        ).files[0]
    );

    const response = await fetch(

        `${BASE_URL}/gallery/upload`,

        {
            method:"POST",

            headers:{
                Authorization:
                `Bearer ${getToken()}`
            },

            body:formData
        }
    );

    const data = await response.json();

    showToast(
        data.message ||
        "Uploaded"
    );
}