const errorText = document.querySelector(".error-text");
var Password ="12345";
function passcheck(){
    if (document.getElementById('pass1').value != Password) {
        errorText.style.display = "block";
        errorText.textContent = "দুঃখিত! ভুল পাসওয়ার্ড।";
        return false;
    }
    if (document.getElementById('pass1').value == Password) {
        window.open("/assets/html/secend-password-box.html", "_blank");
    }
}
