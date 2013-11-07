veiljs
======

VeilJS is slated to become the small library for overlays and dialogues that 
integrates easily into your project.

It assumes as little as possible about your markup, styling and frontend code. 
Whether you want to use it with Zurb Foundation or Bootstrap, wrap it in a 
Knockout binding or an Angular Directive, or swap out jQuery with Zepto through 
requireJS — Veil is built with these requirements in mind.

Features
--------

* easy to read, extend and hook into to do your bidding
* well-documented
* tested
* small

Demos
-----

The files in this repository
----------------------------

<dl>
  <dt>veil.js</dt>
  <dd>The library itself. <i>(required)</i></dd>

  <dt>veil-jquery.js</dt>
  <dd>A jQuery plugin adapter for Veil. See the section (TODO) <i>(optional)</i></dd>

  <dt>veil-knockout.js</dt>
  <dd>A Knockout binding for Veil. See the section (TODO) <i>(optional)</i></dd> 

  <dt>veil-examples.css</dt>
  <dd>Some example styles (TODO) <i>(optional)</i></dd>
</dl>

Installation
------------

Either:

1. With [Bower](http://bower.io/):

    `$ bower install veiljs` (not yet released)

2. Download the latest release: link

3. Clone the repository:

    `$ git clone https://github.com/janfoeh/veiljs.git`

Include the components in your site:

```HTML
<head>
  <script type="text/javascript" src="veil.js"></script>

  <!-- optional: the jQuery adapter if you prefer to use Veil in the form of $(selector).veil() -->
  <script type="text/javascript" src="veil-jquery.js"></script>
  
  <!-- optional: the Knockout binding -->
  <script type="text/javascript" src="veil-knockout.js"></script>
</head>
```

Basic usage
-----------

Options
-------

<table>
  <thead>
    <tr>
      <th>Option</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>backgroundMarkup</td>
      <td>"&lt;div class='veil-background'&gt;&lt;/div&gt;"</td>
      <td>
        the markup for the overlay background. Set to null to disable.
      </td>
    </tr>

    <tr>
      <td>overlayClass</td>
      <td></td>
      <td>additional CSS class(es) to apply to the overlay markup</td>
    </tr>

    <tr>
      <td>cssTransitionSupport</td>
      <td><i>true</i></td>
      <td>see - TODO - for more details</td>
    </tr>

    <tr>
      <td>debug</td>
      <td><i>false</i></td>
      <td>provide debug information and error handling in the console</td>
    </tr>
  </tbody>
</table>

API
---

<dl>
  <dt>.show()</dt>
  <dd>Displays the overlay. Creates the markup if it is not already present</dd>

  <dt>.hide()</dt>
  <dd>Hides the overlay. Keeps the overlay markup in the DOM</dd>

  <dt>.overlay()</dt>
  <dd>Returns the overlay markup from the DOM as a jQuery object. Creates the markup if it is not already present</dd>

  <dt>.exists()</dt>
  <dd>Does the overlay currently exist in the DOM?</dd>

  <dt>.isActive()</dt>
  <dd>Is the overlay currently active, or in the process of activating?</dd>

  <dt>.setContent(string)</dt>
  <dd>Set or update the overlay content</dd>

  <dt>.destroy()</dt>
  <dd>Remove the overlay markup from the DOM immediately. Does not hide it first if currently active</dd>

  <dt>.addCallback(triggerName, callback)</dt>
  <dd>Adds a callback function, to be executed at &lt;triggerName&gt;</dd>
</dl>

See the [docs](/docs/index.html) for more details.

Callbacks and Events
--------------------

You can add callbacks either in an object literal as the second argument to `new Veil(options, callbacks)`, or through
`addCallback()`. The second form allows multiple callbacks per trigger, which are executed in the order they where added.

```JS
var v = new Veil({}, {afterCreate: function(overlay) {} });
v.addCallback('afterCreate', function(overlay) {});
```

<dl>
  <dt>afterCreate</dt>
  <dd>
    Called after the overlay markup has been created. Receives the overlay DOM element as a jQuery object. It is called
    in the scope of the Veil instance.
  </dd>

  <dt>afterShow</dt>
  <dd>
    Called after the overlay markup has been shown. Receives the overlay DOM element as a jQuery object. It is called
    in the scope of the Veil instance.
  </dd>
</dl>

See the [docs](/docs/index.html) for more details.

Extensions
----------

### jQuery plugin ###

### Knockout binding ###