document.addEventListener("DOMContentLoaded", () => {
    readCookie();
    
    const lastPage = localStorage.getItem('lastPage');
    const loggedIn = sessionStorage.getItem('loggedIn');

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
