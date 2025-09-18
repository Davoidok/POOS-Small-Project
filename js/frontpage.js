function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
    let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
    
	let loginError = document.querySelector(".inputError.usernameError");
    let passwError = document.querySelector(".inputError.passwordError");
    let loginResultError = document.querySelector(".invalidLoginError");
    let errorIcon = '<img src="imgs/caution.png" id="errorIcon">';
    let err = false;
	
    if(password === ''){
        passwError.innerHTML = `${errorIcon} Must enter a password`;
        loginResultError.innerHTML = '';
        err = true;
    }
    else
        passwError.innerHTML = "";
    
    if(login === ''){
        loginError.innerHTML = `${errorIcon} Must enter a username`;
        loginResultError.innerHTML = '';
        err = true;
    }
    else if(login.trim() === ''){
        loginError.innerHTML = `${errorIcon} Username cannot be blank`;
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
                        loginResultError.innerHTML = `${errorIcon} ${jsonObject.error}`;
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

    let fnameError = document.querySelector(".inputError.firstNameError");
    let lnameError = document.querySelector(".inputError.lastNameError");
    let loginError = document.querySelector(".inputError.usernameError");
    let passwError = document.querySelector(".inputError.passwordError");
    let errorIcon = '<img src="imgs/caution.png" id="errorIcon">';
    let err = false;


    if(firstName=== ''){
        fnameError.innerHTML = `${errorIcon} Must enter a first name`;
        err = true;
    }
    else
        fnameError.innerHTML = "";
    
    if(lastName === ''){ 
        lnameError.innerHTML = `${errorIcon} Must enter a last name`;
        err = true;
    }
    else
        lnameError.innerHTML = "";

    if(password === '' || password.trim() === ''){
        passwError.innerHTML = `${errorIcon} Password cannot be blank`;
        err = true;
    }
    else
        passwError.innerHTML = "";
    
    if(login === '' || login.trim() === ''){
        loginError.innerHTML = `${errorIcon} Username cannot be blank`;
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
                        loginError.innerHTML = `${errorIcon} ${jsonObject.error}`;
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