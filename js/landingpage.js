function showWelcomeMessage() {
    readCookie();

    // Get the title element
    const title = document.getElementById("welcome-title");

    if (title) {
        if (firstName && lastName) {
            title.textContent = `Welcome ${firstName} ${lastName}`;
        } else {
            title.textContent = "Welcome";
        }
    }
}

window.addEventListener("DOMContentLoaded", showWelcomeMessage);