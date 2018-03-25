function getData(){
	var healthIdNumber = localStorage.getItem("healthId");
	document.getElementById("outputName").innerHTML = healthIdNumber;

	var firstNameGotten = localStorage.getItem("firstName");
	document.getElementById("outputName1").innerHTML = firstNameGotten;

	var lastNameGotten = localStorage.getItem("lastName");
	document.getElementById("outputName2").innerHTML = lastNameGotten;
}

function printPage(){
	window.print();
}