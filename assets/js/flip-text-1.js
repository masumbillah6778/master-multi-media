jQuery(".slidem").prepend(jQuery(".slidem > div:last").clone()); /* copy last div for the first slideup */
jQuery.fn.slideFadeToggle  = function(speed, easing, callback) {
	return this.animate({opacity: 'toggle', height: 'toggle'}, speed, easing, callback);
}; /* slideup fade toggle code */
var divS = jQuery(".slidem > div"), /* get the divs to slideup */
	sDiv = jQuery(".slidem > div").length, /* get the number of divs to slideup */
	n = 0; /* starting counter */
function slidethem() { /* slide fade function */
	jQuery( divS ).eq( n ).slideFadeToggle(1000,"swing",n=n+1); /* slide fade the div at 1000ms swing and add to counter */
	jQuery( divS ).eq( n ).show(); /* make sure the next div is displayed */
}
( function slideit() { /* slide repeater */
	if( n == sDiv ) { /* check if at the last div */
		n = 0; /* reset counter */
		jQuery( divS ).show(); /* reset the divs */
	}
	slidethem(); /* call slide function */
	if(n == sDiv) { /* check if at the last div */
		setTimeout(slideit,1); /* slide up first div fast */
	} else {
		setTimeout(slideit,1000); /* slide up every 1000ms */
	}
} )();