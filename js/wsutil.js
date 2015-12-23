/**
 * webskillet Javascript utilities
 * Jonathan Kissam (plus others as credited)
 * December 2015
 *
 * Table of contents:
 * 1. jQuery extensions
 *  1.1 jQuery.support.placeholder
 *  1.2 jQuery.smartresize
 *  1.3 :external selector
 *  1.4 :youtube selector
 *  1.5 :pdf, :doc, :xls and :ppt selectors
 * 2. wsUtil object definition TODO: add reveal, modal, organize what is used by theme vs. what are really utilities
 *  2.1 Default Base Theme Functions
 *   2.1.1 init
 *   2.1.2 prepareNavigation
 *   2.1.3 prepareMessages
 *   2.1.4 prepareModalsandReveals
 *   2.1.5 openModal
 *   2.1.6 closeModal
 *   2.1.7 openReveal
 *   2.1.8 closeReveal
 *  2.2 Optional Functions (controlled by theme options - which are inherited by child themes)
 *   2.2.1 fixFooter
 *   2.2.2 shortenLinks
 *   2.2.3 prepareExternalLinks
 *   2.2.4 prepareSectionNavigation
 *  2.3 Helper Functions (available for child themes and modules, but not called by base theme
 *   2.3.1 setCookie
 *   2.3.2 getCookie
 *   2.3.3 populateInputs
 *   2.3.4 preparePopUps
 *   2.3.5 fixOnScroll
 *   2.3.6 equalizeHeight
 *   2.3.7 scrollToInclude
 *   2.3.8 verticalCenter
 * 3. jQuery triggers
 *  3.1 jQuery(document).ready
 *  3.2 jQuery(window).load
 *  3.3 jQuery(document).ajaxComplete
 *  3.4 jQuery(window).smartResize
 */

/**
 * 1. jQuery extensions
 */

jQuery.support.placeholder = (function(){
    var i = document.createElement('input');
    return 'placeholder' in i;
})();

(function(jQuery,sr){
 
  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  var debounce = function (func, threshold, execAsap) {
      var timeout;
 
      return function debounced () {
          var obj = this, args = arguments;
          function delayed () {
              if (!execAsap)
                  func.apply(obj, args);
              timeout = null; 
          };
 
          if (timeout)
              clearTimeout(timeout);
          else if (execAsap)
              func.apply(obj, args);
 
          timeout = setTimeout(delayed, threshold || 100); 
      };
  }
	// smartresize 
	jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };
 
})(jQuery,'smartresize');

// Creating custom :external selector
jQuery.expr[':'].external = function(obj){
    if ((obj.href == '#') || (obj.href == '') || (obj.href == null)) { return false; }
    if(obj.href.match(/^mailto\:/)) { return false; }
    if(obj.href.match(/^javascript\:/)) { return false; }
    if ( (obj.hostname == location.hostname)
	|| ('www.'+obj.hostname == location.hostname)
	|| (obj.hostname == 'www.'+location.hostname)
	) { return false; }
    return true;
};

// Creating custom :youtube selector - jQuery selector a:youtube will match any a element that links to a YouTube video
jQuery.expr[':'].youtube = function(obj){ return obj.hostname.match(/(www\.)?youtu(be\.com|\.be)/i); }

// Custom selectors for document links - jQuery selectors a:pdf, a:doc, etc., will match any a element that links to a PDF, Word, etc. document
jQuery.expr[':'].pdf = function(obj) { return obj.hostname.match(/.pdf$/i); }
jQuery.expr[':'].doc = function(obj) { return obj.hostname.match(/.docx?$/i); }
jQuery.expr[':'].xls = function(obj) { return obj.hostname.match(/.xlsx?$/i); }
jQuery.expr[':'].ppt = function(obj) { return obj.hostname.match(/.pptx?$/i); }

/**
 * 2. wsUtil object definition
 */

wsUtil = {

	/**
	 * 2.1 default Webskillet theme functions
	 *
	 * to disable default navigation, deselect "Main Menu" in theme options and use menu blocks instead
	 * to disable modals or reveals, just don't put any blocks in those regions
	 * add needsclick class to any link that should *not* be sped up on mobile
	 *
	 * all other behaviors are controlled by theme options
	 */

	// 2.1.1 init
	init : function() {

		// instantiate FastClick (https://github.com/ftlabs/fastclick)
		FastClick.attach(document.body);

		// set up navigation, messages, and modals/reveals
		wsUtil.prepareNavigation();
		wsUtil.prepareMessages();
		wsUtil.prepareModalsandReveals();

		// validate any forms
		if (jQuery('form').validate && Drupal.settings.themeOptions.validateForms) {
			jQuery('form').each(function(){
				jQuery(this).validate();
			});
		}

		// fix footer
		if (Drupal.settings.themeOptions.fixFooter) {
			wsUtil.fixFooter();
		}

		// shorten links
		if (Drupal.settings.themeOptions.shortenLinks) {
			wsUtil.shortenLinks();
		}

		// external links
		if (Drupal.settings.themeOptions.externalLinks) {
			wsUtil.prepareExternalLinks(Drupal.settings.themeOptions.externalLinksExceptions);
		}

		// section navigation
		if (Drupal.settings.themeOptions.sectionNavigationSelector) {
			wsUtil.prepareSectionNavigation(Drupal.settings.themeOptions.sectionNavigationSelector, Drupal.settings.themeOptions.sectionNavigationPadding);
		}
	},

	// 2.1.2 javascript for mobile and drop-down navigation
	prepareNavigation : function(container) {
		jQuery('#navigation > ul.main-menu').append('<li class="menu-dismiss"><i class="fa fa-times-circle-o" title="Dismiss menu"></i></li>');
		jQuery('#navigation li.expanded ul.main-menu').before('<span class="menu-toggle closed"><i class="fa fa-caret-down" title="Open submenu"></i></span>');
		jQuery('#navigation .menu-toggle').click(function(){
			if (jQuery(this).hasClass('closed')) {
				jQuery(this).removeClass('closed').addClass('open');
				jQuery(this).children('i.fa').removeClass('fa-caret-down').addClass('fa-caret-up').attr('title','Close submenu');
				jQuery(this).siblings('ul.main-menu').addClass('open');
			} else {
				jQuery(this).removeClass('open').addClass('closed');
				jQuery(this).children('i.fa').removeClass('fa-caret-up').addClass('fa-caret-down').attr('title','Open submenu');
				jQuery(this).siblings('ul.main-menu').removeClass('open');
			}
		});
		jQuery('.navigation-header').click(function(){
			jQuery(this).siblings('.main-menu').toggleClass('open');
			if (jQuery(window).width() < 768) { wsUtil.closeReveal(); }
		});
		jQuery('.menu-dismiss').click(function(){ jQuery(this).parent('.main-menu').toggleClass('open'); });

		var menuHammer = new Hammer(jQuery('.mobile-style-default #navigation > ul.main-menu')[0]);
		menuHammer.on('swipeleft', function(event){
			if (jQuery(window).width() < 768) { jQuery('#navigation > ul.main-menu').removeClass('open'); }
		});
	},

	// 2.1.3 make system messages dismissable
	prepareMessages : function() {
		jQuery('.messages').each(function(){
			if (jQuery(this).children('.close').length < 1) {
				jQuery(this).prepend('<div class="close" title="(dismiss message)">&times;</div>');
				jQuery(this).children('.close').click(function(event){jQuery(this).parent().slideUp();});
			}
		});
	},

	/**
	 * 2.1.4 prepares modals and reveals
	 *
	 * any a element which links to the id of a block in the modal region will automatically open that block as a modal
	 * any a element which links to the id of a block in a reveal region will automatically open that block as a reveal
	 * or any (clickable) element can be given the class "modal-trigger" or "reveal-trigger" and attribute "data-target"
	 * which targets a block in the modal region, or a reveal region
	 * if the element has the attribute "data-modal-options" or "data-reveal-options" it will be parsed as a comma-separated list,
	 * and each element will be added to the options object with a "true" flag
	 * i.e., data-modal-options="list,of,options" will result in options = { list:true, of:true, options:true }
	 *
	 * the following functions can also be called programmatically:
	 * - wsUtil.openModal(selector, options)
	 * - wsUtil.openReveal(selector, options)
	 * selector must be either a jQuery object or selector referring to a block in the modal or reveal regions
	 * options should be a javascript object
	 * currently the only meaningful option is { focusInput : true }, which auto-focuses on the first text input in the block
	 */
	prepareModalsandReveals : function() {

		jQuery('.modal-dismiss').click(function(event){
			wsUtil.closeModal();
			event.preventDefault();
		});

		jQuery('.reveal-dismiss').click(function(event){
			wsUtil.closeReveal();
			event.preventDefault();
		});

		var bodyHammer = new Hammer(document.body);
		bodyHammer.on('swipeleft', function(event){ wsUtil.closeReveal(); });
		bodyHammer.on('swiperight', function(event){ wsUtil.closeReveal(); });

		jQuery('a, .modal-trigger, .reveal-trigger').click(function(event){

			if (jQuery(this).hasClass('external')) { return; }

			var $target;
			var href = jQuery(this).attr('data-target');
			if (!href) { href = jQuery(this).attr('href'); }
			if (!href) { return true; }

			var options = {};
			if (jQuery(this).attr('data-modal-options')) {
				var optionsList = jQuery(this).attr('data-modal-options');
				var optionsListArray = optionsList.split(',');
				for (var i=0; i<optionsListArray.length; i++) {
					options[optionsListArray[i]] = true;
				}
			}
			if (jQuery(this).attr('data-reveal-options')) {
				var optionsList = jQuery(this).attr('data-reveal-options');
				var optionsListArray = optionsList.split(',');
				for (var i=0; i<optionsListArray.length; i++) {
					options[optionsListArray[i]] = true;
				}
			}

			// if user login form has been placed in the modal or reveal region,
			// open any /user/login links as a modal, and add destination query from link to form action
			if ((href.substr(0,11) == '/user/login') && (jQuery('#modals #user-login-form').length || jQuery('.reveal #user-login-form').length)) {
				if (href.substr(0,24) == '/user/login?destination=') {
					var destination = href.substr(24);
					var modalAction = jQuery('#modals #user-login-form').attr('action').replace(/\?destination=[^&]+/,'?destination='+destination);
					jQuery('#modals #user-login-form').attr('action',modalAction);
					var revealAction = jQuery('.reveal #user-login-form').attr('action').replace(/\?destination=[^&]+/,'?destination='+destination);
					jQuery('.reveal #user-login-form').attr('action',revealAction);
				}
				$target = jQuery('#modals #user-login-form').closest('.block');
				if (!$target.length) { $target = jQuery('.reveal #user-login-form').closest('.block'); }
				options.focusInput = true;
			} else if (href.substr(0,1) == '#') {
				$target = jQuery(href);
			}

			if ($target.length != 1) { return; }
			if (!$target.hasClass('block')) { return true; }
			if ($target.closest('#modals').length) {
				event.preventDefault();
				wsUtil.openModal($target, options);
				return;
			}
			if ($target.closest('.reveal').length) {
				event.preventDefault();
				wsUtil.openReveal($target, options);
				return;
			}
			return true;
		});
	},

	// 2.1.5 open modal
	openModal : function(sel, options) {
		if (sel instanceof jQuery) { $el = sel; } else { $el = jQuery(sel); }

		// only open this if it is a block in the #modals region, and is not already open
		if (!$el.closest('#modals').length || !$el.hasClass('block')) { return; }
		if ($el.hasClass('open')) { return; }

		jQuery('#modals .block').hide();
		jQuery('#modals-wrapper').css('display','block');
		$el.css('display','block').addClass('open');
		setTimeout(function(){jQuery('body').addClass('modal-open');}, 0)

		if (options && options.focusInput && ($el.find('input[type="text"]').length > 0) && jQuery('html').hasClass('no-touch')) {
			$el.find('input[type="text"]:first').focus();
		}
	},

	// 2.1.6 close modal
	closeModal : function() {
		jQuery('body').removeClass('modal-open');
		window.setTimeout(function(){ jQuery('#modals .block').hide().removeClass('open'); jQuery('#modals-wrapper').hide(); }, 1000);
	},

	// 2.1.7 open reveal
	openReveal : function(sel, options) {
		if (sel instanceof jQuery) { $el = sel; } else { $el = jQuery(sel); }

		// only open this if it is a block in a reveal region, and is not already open
		if (!$el.closest('.reveal').length || !$el.hasClass('block')) { return; }
		if ($el.hasClass('open')) { return; }

		revealClassToAdd = ($el.closest('.reveal').attr('id') == 'reveal-left-wrapper') ? 'reveal-left' : 'reveal-right';

		if (jQuery('body').hasClass('reveal-left') || jQuery('body').hasClass('reveal-right')) {
			jQuery('body').removeClass('reveal-left reveal-right');
			setTimeout(function(){
				jQuery('.reveal .block').hide();
				$el.show().addClass('open');
				jQuery('body').addClass(revealClassToAdd);
			}, 150);
		} else {
			$el.show().addClass('open');
			jQuery('body').addClass(revealClassToAdd);
		}

		if (options && options.focusInput && ($el.find('input').length > 0) && jQuery('html').hasClass('no-touch')) {
			$el.find('input:first').focus();
		}
	},

	// 2.1.8 close reveal
	closeReveal : function() {
		jQuery('body').removeClass('reveal-left reveal-right');
		setTimeout(function(){
			jQuery('.reveal .block').hide().removeClass('open');
		}, 150);
	},

	/**
	 * 2.2 optional functions
	 * theme options determine whether these are called
	 * they could also be called programmatically by child themes or modules
	 */

	// 2.2.1 fixes footer to bottom of the window if the page content is not long enough
	fixFooter : function() {
		var $footer = jQuery('#footer-wrapper');
		var heightOfPage = jQuery(window).height();
		var bottomOfFooter = $footer.offset().top + $footer.outerHeight();
		if ($footer.hasClass('fixed')) {
			if ((jQuery('#wrapper').outerHeight() + $footer.outerHeight()) > heightOfPage) { $footer.removeClass('fixed'); }
		} else {
			if (bottomOfFooter < heightOfPage) { $footer.addClass('fixed'); }
		}
	},

	// 2.2.2 finds links which contain URLs longer than their parent containers
	// and replaces their inner text with shortened versions of the URL, or "(link)"
	shortenLinks : function() {
		jQuery('a').each(function(){
			if (jQuery(this).width() > jQuery(this).parent().width()) {

				href = jQuery(this).attr('href');
				linktext = jQuery(this).text();
				regex = /(https?:\/\/)?([a-zA-Z0-9\-\.]+)\/\S*/;
				isUrl = regex.exec(linktext);
				if (isUrl !== null && isUrl.length) {
					url = regex.exec(href);
					if (url[2]) {
						jQuery(this).text('('+url[2]+')');
					} else {
						jQuery(this).text('(link)');
					}
				}

			}
		});
	},

	// 2.2.3 open external links in new windows - exceptions can be a jQuery selector or array of such
	prepareExternalLinks : function(exceptions) {
		var sel;
		if (exceptions instanceof Array) {
			sel = exceptions.join()
		} else {
			sel = exceptions;
		}
		jQuery('a:external').addClass('external');
		jQuery(sel).removeClass('external');
		jQuery('a.external').each(function(){
			var href = jQuery(this).attr('href');
			var title = jQuery(this).attr('title') ? jQuery(this).attr('title') : '';
			title += (title.length > 0) ? ' ' : '';
			title += '(opens in a new window)';
			jQuery(this).attr('title',title);
			jQuery(this).click(function(event){
				window.open(href,'','');
				event.preventDefault();
			});
		});
	},

	// 2.2.4 when elements that match a particular jQuery selector
	// and target another element on the page with either href or data-target
	// are clicked, do an animated scroll to that target, leaving at least (padding) pixels at the top
	// clickable element can use data-callback to specify a function that should be called upon scroll completion
	// and data-focus-input="true" to auto-focus the input (on non-touch devices)
	prepareSectionNavigation : function(sel, padding) {
		if (isNaN(padding)) { padding = 20; }
		var $ = jQuery;
		$(sel).click(function(event){
			var target = $(this).attr('href');
			if (!target) { target = $(this).attr('data-target'); }
			if (!target || (target.substr(0,1) != '#')) { return true; }
			var callback = $(this).attr('data-callback');
			var focusInput = $(this).attr('data-focus-input');
			newTop = $(target).offset().top;
			newTop -= padding;
			$('html, body').stop().animate({
				scrollTop: newTop
			}, 500, function() {
				if (focusInput && $(target+' input').length && $('html').hasClass('no-touch')) {
					$(target+' input:first').focus();
				}
				if (typeof callback === 'string') {
					var callbackFn = new Function(callback);
					callbackFn();
				}
			});
			event.preventDefault();
		});
	},

	/**
	 * 2.3 helper functions
	 *
	 * these functions are available to be used by child themes or modules,
	 * but are not called by default
	 */

	// 2.3.1 set cookie
	setCookie : function(c_name,value,exdays) {
		var exdate=new Date();
		exdate.setDate(exdate.getDate() + exdays);
		var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
		document.cookie=c_name + "=" + c_value;
	},

	// 2.3.2 get cookie
	getCookie : function (c_name) {
		var i,x,y,ARRcookies=document.cookie.split(";");
		for (i=0;i<ARRcookies.length;i++) {
			x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
			y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
			x=x.replace(/^\s+|\s+$/g,"");
			if (x==c_name) {
				return unescape(y);
			}
		}
	},

	// 2.3.3 populate inputs with the value of their labels
	// use selector to target inputs
	populateInputs : function(selector) {
		jQuery(selector).each(function() {
			var populate_text = jQuery('label[for="' + jQuery(this).attr('id') + '"]:first').text();
			if (populate_text) {
				if (jQuery.support.placeholder) {
					jQuery(this).attr('placeholder',populate_text);
				} else {
					jQuery(this).val(populate_text).data('populate_text', populate_text);
					jQuery(this).addClass('populated');				
					jQuery(this).focus(function() {
						if (jQuery(this).val() == jQuery(this).data('populate_text')) {
							jQuery(this).val('');
							jQuery(this).removeClass('populated');
						}
					});
					jQuery(this).blur(function() {
						if (jQuery(this).val() == '') {
							jQuery(this).val(jQuery(this).data('populate_text'));
							jQuery(this).addClass('populated');
						}
					});
				}
			}
		});
	},

	// 2.3.4 open pop-up windows on particular links, by selector
	preparePopUps : function(sel,w,h) {
		jQuery(sel).click(function(event){
			var left = (screen.width - w)/2;
			var top = (screen.height - h)/2;
			top = (top < 50) ? 50 : top;
			var attr = 'height='+h+',width='+w+',left='+left+',top='+top+',location=0,menubar=0,status=0';
			window.open(jQuery(this).attr('href'),'popup',attr);
			event.preventDefault();
		});
	},

	// 2.3.5 adds class "fixed" to a particular element when the page scrolls past maxScroll pixels
	// also adds class to the body based on the id of the element
	fixOnScroll : function(sel, maxScroll) {
		var scrollElementId = jQuery(sel).attr('id') ? jQuery(sel).attr('id') : '';
		jQuery(window).scroll(function(){
			var pos = jQuery(window).scrollTop();
			if (pos > maxScroll) {
				jQuery(sel).addClass('fixed');
				if (scrollElementId) { jQuery('body').addClass(scrollElementId+'-fixed'); }
			} else {
				jQuery(sel).removeClass('fixed');
				if (scrollElementId) { jQuery('body').removeClass(scrollElementId+'-fixed'); }
			}
		});
	},

	// 2.3.6 sets vertical height of all matched elements to the same height (the maximum)
	// provided the window is at least minWidth (defaults to not doing this on anything narrower than a tablet)
	equalizeHeight : function(sel, minWidth) {
		if (!minWidth) { minWidth = 768; }
		var h = 0;
		jQuery(sel).css('height','auto').removeClass('fixed-height');
		if (jQuery(window).width() < minWidth) { return; }
		jQuery(sel).each(function(){
			var thisH = jQuery(this).outerHeight();
			// console.log('#'+jQuery(this).attr('id')+' height: '+thisH);
			if (thisH > h) { h = thisH; }
		});
		jQuery(sel).css('height',h+'px').addClass('fixed-height');
	},

	// 2.3.7 scroll the page to include a particular element, with at least (padding) pixels at the top
	// element may be jQuery object or jQuery selector, padding should be a number, optional callback function
	scrollToInclude : function(sel, padding, callback) {
		if (sel instanceof jQuery) { $el = sel; } else { $el = jQuery(sel); }
		if (isNaN(padding)) { padding = 20; }
		if (!$el.length || ($el.css('display') == 'none')) { return; }
		var newTop = $el.offset().top + $el.outerHeight + padding;
		if (newTop > jQuery(window).scrollTop()) {
			jQuery('html, body').stop().animate({
				scrollTop : newTop
			}, 500, function(){
				if (typeof callback === 'string') {
					var callbackFn = new Function(callback);
					callbackFn();
				}
			});
		}
	},

	// vertically center the element relative to another element
	// both may be jQuery objects or jQuery selectors
	verticalCenter : function(sel, relativeTo) {
		if (sel instanceof jQuery) { $el = sel; } else { $el = jQuery(sel); }
		if (relativeTo == null) { relativeTo = window; }
		if (relativeTo instanceof jQuery) { $relativeTo = relativeTo; } else { $relativeTo = jQuery(relativeTo); }
		var newTop = ( $relativeTo.height() - $el.outerHeight() ) / 2;
		if (newTop >= 0) { $el.css('top',newTop+'px'); }
	},

}

/**
 * 3.1 jQuery(document).ready
 */
jQuery(document).ready(function($){
	wsUtil.init();
});

/**
 * 3.2 jQuery(window).load
 */
jQuery(window).load(function(){
	if (Drupal.settings.themeOptions.fixFooter) { wsUtil.fixFooter(); }
	if (Drupal.settings.themeOptions.shortenLinks) { wsUtil.shortenLinks(); }
});

/**
 * 3.3 jQuery(document).ajaxComplete
 */
jQuery(document).ajaxComplete(function() {
	wsUtil.prepareMessages();
	if (Drupal.settings.themeOptions.fixFooter) { wsUtil.fixFooter(); }
	if (Drupal.settings.themeOptions.shortenLinks) { wsUtil.shortenLinks(); }
});

/**
 * 3.4 jQuery(window).smartresize()
 */
jQuery(window).smartresize(function(){
	if (Drupal.settings.themeOptions.fixFooter) { wsUtil.fixFooter(); }
	if (Drupal.settings.themeOptions.shortenLinks) { wsUtil.shortenLinks(); }
});
