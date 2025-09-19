function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
    let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
    
	let loginError = document.querySelector(".errorContainer.usernameError");
    let passwError = document.querySelector(".errorContainer.passwordError");
    let loginResultError = document.querySelector(".invalidLoginError");
    const errHTML = (msg) => `
        <img src="imgs/caution.png" id="errorIcon">
        <span class="inputError" >${msg}</span>
    `
    let err = false;
	
    if(password === ''){
        passwError.innerHTML = errHTML('Must enter a password');
        loginResultError.innerHTML = '';
        err = true;
    }
    else
        passwError.innerHTML = "";
    
    if(login === ''){
        loginError.innerHTML = errHTML('Must enter a username');
        loginResultError.innerHTML = '';
        err = true;
    }
    else if(login.trim() === ''){
        loginError.innerHTML = errHTML('Username cannot be blank');
        loginResultError.innerHTML = '';
        err = true;
    }
    else
        loginError.innerHTML = "";

    if(!err){
        let tmp = {login:login,password:password};
        let jsonPayload = JSON.stringify( tmp );
        
        let url = urlBase + '/Login.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try
        {
            xhr.onreadystatechange = function() 
            {console.log("ReadyState:", xhr.readyState, "Status:", xhr.status);
                if (this.readyState == 4 && this.status == 200) 
                {
                    let jsonObject = JSON.parse( xhr.responseText );
                    userId = jsonObject.id;
            
                    if(!jsonObject.success)
                    {		
                        loginResultError.innerHTML = errHTML(jsonObject.error);
                        return;
                    }

                    firstName = jsonObject.firstName;
                    lastName = jsonObject.lastName;

                    saveCookie();
        
                    window.location.href = "landingpage.html";
                }
            };
            xhr.send(jsonPayload);
        }
        catch(err)
        {
            document.getElementById(".invalidLoginError").innerHTML = err.message;
        }
    }
}

function doRegister()
{
	firstName = document.getElementById("registerFirstName").value.trim();
	lastName = document.getElementById("registerLastName").value.trim();
	let login = document.getElementById("registerUsername").value;
	let password = document.getElementById("registerPassword").value;

    let fnameError = document.querySelector(".errorContainer.firstNameError");
    let lnameError = document.querySelector(".errorContainer.lastNameError");
    let loginError = document.querySelector(".errorContainer.usernameError");
    let passwError = document.querySelector(".errorContainer.passwordError");
    const errHTML = (msg) => `
        <img src="imgs/caution.png" id="errorIcon">
        <span class="inputError" >${msg}</span>
    `
    let err = false;


    if(firstName=== ''){
        fnameError.innerHTML = errHTML('Must enter a first name');
        err = true;
    }
    else
        fnameError.innerHTML = "";
    
    if(lastName === ''){ 
        lnameError.innerHTML = errHTML('Must enter a last name');
        err = true;
    }
    else
        lnameError.innerHTML = "";

    if(password === '' || password.trim() === ''){
        passwError.innerHTML = errHTML('Password cannot be blank');
        err = true;
    }
    else
        passwError.innerHTML = "";
    
    if(login === '' || login.trim() === ''){
        loginError.innerHTML = errHTML('Username cannot be blank');
        err = true;
    }
    else
        loginError.innerHTML = "";
   
    if(!err)
    {
        let tmp = {firstName:firstName,lastName:lastName,login:login,password:password};
        let jsonPayload = JSON.stringify( tmp );
        let url = urlBase + '/Register.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

        try
        {
            xhr.onreadystatechange = function() 
            {console.log("ReadyState:", xhr.readyState, "Status:", xhr.status);
                if (this.readyState == 4 && this.status == 200) 
                {
                    let jsonObject = JSON.parse( xhr.responseText );
                    userId = jsonObject.id;
            
                    if(!jsonObject.success)
                    {		
                        loginError.innerHTML = errHTML(jsonObject.error);
                        return;
                    }

                    firstName = jsonObject.firstName;
                    lastName = jsonObject.lastName;

                    saveCookie();
        
                    window.location.href = "landingpage.html";
                }
            };
            xhr.send(jsonPayload);
        }
        catch(err)
        {
            document.getElementById("registerError").innerHTML = err.message;
        }
    }
}