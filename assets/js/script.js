let darkModeToggle = document
.getElementById('darkModeToggle');
let body = document
.body;

darkModeToggle
.addEventListener('change', function ()
{
    if (darkModeToggle.checked) 
    {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
});

function enableDarkMode() {
    body
    .classList
    .add('dark-mode');
};

function disableDarkMode()
{
    body
    .classList
    .remove('dark-mode');
};


function myFunction()
 {
    var x = document
    .getElementById("myTopnav");
    if (x.className === "navbar-lists")
    {
        x.className += " responsive";
    } else {
        x.className = "navbar-lists";
    }
};







// images Gallery

$(document).ready(function() {
	$('.popup-gallery').magnificPopup({
		delegate: 'a',
		type: 'image',
		tLoading: 'Loading image #%curr%...',
		mainClass: 'mfp-img-mobile',
		gallery: {
			enabled: true,
			navigateByImgClick: true,
			preload: [0,1] // Will preload 0 - before current, and 1 after the current image
		},
		image: {
			tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
			titleSrc: function(item) {
				return item.el.attr('title') + '<small>by Marsel Van Oosten</small>';
			}
		}
	});
});