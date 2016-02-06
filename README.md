# webskillet
Webskillet base theme

Mobile-first HTML5 base theme for Drupal 7

Plays well with the following modules:
* [__Special Menu Items__](https://www.drupal.org/project/special_menu_items): "nolink" menu items which have child menu links will trigger pull-downs if clicked on.
* [__OM Maximenu__](https://www.drupal.org/project/om_maximenu): if maximenu block with "no style" is placed in navigation region, will make the maximenu mobile-friendly. In order to ensure expected behavior, select mouse action of "Click (fast)," skin of "No Style" and style of "Dropdown," and make all menu links that have blocks attached to them into &lt;span&gt; elements by making sure the Title Options > Path field is empty.
* [__Hybridauth Social Login__](https://www.drupal.org/project/hybridauth): changes the confusing "Hybridauth Identities" tabs and links to "Social Identities"

Feature requests should be directed to [Jonathan Kissam](https://jonathankissam.wordpress.com/about/)

7.x-1.0-beta1 - February 2016

New Features:
* dismiss icons for modals and reveals loaded as css rather than HTML, so can be overridden in child theme css
* option for a thin css-only "X" for the dismiss icons
* removed font declaration for header elements
* changed margin-bottom: 1.5em (which creates a margin-bottom of 22.5 pixels given the base font size of 15 pixels) to 1.333em (margin-bottom of 20 pixels)
* added support for om_maximenu

7.x-1.0-alpha2 - December 2015

Features:
* regions for modals and side-reveals (just put blocks in the regions and links to them will open them as modals or reveals - if the user login block is put in either the modal or a reveal region, all links to /user/login will open the block, and the destination attribute will follow).
* dismissable messages
* fontAwesome icons
* responsive mobile navigation
* Modals, mobile menus and reveals can be dismissed through a dismiss link, clicking in the main body, or pressing the ESC key.  Mobile menu and reveals can be dismissed by swiping on touch devices
* fastClick for smoother experience on mobile devices
* pull-down submenus
* jQuery.validate validation of all forms by default (can be turned off)
* option to fix footer to the bottom of the window when page content isn't long enough (can be turned off)
* long text links that overflow their containers automatically shortened (can be turned off)
* external links open in new pages (can be turned off entirely or selectively, using jQuery selectors)
* classes for in-page scrolling section navigation
* custom css and js can be injected using theme settings
* javascript utilities for handling cookies, popups, fixing elements (such as headers) on scroll, equalizing height of a set of elements, scrolling within page, and vertical centering
