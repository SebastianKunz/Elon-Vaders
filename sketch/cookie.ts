const getCookieByName = (name: string) => {
	var cookiestring=RegExp(""+name+"[^;]+").exec(document.cookie);

	return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "");
}

// Creates a new Cookie with name, value and expire day.
const setCookie = (cname: string, cvalue: any, exdays: number) => {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
