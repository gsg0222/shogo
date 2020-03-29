alert("Hello");
function changeBGC() {
	let obj = document.getElementsByTagName("body");
	for (let i = 0; i < obj.length; i++) {
		obj[i].classList.toggle("bgc--mod");
	}
}
