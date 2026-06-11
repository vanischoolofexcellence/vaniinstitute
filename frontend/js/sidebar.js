const menuBtn =
document.getElementById("menuBtn");

const sidebar =
document.getElementById("sidebar");

if(menuBtn && sidebar){

    menuBtn.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "show-sidebar"
            );

        }
    );

    document.addEventListener(
        "click",
        (e)=>{

            if(
                !sidebar.contains(e.target)
                &&
                !menuBtn.contains(e.target)
            ){

                sidebar.classList.remove(
                    "show-sidebar"
                );

            }

        }
    );
}