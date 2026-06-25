const errorText = document.querySelector(".error-text");
var Password ="rab8";
function passcheck(){
    if (document.getElementById('pass1').value != Password) {
        errorText.style.display = "block";
        errorText.textContent = "দুঃখিত! ভুল পাসওয়ার্ড।";
        return false;
    }
    if (document.getElementById('pass1').value == Password) {
        window.open("https://masumbillah6778.github.io/rab-8-phone-book-headquarters/", "_blank");
    }
}
