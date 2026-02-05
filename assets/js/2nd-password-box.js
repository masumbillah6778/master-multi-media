const correctPassword = 'MasuM';
  function checkPassword() {
    const inputPassword = document.getElementById('password').value;
    if (inputPassword === correctPassword) {
      window.location="/assets/html/page-marquee.html";
    }
    else{
      document.getElementById('error').innerText = 'Incorrect password. Please try again.';
    }
  }
  
password = document.getElementById('password');
      var toggler = document.getElementById('toggler');

      showHidePassword = () => {
        if (password.type == 'password') {
          password.setAttribute('type', 'text');
          toggler.classList.add('fa-eye-slash');
        } else {
          toggler.classList.remove('fa-eye-slash');
          password.setAttribute('type', 'password');
        }
      };

      toggler.addEventListener('click', showHidePassword);
