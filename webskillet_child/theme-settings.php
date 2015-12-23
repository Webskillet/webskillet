<?php

/**
 * @file
 * theme-settings.php
 */
function webskillet_child_form_system_theme_settings_alter(&$form, $form_state) {

  $form['webskillet_navigation'] = array(
	'#type' => 'fieldset',
	'#title' => 'Navigation',
	'#collapsible' => TRUE,
  );
  $form['webskillet_navigation']['webskillet_navigation_title'] = array
  (
	'#type' => 'textfield',
	'#title' => t('Navigation Title'),
	'#description' => t('Title to display for navigation (generally only shown on mobile)'),
	'#default_value' => theme_get_setting('webskillet_navigation_title'),
  );
  $form['webskillet_navigation']['webskillet_navigation_icon'] = array
  (
	'#type' => 'textfield',
	'#title' => t('Navigation Icon'),
	'#description' => t('Fontawesome icon class to add to navigation title (generally only shown on mobile)'),
	'#default_value' => theme_get_setting('webskillet_navigation_icon'),
  );
  $form['webskillet_navigation']['webskillet_navigation_style'] = array
  (
	'#type' => 'select',
	'#title' => t('Mobile Navigation Style'),
	'#options' => array(
		'default' => 'Default',
		'basic' => 'Basic',
	),
	'#description' => t('<strong>Default:</strong> On devices smaller than an iPad (768 pixels), clicking on navigation header slides menu in from the left side, with sub-menus opening downward<br /><strong>Basic:</strong> On devices smaller than an iPad (768 pixels), clicking on navigation header opens menu directly below the header, with sub-menus opening downward'),
	'#default_value' => theme_get_setting('webskillet_navigation_style'),
  );

  $form['webskillet_section_navigation'] = array
  (
	'#type' => 'fieldset',
	'#title' => 'In-page section navigation',
	'#collapsible' => true,
	'#collapsed' => (theme_get_setting('webskillet_section_navigation_selector') != '.section-navigation') || (theme_get_setting('webskillet_section_navigation_padding') != 20),
  );
  $form['webskillet_section_navigation']['webskillet_section_navigation_selector'] = array
  (
	'#type' => 'textfield',
	'#title' => t('Section Navigation Selector'),
	'#description' => t('jQuery selector to trigger in-page section navigation'),
	'#default_value' => theme_get_setting('webskillet_section_navigation_selector'),
  );
  $form['webskillet_section_navigation']['webskillet_section_navigation_padding'] = array
  (
	'#type' => 'textfield',
	'#title' => t('Section Navigation Padding'),
	'#description' => t('Number of pixels to leave at the top of the page when scrolling to another section of the page (increase if you are using a fixed header)'),
	'#default_value' => theme_get_setting('webskillet_section_navigation_padding'),
  );

  $form['webskillet_external'] = array
  (
	'#type' => 'fieldset',
	'#title' => 'External link handling',
	'#collapsible' => true,
	'#collapsed' => !theme_get_setting('webskillet_external_links_exceptions'),
  );
  $form['webskillet_external']['webskillet_external_links'] = array(
	'#type' => 'radios',
	'#title' => t('Open any links that go offsite in a new window'),
	'#default_value' => theme_get_setting('webskillet_external_links'),
	'#options' => array(
		1 => 'Yes',
		0 => 'No',
	),
  );
  $form['webskillet_external']['webskillet_external_links_exceptions'] = array(
	'#type' => 'textfield',
	'#title' => t('Exceptions'),
    '#description' => t('jQuery selector for external links that should <strong>not</strong> be opened in a new window'),
	'#default_value' => theme_get_setting('webskillet_external_links_exceptions'),
  );

  $form['webskillet_style'] = array
  (
	'#type' => 'fieldset',
	'#title' => 'Style settings (css and fonts)',
	'#collapsible' => true,
	'#collapsed' => !(theme_get_setting('webskillet_google_webfonts') || theme_get_setting('webskillet_custom_css')),
  );
  $form['webskillet_style']['webskillet_google_webfonts'] = array
  (
	'#type' => 'textfield',
	'#title' => t('Google webfonts'),
	'#description' => t('Will be appended to //fonts.googleapis.com/css?family='),
	'#default_value' => theme_get_setting('webskillet_google_webfonts'),
  );
  $form['webskillet_style']['webskillet_custom_css'] = array
  (
    '#type' => 'textarea',
    '#title' => t('Custom CSS'),
    '#description' => t('CSS to be added inside &lt;style&gt; tags in &lt;head&gt; element, after all other styles'),
    '#default_value' => theme_get_setting('webskillet_custom_css'),
    '#cols' => 60,
    '#rows' => 7,
  );

  $form['webskillet_js'] = array
  (
	'#type' => 'fieldset',
	'#title' => 'Javascript',
	'#collapsible' => true,
	'#collapsed' => !theme_get_setting('webskillet_custom_js'),
  );
  $form['webskillet_js']['webskillet_js_validate_forms'] = array(
	'#type' => 'radios',
	'#title' => t('Validate all forms using jquery validate?'),
	'#default_value' => theme_get_setting('webskillet_js_validate_forms'),
	'#options' => array(
		1 => 'Yes',
		0 => 'No',
	),
  );
  $form['webskillet_js']['webskillet_js_fix_footer'] = array(
	'#type' => 'radios',
	'#title' => t('Fix footer to bottom of the window if page content is shorter than window height?'),
	'#default_value' => theme_get_setting('webskillet_js_fix_footer'),
	'#options' => array(
		1 => 'Yes',
		0 => 'No',
	),
  );
  $form['webskillet_js']['webskillet_js_shorten_links'] = array(
	'#type' => 'radios',
	'#title' => t('Shorten any links that don\'t fit in their parent container?'),
	'#default_value' => theme_get_setting('webskillet_js_shorten_links'),
	'#options' => array(
		1 => 'Yes',
		0 => 'No',
	),
  );
  $form['webskillet_js']['webskillet_custom_js'] = array
  (
    '#type' => 'textarea',
    '#title' => t('Custom Javascript'),
    '#description' => t('Javascript to be added inside &lt;script&gt; tags in &lt;head&gt; element, after all other scripts'),
    '#default_value' => theme_get_setting('webskillet_custom_js'),
    '#cols' => 60,
    '#rows' => 7,
  );


  $form['webskillet_twitter'] = array
  (
	'#type' => 'fieldset',
	'#title' => 'Twitter',
	'#collapsible' => true,
	'#collapsed' => !(theme_get_setting('webskillet_twitter_handle') || theme_get_setting('webskillet_twitter_hashtag') || theme_get_setting('webskillet_twitter_field')),
  );
  $form['webskillet_twitter']['webskillet_twitter_handle'] = array
  (
    '#type' => 'textfield',
    '#title' => t('Twitter handle for sharing links'),
    '#description' => t('If you enter a Twitter handle here, it will be appended to "share this on Twitter" tweets'),
	'#default_value' => theme_get_setting('webskillet_twitter_handle'),
  );
  $form['webskillet_twitter']['webskillet_twitter_hashtag'] = array
  (
    '#type' => 'textfield',
    '#title' => t('Twitter hashtag for sharing links'),
    '#description' => t('If you enter a Twitter hashtag here, it will be appended to "share this on Twitter" tweets'),
	'#default_value' => theme_get_setting('webskillet_twitter_hashtag'),
  );
  $form['webskillet_twitter']['webskillet_twitter_field'] = array
  (
    '#type' => 'textfield',
    '#title' => t('Field to use for tweet'),
    '#description' => t('By default, the title of the node will be used for the tweet. Enter the machine name of a custom field to allow that field to override the title (title will still be used if this field is blank, or if the node type doesn\'t have the field).  This <strong>will</strong> hide the field in the node display, unless you override that behavior in node.tpl.php.'),
	'#default_value' => theme_get_setting('webskillet_twitter_field'),
  );


  $form['webskillet_blocks'] = array
  (
	'#type' => 'fieldset',
	'#title' => 'Advanced block settings',
	'#collapsible' => true,
	'#collapsed' => !(theme_get_setting('webskillet_block_classes') || theme_get_setting('webskillet_block_icons')),
  );
  $form['webskillet_blocks']['webskillet_block_classes'] = array
  (
    '#type' => 'textarea',
    '#title' => t('Block classes by region'),
    '#description' => t('<p>To add a class (such as a Bootstrap grid column class) to all blocks in a given region, use this format: region|class. One region per line, separate multiple classes with spaces.</p><p>Available regions: header, navigation, highlighted, content, sidebar_first, sidebar_second, prefooter1, prefooter2, utility, footer</p><p>By default, blocks in the Highlighted, Prefooter 1 and 2 and Footer region will be given the col-xs-12 class, to assure proper padding inside the row element.</p>'),
    '#default_value' => theme_get_setting('webskillet_block_classes'),
    '#cols' => 60,
    '#rows' => 7,
  );
  $form['webskillet_blocks']['webskillet_block_icons'] = array
  (
    '#type' => 'textarea',
    '#title' => t('Block Title Icons'),
    '#description' => t('To add an icon to the title of a block, use this format: block_id|icon. One block per line.  icon can be either a class declaration, in which case an &lt;i&gt; element with the class will be prepended to the title, or any arbitrary html (such as an &lt;img&gt; tag).'),
    '#default_value' => theme_get_setting('webskillet_block_icons'),
    '#cols' => 60,
    '#rows' => 7,
  );

  $form['webskillet_google_site_verification'] = array
  (
    '#type' => 'textfield',
    '#title' => t('Google site verification code'),
	'#default_value' => theme_get_setting('webskillet_google_site_verification'),
  );

  return $form;
}
