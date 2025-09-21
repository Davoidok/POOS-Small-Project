function switchContext(containerName){
    document.querySelectorAll('.frontpageContainer').forEach(container => {
        container.style.display = (container.id === containerName) ? "" : "none";
    });

    if(containerName === 'listPageContainer'){
        showContacts();
    }

    localStorage.setItem('lastPage', containerName);
}

// This is passed to landingpage.html instead as a kind of wrapper
const responsiveSearch = debouncedSearch(searchContact, 300);

function debouncedSearch(searchFunc, delay){
    let timeoutId;

    return function(...args) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            searchFunc.call(this, "debounce")
        }, delay);
    };
}

function searchContact(callSrc = "HTML")
{
	let srch = document.getElementById("searchText").value;
    let searchResult = document.getElementById("contactSearchResult"); 

    if(callSrc === 'HTML' && srch.trim() === ''){
        searchResult.innerHTML = "Arrr! Ye forgot to type somethin', ye scallywag!";
    }
    else if(callSrc === 'debounce' && srch.trim() === ''){
        searchResult.innerHTML = '';
        document.querySelector("#searchContactContainer .contactList").innerHTML = "";
    }
    else{
        let tmp = {search:srch,userId:userId};
        let jsonPayload = JSON.stringify( tmp );

        let url = urlBase + '/SearchContacts.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try
        {
            xhr.onreadystatechange = function()
            {
                if (this.readyState == 4 && this.status == 200)
                {
                    let jsonObject = JSON.parse( xhr.responseText );
                    let results = jsonObject.result.reverse();
                    let contactList = "";
                    if(results.length > 0){
                        searchResult.innerHTML = "Found yer mateys!";
                        for( let i= 0; i < results.length; i++ )
                        {
                            matches = [
                                results[i].matchesFirstName,
                                results[i].matchesLastName,
                                results[i].matchesPhone,
                                results[i].matchesEmail,
                            ]
                            contactList += getContactHTML(
                                results[i]['ID'],
                                results[i]['firstName'],                     
                                results[i]['lastName'],
                                results[i]['phone'],
                                results[i]['email'],
                                matches,
                                srch
                            );
                        }
                    }
                    else{
                        searchResult.innerHTML = "No mateys found...";
                    }
                    document.querySelector("#searchContactContainer .contactList").innerHTML = contactList;				
                }
            };
            xhr.send(jsonPayload);
        }
        catch(err)
        {
            document.getElementById("contactSearchResult").innerHTML = err.message;
        }
    }
}

function showContacts() {
    let tmp = {search:"",userId:userId};
    let jsonPayload = JSON.stringify( tmp );

    let url = urlBase + '/SearchContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                let jsonObject = JSON.parse( xhr.responseText );

                let results = jsonObject.result.reverse();
                let contactList = "";
                if(results.length > 0){
                    for( let i= 0; i < results.length; i++ )
                    {
                        contactList += getContactHTML(
                            results[i]['ID'],
                            results[i]['firstName'],                     
                            results[i]['lastName'],
                            results[i]['phone'],
                            results[i]['email'],
                        );
                    }
                }
                document.querySelector("#listPageContainer .contactList").innerHTML = contactList;				
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("contactSearchResult").innerHTML = err.message;
    }
}

function createContact()
{	
    let newFirstName = document.getElementById("newFirstName");
	let newLastName = document.getElementById("newLastName");
	let newPhoneNum = document.getElementById("newPhoneNumber");
	let newEmail = document.getElementById("newEmail");

    const errHTML = (msg) => `
        <img src="imgs/caution.png" id="errorIcon">
        <span class="inputError" >${msg}</span>
    `
    
	let firstNameError = document.querySelector(".createError.firstNameError");
    let lastNameError = document.querySelector(".createError.lastNameError");
    let phoneNumError = document.querySelector(".createError.phoneError");
	let emailError = document.querySelector(".createError.emailError");

    let result = validateContact(newFirstName.value, newLastName.value, newPhoneNum.value, newEmail.value);
    
    result.errors.forEach(err => {
        if(err.err !== '')
            document.querySelector(`.createError.${err.field}Error`).innerHTML = errHTML(err.err);
        else
            document.querySelector(`.createError.${err.field}Error`).innerHTML = "";
    });

    if(!result.hasError){
        let tmp = {
            firstName:newFirstName.value,
            lastName:newLastName.value,
            phone:stripPhoneNumber(newPhoneNum.value),
            email:newEmail.value,
            userId:userId
        };
        
        let jsonPayload = JSON.stringify(tmp);
        
        let url = urlBase + '/CreateContact.' + extension; 
        
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try
        {
            xhr.onreadystatechange = function() 
            {
                if (this.readyState == 4 && this.status == 200) 
                {
                    let jsonObject = JSON.parse( xhr.responseText );
                    if(!jsonObject.success)
                    {	
                        console.log(jsonObject.error);
                        return;
                    }
                    newFirstName.value = '';
                    newLastName.value = '';
                    newPhoneNum.value = '';
                    newEmail.value = '';
                }
            };
            xhr.send(jsonPayload);
        }
        catch(err)
        {
            document.getElementById(".newContactGroup .inputError").innerHTML = err.message;
        }
    }
	
}

function updateContact(dbId){
    const listContainer = [...document.querySelectorAll(
        '.frontpageContainer'
    )].find(c => getComputedStyle(c).display !== 'none');
   

    let firstName = listContainer.querySelector(`.contact[data-id="${dbId}"] #firstNameUpdate`).value;
    let lastName = listContainer.querySelector(`.contact[data-id="${dbId}"] #lastNameUpdate`).value;
    let phone = listContainer.querySelector(`.contact[data-id="${dbId}"] #phoneUpdate`).value;
    let email = listContainer.querySelector(`.contact[data-id="${dbId}"] #emailUpdate`).value;

    let update = {
        'ID': dbId,
        'firstName': firstName,
        'lastName': lastName,
        'phone': phone,
        'email': email,    
        'userId': userId      
    }
    
    // Set the errors for each part of the update. Is blank if no errors for a field
    let result = validateContact(update['firstName'], update['lastName'], update['phone'], update['email'], true);
    
    const errHTML = (msg) => `
        <img src="imgs/caution.png" id="errorIcon">
        <span class="errorMessage typewriter-text-capital">${msg}</span>
    `

    if(firstName === '' || !result.errors[0].err){
        listContainer.querySelector(`.firstNameError`).innerHTML = '';
    }
    else{
        listContainer.querySelector(`.firstNameError`).innerHTML = errHTML(result.errors[0].err);
    }
    
    if(lastName === '' || !result.errors[1].err){
        listContainer.querySelector(`.lastNameError`).innerHTML = '';
    }
    else{
        listContainer.querySelector(`.lastNameError`).innerHTML = errHTML(result.errors[1].err);
    }

    if(phone === '' || !result.errors[2].err){
        listContainer.querySelector(`.phoneError`).innerHTML = '';
    }
    else{
        listContainer.querySelector(`.phoneError`).innerHTML = errHTML(result.errors[2].err);
    }

    if(email === '' || !result.errors[3].err){
        listContainer.querySelector(`.emailError`).innerHTML = '';
    }
    else if(result.errors[3].err){
        listContainer.querySelector(`.emailError`).innerHTML = errHTML(result.errors[3].err);
    }


    if(!result.hasError){
        if(update.phone)
            update.phone = stripPhoneNumber(update.phone);
        
        let jsonPayload = JSON.stringify(update);
        let url = urlBase + '/UpdateContact.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try
        {
            xhr.onreadystatechange = function()
            {
                if (this.readyState == 4 && this.status == 200)
                {
                    let jsonObject = JSON.parse( xhr.responseText );
                    if(jsonObject.success){
                        // Update the contact entry with the updated details
                        if(update['firstName'] !== '')
                            listContainer.querySelector(`.contact[data-id="${dbId}"] #contactFirstName`).innerHTML = update['firstName']; 
                        if(update['lastName'] !== '')
                            listContainer.querySelector(`.contact[data-id="${dbId}"] #contactLastName`).innerHTML = update['lastName'];
                        if(update['phone'] !== '')
                            listContainer.querySelector(`.contact[data-id="${dbId}"] #contactPhoneNumber`).innerHTML = formatPhoneNumber(update['phone']);
                        if(update['email'] !== '')
                            listContainer.querySelector(`.contact[data-id="${dbId}"] #contactEmail`).innerHTML = update['email'];

                        clearUpdateContactFields(dbId);
                        toggleUpdateContactFields(dbId);
                    }
                }
            };
            xhr.send(jsonPayload);
        }
        catch(err)
        {
            listContainer.getElementById("contactSearchResult").innerHTML = err.message;
        }
    }
}


function doDeleteContact(dbId)
{
    const listContainer = [...document.querySelectorAll(
        '.frontpageContainer'
    )].find(c => getComputedStyle(c).display !== 'none');

	let contactToDelete = {'ID': dbId}

	let contactFirstName = listContainer.querySelector(`.contact[data-id="${dbId}"] #contactFirstName`).innerHTML;
	let contactLastName = listContainer.querySelector(`.contact[data-id="${dbId}"] #contactLastName`).innerHTML;
	let contactPhoneNum = listContainer.querySelector(`.contact[data-id="${dbId}"] #contactPhoneNumber`).innerHTML;
	let contactEmail = listContainer.querySelector(`.contact[data-id="${dbId}"] #contactEmail`).innerHTML;

	if(confirm("Warning! You are about to delete:\n" + contactFirstName + " " + contactLastName + "\nPhone: " + contactPhoneNum + "\nEmail: " + contactEmail + "\nAre you sure you want to do this? This cannot be undone!"))
	{
		let jsonPayload = JSON.stringify(contactToDelete);
		let url = urlBase + '/DeleteContact.' + extension;

		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function()
			{
				if (this.readyState == 4 && this.status == 200)
				{
					let jsonObject = JSON.parse( xhr.responseText );
					if(jsonObject.success){
						document.querySelectorAll(`.contactList .contact[data-id="${dbId}"]`).forEach(contact => {
                            contact.remove();
                        });
					}
					else{
						console.log("delete failed");
					}
				}
			};
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			listContainer.getElementById("contactSearchResult").innerHTML = err.message;
		}
	}
}

function validateContact(firstName, lastName, phone, email, isUpdate=false){
    let errors = [
        {field:'firstName', err:''},
        {field:'lastName', err:''},
        {field:'phone', err:''},
        {field:'email', err:''},
    ];
    
    firstName = firstName.trim();
    lastName = lastName.trim();
    phone = phone.trim();
    email = email.trim();

    let hasError = false;

    if(!firstName && !isUpdate){
        errors[0].err = 'First name cannot be blank';
        hasError = true;
    }
    else if(firstName.length > 50){
        errors[0].err = 'First name too long (Max 50 characters)';
        hasError = true;
    }
    if(!lastName  && !isUpdate){
        errors[1].err = 'Last name cannot be blank';
        hasError = true;
    }
    else if(lastName.length > 50){
        errors[1].err = 'Last name too long (Max 50 characters)';
        hasError = true;
    }
    if(!phone  && !isUpdate){
        errors[2].err = 'Phone number cannot be blank';
        hasError = true;
    }
    else if(isUpdate){
        if(phone && !validPhone(phone)){
            errors[2].err = 'Invalid phone number format';       
            hasError = true;
        }
    }
    else{
        if(!validPhone(phone)){
            errors[2].err = 'Invalid phone number format';       
            hasError = true;
        }
    }
    if(!email && !isUpdate){
        errors[3].err = 'Email cannot be blank';
        hasError = true;
    }
    else if(email.length > 50){
        errors[3].err = 'Email too long (Max 50 characters)';
        hasError = true;
    }
    else if(isUpdate){
        if(email && !validEmail(email)){
            errors[3].err = 'Invalid email format';
            hasError = true;
        }
    }
    else{
        if(!validEmail(email)){
            errors[3].err = 'Invalid email format';
            hasError = true;
        }
    }
    


    return {errors, hasError};
}

function checkToggleUpdateContact(dbId) {
    const listContainer = [...document.querySelectorAll(
        '.frontpageContainer'
    )].find(c => getComputedStyle(c).display !== 'none');

    const contact = listContainer.querySelector(`.contact[data-id="${dbId}"]`);
    if(!contact.querySelector('.updateNameGroup').classList.contains('hidden') && 
       !contact.querySelector('.updateInfoGroup').classList.contains('hidden'))
    {
        toggleUpdateContactFields(dbId);
    }
}

function clearUpdateContactFields(dbId) {
    const listContainer = [...document.querySelectorAll(
        '.frontpageContainer'
    )].find(c => getComputedStyle(c).display !== 'none');

    const contact = listContainer.querySelector(`.contact[data-id="${dbId}"]`);

    contact.querySelector('#firstNameUpdate').value = '';
    contact.querySelector('#lastNameUpdate').value = '';
    contact.querySelector('#phoneUpdate').value = '';
    contact.querySelector('#emailUpdate').value = '';
}

/**
 * 
 * @param {integer} dbId  The unique id of the contact from the database. 
 */
function toggleUpdateContactFields(dbId){
    const listContainer = [...document.querySelectorAll(
        '.frontpageContainer'
    )].find(c => getComputedStyle(c).display !== 'none');

    const contact = listContainer.querySelector(`.contact[data-id="${dbId}"]`);

    let firstName = contact.querySelector('#contactFirstName').innerHTML;
    let lastName = contact.querySelector('#contactLastName').innerHTML;
    let phone = contact.querySelector('#contactPhoneNumber').innerHTML;
    let email = contact.querySelector('#contactEmail').innerHTML;

    
    contact.querySelector('.contactHeader').classList.toggle('hidden');
    contact.querySelector('.updateNameGroup').classList.toggle('hidden');
    contact.querySelector('.updateInfoGroup').classList.toggle('hidden');
    contact.querySelector('.contactNameGroup').classList.toggle('hidden');
    contact.querySelector('.contactInfoGroup').classList.toggle('hidden');
    if(contact.querySelector('.searchMatches'))
        contact.querySelector('.searchMatches').classList.toggle('hidden');

    if(contact.querySelector('.contactHeader').classList.contains('hidden')){
        contact.querySelector('#firstNameUpdate').value = firstName;
        contact.querySelector('#lastNameUpdate').value = lastName;
        contact.querySelector('#phoneUpdate').value = phone;
        contact.querySelector('#emailUpdate').value = email;
    }
    contact.querySelector('.firstNameError').innerHTML = "";
    contact.querySelector('.lastNameError').innerHTML = "";
    contact.querySelector('.phoneError').innerHTML = "";
    contact.querySelector('.emailError').innerHTML = "";
}



