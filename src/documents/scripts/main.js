Modernizr.addTest("boxsizing",function(){
    return Modernizr.testAllProps("boxSizing") && (document.documentMode === undefined || document.documentMode > 7);
});

$(window).ready(function() {
	App.init();
});