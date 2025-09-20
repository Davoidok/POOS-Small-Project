// const urlBase = 'http://4lokofridays.com/LAMPAPI';
const urlBase = 'http://localhost:8000/LAMPAPI'
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function goToCreateAccount()
{
    window.location.href = 'createaccount.html';
}

function goToLogin()
{
    window.location.href = 'index.html';
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
}

/**
 * Returns a string of the desired contact formatted as an HTML \<details\> element.
 * @param {integer} dbId The unique id of the contact from the database. 
 * @param {string} firstName Stored in HTML as \<h3\> \<span\> element
 * @param {string} lastName Stored in HTML as \<h3\> \<span\> element
 * @param {string} phone Stored in HTML as \<span\> element inside \<div class="contactDropdown"\>
 *                       container
 * @param {string} email Stored in HTML as \<span\> element inside \<div class="contactDropdown"\>
 *                       container
 * @returns 
 */
function getContactHTML(dbId, firstName, lastName, phone, email)
{
    return `
        <details class="contact" data-id=${dbId}>
          <summary class="contactName">
            <h3>
              <span id="contactFirstName">${firstName}</span> 
              <span id="contactLastName">${lastName}</span>
            </h3>
          </summary>
          <div class="contactDropdown">
            <div class="contactInfo">
              <span id="contactPhoneNumber">${formatPhoneNumber(phone)}</span>
              <span id="contactEmail">${email}</span>
            </div>
            <button id="updateContactButton" onclick="toggleUpdateContactFields(${dbId})">Update</button>
            <button id="deleteContactButton" onclick="doDeleteContact(${dbId})">Delete</button>
          </div>
          <span class="updateContactBlock"></span>
        </details>
    `
}

/**
 * Returns a 10-digit phone number in the format (XXX) XXX-XXXX
 * @param {string} phone 
 */
function formatPhoneNumber(phone)
{
    phone = phone.replace(/\D/g, "");

    if(phone.length < 10)
        return '(xxx) xxx-xxxx'

    let areaCode = phone.slice(0,3);
    let exchange = phone.slice(3,6);
    let subscriber = phone.slice(6, 10);
    return `(${areaCode}) ${exchange}-${subscriber}`; 
}

function stripPhoneNumber(phone){
    phone = phone.replace(/\D/g, "");

    if(phone.length < 10)
        return 'XXXXXXXXXX';

    return phone;
}

function validEmail(email) {
    const regex = /^(([\w]+\.)+|[\w]+)+[\w]@([\w\-]+\.)+[A-z]{2,}$/;
    return regex.test(email);
}

function validPhone(phone) {
    const regex = /^(\d{10}|\d{3}-\d{3}-\d{4}|\(\d{3}\)-\d{3}-\d{4}|\(\d{3}\) \d{3}-\d{4})$/;
    return regex.test(phone);
}

