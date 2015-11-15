/**
 * nw-menubar - NW.js menus made easy.
 *
 * The MIT License (MIT)
 * Copyright (c) 2015 Alexandre Bintz <alexandre@bintz.io>
 */

'use strict';

/**
 * NWMenuBar
 *
 * @constructor
 *
 * @param gui module nw.gui
 */
function NWMenuBar(gui) {

  this.gui = gui;
  this.menubar = undefined;
  this.menus = []; // user defined menus land here
}

/**
 * Create the menu bar object
 */
NWMenuBar.prototype.createMenuBar = function() {

  this.menubar = new this.gui.Menu({
    type: 'menubar'
  });
}

/**
 * Setup the menu bar
 */
NWMenuBar.prototype.setupMenuBar = function() {

  this.gui.Window.get().menu = this.menubar;
}

/**
 * Create & Setup the menu bar if not already done
 */
NWMenuBar.prototype.initMenuBarIfNeeded = function() {

  if (this.menubar === undefined) {
    this.createMenuBar();
    this.setupMenuBar();
  }
}

/**
 * Add an item to a menu
 *
 * @param object parent menu to add item to
 * @param object item item as an object literal
 */
NWMenuBar.prototype.append = function(parent, item) {

  var opts = {};

  if (item === 'separator') {

    item = {
      type: 'separator',
    };
    opts.type = 'separator';

  } else {

    if (item.hasOwnProperty('label')) {
      opts.label = item.label;
      if (typeof opts.label === 'function') {
        opts.label = opts.label();
      }
    }
    if (item.hasOwnProperty('icon')) {
      opts.icon = item.icon;
      if (typeof opts.icon === 'function') {
        opts.icon = opts.icon();
      }
    }
    if (item.hasOwnProperty('tooltip')) {
      opts.tooltip = item.tooltip;
      if (typeof opts.tooltip === 'function') {
        opts.tooltip = opts.tooltip();
      }
    }
    if (item.hasOwnProperty('checked')) {
      opts.checked = item.checked;
      if (typeof opts.checked === 'function') {
        opts.checked = opts.checked();
      }
    }
    if (item.hasOwnProperty('enabled')) {
      opts.enabled = item.enabled;
      if (typeof opts.enabled === 'function') {
        opts.enabled = opts.enabled();
      }
    }
    if (item.hasOwnProperty('click')) {
      opts.click = item.click;
    }
    if (item.hasOwnProperty('checkable')) {
      var checkable = item.checkable;
      if (typeof checkable === 'function') {
        checkable = checkable();
      }
      if (checkable === true) {
        opts.type = 'checkbox';
      }
    }
    if (item.hasOwnProperty('keys')) {
      var keys = item.keys;
      if (typeof keys === 'function') {
        keys = keys();
      }
      var kb = this.parseKeyboardShortcut(keys);
      opts.key = kb.key;
      opts.modifiers = kb.modifiers.join('-');
    }
    if (item.hasOwnProperty('items')) {
      var subItems = item.items;
      if (typeof subItems === 'function') {
        subItems = subItems();
      }
      if (subItems.length > 0) {
        opts.submenu = new this.gui.Menu();
        for (var i = 0, l = subItems.length; i < l; i++) {
          this.append(opts.submenu, subItems[i]);
        }
      }
    }
  }

  item.native = new this.gui.MenuItem(opts);
  parent.append(item.native);
}

/**
 * Parse a keyboars shortcut definition
 *
 * @param string or array keys the shortcut definition in either form
 *
 * @return object string key
 *                array  modifiers
 */
NWMenuBar.prototype.parseKeyboardShortcut = function(keys) {

  if (typeof keys === 'string') {
    keys = keys.split('+');
  }
  return {
    key: keys.pop(),
    modifiers: keys
  };
}

/**
 * Init menu bar with no menus
 *
 * @returns NWMenuBar
 */
NWMenuBar.prototype.minimal = function() {

  this.createMenuBar();
  this.setupMenuBar();

  return this;
}

/**
 * Init menu bar with default Mac menus
 *
 * @param string appName display name of the app
 *                       used in the default Mac menus
 * @param object ops     options to pass to `Menu.createMacBuiltin()`
 *                       see https://github.com/nwjs/nw.js/wiki/Menu#menucreatemacbuiltinappname
 *
 * @returns NWMenuBar
 */
NWMenuBar.prototype.defaults = function(appName, opts) {

  this.createMenuBar();

  if (this.menubar.createMacBuiltin) {
    this.menubar.createMacBuiltin(appName, opts);
  }

  this.setupMenuBar();

  return this;
}

/**
 * Build menus and items
 *
 * @param array menus menus as object literals
 *
 * @returns NWMenuBar
 */
NWMenuBar.prototype.build = function(menus) {

  this.initMenuBarIfNeeded();

  for (var i = 0, l = menus.length; i < l; i++) {
    this.append(this.menubar, menus[i]);
  }

  this.menus = this.menus.concat(menus);

  return this;
}

/**
 * Create developement menus
 *
 * @returns NWMenuBar
 */
NWMenuBar.prototype.dev = function() {

  var win = this.gui.Window.get();
  var _this = this;

  this.build([{
    label: 'Development',
    items: [{
      label: 'Reload',
      click: function() {
        win.reloadDev();
      },
      keys: 'cmd+r',
    }, {
      label: 'Inspector',
      click: function() {
        win.isDevToolsOpen() ? win.closeDevTools() : win.showDevTools();
        _this.refresh();
      },
      keys: 'cmd+shift+i',
      checkable: true,
      checked: function() {
        return win.isDevToolsOpen();
      },
    }]
  }]);

  return this;
}

/**
 * Rebuild all menus
 *
 * @returns NWMenuBar
 */
NWMenuBar.prototype.refresh = function() {

  for (var i = 0, l = this.menus.length; i < l; i++) {
    var menu = this.menus[i];

    var nativeMenu = menu.native.submenu;
    if (nativeMenu.items) {
      for (var j = 0, m = nativeMenu.items.length; j < m; j++) {
        nativeMenu.removeAt(0);
      }
    }
    var items = menu.items;
    if (typeof items === 'function') {
      items = items();
    }
    for (var j = 0, m = items.length; j < m; j++) {
      this.append(nativeMenu, items[j]);
    }
  }

  return this;
}

/*
 * Export
 */
module.exports = function(gui) {
  return new NWMenuBar(gui);
};
