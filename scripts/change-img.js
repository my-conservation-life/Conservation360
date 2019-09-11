function imageHover() {
    var image = document.getElementById("github");
    if (image.getAttribute("src") === "./images/github-logo-white.png") {
        image.setAttribute("src", "./images/github-logo.png");
    } else {
        image.setAttribute("src", "./images/github-logo-white.png");
    }
}
