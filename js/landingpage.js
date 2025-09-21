document.addEventListener("DOMContentLoaded", () => {
    readCookie();
    
    const lastPage = localStorage.getItem('lastPage');
    const loggedIn = sessionStorage.getItem('loggedIn');

    document.querySelector('.listPageHeader').innerText =
    `Ahoy, ${firstName}! Don't let me Cap'n know I'm lettin' ye in on his secrets... `

    let pageToStart;
    if(loggedIn) {
        pageToStart = 'listPageContainer';
        sessionStorage.removeItem('loggedIn');
    }
    else{
        if(lastPage === 'listPageContainer'){
            showContacts();
        }
        pageToStart = lastPage;
    }

    switchContext(pageToStart);
});
