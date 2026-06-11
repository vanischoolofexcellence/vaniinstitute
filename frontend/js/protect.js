console.log("PROTECT JS LOADED");

function checkAuth(){

    const token =
    localStorage.getItem("token");

    if(!token){

        window.location.replace(
            "../index.html"
        );

        return false;
    }

    return true;
}

checkAuth();

window.addEventListener(
    "pageshow",
    function(){

        checkAuth();
    }
);

window.addEventListener(
    "load",
    function(){

        checkAuth();
    }
);