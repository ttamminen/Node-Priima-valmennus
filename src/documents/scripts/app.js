var App = (function() {
	var app = {};

	function responsiveInit() {
		enquire.register("screen and (min-width: 577px)", {
		    match : function() {
		    	var $services = $('#services-for-individuals');
				var $packages = $services.find('.package, .last-package');
				var $moreInfo = $services.find('.more-information-about-package:first');
				$packages.find('.more-information-about-package').remove();
				$services.find('.last-package').after($moreInfo);

				bindInfoboxEvents();
		    }
		}, true);

		enquire.register("screen and (max-width: 576px)", {
		    match : function() {
				var $services = $('#services-for-individuals');
				var $moreInfo = $services.find('.more-information-about-package');
				$services.find('.more-information-about-package').remove();
				var $packages = $services.find('.package, .last-package');
				$packages.append($moreInfo);

				bindInfoboxEvents();
		    }
		});
	}

	function modernizrInit() {
		if( !($('html').hasClass('boxsizing')) ){
	        $('.box-sized, .box-sized *').each(function(){
	            var fullW = $(this).outerWidth(),
	                actualW = $(this).width(),
	                wDiff = fullW - actualW,
	                newW = actualW - wDiff;

	            $(this).css('width',newW);

	            var fullH = $(this).outerHeight(),
	                actualH = $(this).height(),
	                hDiff = fullH - actualH,
	                newH = actualH - hDiff;

	            $(this).css('height',newH);
	        });
	    }

		Modernizr.load([
		    //first test need for polyfill
		    {
		        test: window.matchMedia,
		        nope: ["vendor/mediaMatch.js", "vendor/respond.js"],
		        both: "vendor/enquire.js",
		        complete: function () {
					responsiveInit();
		        }
		    }
		]);
	}

	function renderUpdates(results) {
		var maxUpdates = 3;
		var textLength = 45;
    	var monthNames = [ "Tammikuuta", "Helmikuuta", "Maaliskuuta", "Huhtikuuta", "Toukokuuta", "Kesäkuuta", "Heinäkuuta", "Elokuuta", "Syyskuuta", "Lokakuuta", "Marraskuuta", "Joulukuuta" ];

    	var $updates = $('.social-media-updates').find('.updates');
    	$.each(results, function (index, item) {
    		if(index >= maxUpdates)
    		{
    			return;
    		}

    		var creationTime = new Date(item.CreationTimeEpoch * 1000);
    		var title = item.Title;
    		title = title.split(/[\\?\\.\n]+/)[0];
    		title = title.toLowerCase();
    		title = title.charAt(0).toUpperCase() + title.slice(1);
    		if(title.length > textLength)
    		{
    			title = title.substring(0, textLength);
    			title = title + "...";
    		}
			var $updateTitle = $('<h4>', { "class": "update-title" });
			var titleText = creationTime.getDate() + '. ' + monthNames[creationTime.getMonth()];
			$updateTitle.text(titleText);

    		var $link = $('<a>').attr('href', item.Uri).text(title);
			var $update = $('<li>')
    						.append($updateTitle)
                            .append($link);

    		$updates.append($update);
    	});
	}

	function getUpdates() {
	    $.ajax({
			url: 'http://priima-valmennus.apphb.com/api/facebook',
			type: 'GET',
			dataType: 'jsonp',
			cache: false
		}).done(renderUpdates);
	}

	function initContactForm() {
		var $contactForm = $('.contact-form');
		$contactForm.validate({
			messages: {
	            Field214: "Täytäthän etunimesi",
	            Field215: "Täytäthän sukunimesi",
	            Field108: "Täytäthän puhelinnumerosi",
	            Field2: "Täytäthän sähköpostiosoitteesi",
	            Field1: "Jätäthän viestin"
	        }
		});
		$contactForm.find('input[type="submit"]').submit(function () {
			_gaq.push(['_trackEvent', 'Yhteydenotto', 'Lähetä palaute']);
		});
		$contactForm.find('input').first().one('change', function () {
			_gaq.push(['_trackEvent', 'Yhteydenotto', 'Aloitti viestin kirjoittamisen']);
		});
	}

	function initJQueryPlugins() {
		$('.flexslider').flexslider({
			animation: 'slide',
			controlsContainer: ".flexslider",
	    	controlNav: true,
			manualControls: '.controls > ul > li'
		});

		$.localScroll({
			offset: {
				top: -105
			}
		});
	}

	function bindInfoboxEvents() {
		unbindInfoboxEvents();

		var $services = $('#services-for-individuals');
		var $moreInformationAboutPackage = $services.find('.more-information-about-package');
		var $infos = $moreInformationAboutPackage.find('.infobox');
		var $readMores = $services.find('.read-more');
		var $closeButtons = $services.find('.close-button');

		$readMores.click(function () {
			var $button = $(this);
			$readMores.show('fade');
			$button.hide('fade');
			var target = $button.attr('target');

			var $moreInformationNextToPackage = $button.parent().find('.more-information-about-package');
			if($moreInformationNextToPackage.length === 1)
			{
				$moreInformationNextToPackage.find('.infobox').hide();
				$moreInformationNextToPackage.find('#' + target).show('slide');
			}
			else
			{
				$infos.hide('slide');
				$moreInformationAboutPackage.find('#' + target).show('slide');
			}

			var packageName = $button.attr('package-name');
			_gaq.push(['_trackEvent', 'Paketit yksityisille', packageName]);
		});

		$closeButtons.click(function () {
			$readMores.show('fade');
			$infos.hide('slide');
		});
	}

	function unbindInfoboxEvents() {
    	var $services = $('#services-for-individuals');
		var $readMores = $services.find('.read-more');
		var $closeButtons = $services.find('.close-button');
		$readMores.unbind('click');
		$closeButtons.unbind('click');
	}

	function setEffects() {
		$('a > img').hover(
			function () {
				$(this).animate({opacity:'0.8'});
			},
			function () {
				$(this).animate({opacity:'1'});
			}
		);
	}

	function decryptEmailAddress() {
		$('.crypted-email').each(function () {
			var cryptedEmail = $(this).attr('href');
			cryptedEmail = cryptedEmail.replace('mailto:', '');
			var decryptedEmail = Cryptography.doCrypt(13, cryptedEmail);
			$(this).attr('href', 'mailto:' + decryptedEmail).text(decryptedEmail);
		});
	}

	function bindEventsToNavigation() {
		$navButtons = $('nav.main').find('li');
		$navButtons.click(function () {
			$navButtons.removeClass('active');
			$(this).addClass('active');
			var linkName = $(this).find('a').text();
			_gaq.push(['_trackEvent', 'Navigointi', linkName]);
		});
	}

	app.init = function () {
		modernizrInit();
		getUpdates();
		initContactForm();
		initJQueryPlugins();
		bindInfoboxEvents();
		setEffects();
		decryptEmailAddress();
		bindEventsToNavigation();
	};

	return app;
})();