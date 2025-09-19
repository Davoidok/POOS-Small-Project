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

document.addEventListener("DOMContentLoaded", () => {
    const lastPage = localStorage.getItem('lastPage');
    const loggedIn = sessionStorage.getItem('loggedIn');

    let pageToStart;
    if(loggedIn) {
        pageToStart = 'homeContainer';
        sessionStorage.removeItem('loggedIn');
    }
    else {
        pageToStart = lastPage;
    }

    switchContext(pageToStart);
});

window.addEventListener("DOMContentLoaded", showWelcomeMessage);