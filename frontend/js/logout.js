function logout(){

    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "must_change_password"
    );

    window.location.replace(
        "../index.html"
    );
}