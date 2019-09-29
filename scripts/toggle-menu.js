function toggleMenu() {
    var x = document.getElementById("menuBar");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}
