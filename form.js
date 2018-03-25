function myFunction(){
	var healthId = document.getElementById('uniqueHealthId').value;
	localStorage.setItem("healthId", healthId);

	var firstName = document.getElementById('uniqueFirstName').value;
	localStorage.setItem("firstName", firstName);

	var lastName = document.getElementById('uniqueLastName').value;
	localStorage.setItem("lastName", lastName);
}