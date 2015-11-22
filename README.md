# nw-menubar

NW.js menus made easy.

```javascript

var mb = require('nw-menubar')(require('nw.gui'))
  .defaults('My App') // calls `createMacBuiltin('My App')` on Mac
  .build([
    // let's create a simple 'File' menu
    {
      label: 'File',
      items: [
        // define items almost like you would with `new gui.MenuItem()`
        {
          label: 'Open File',
          click: function() {
            // your code here
          },
          tooltip: 'Select a file and open it',
          icon: 'ico/open.png',
          keys: 'cmd+o', // merge `key` and `modifiers`
        },
        {
          label: 'Save File',
          action: app.saveCurrentFile,
          tooltip: 'Save current file on disk',
          icon: 'ico/save.png',
          keys: 'cmd+s',
        },
        // other items
        // ...
      ]
    },
    // other menus
    // ...
  ]);
```

Need dynamic values for `label`, `enabled` or `checked` ?
Simply use functions as values and refresh when needed :

```javascript

var mb = require('nw-menubar').build([
    {
      label: 'Movie',
      items: [
        // item 'Play/Pause' : pause if playing / resume playing if paused
        {
          label: function() {
            // label says 'Pause' if playing / 'Play' if paused
            return player.isPlaying ? 'Pause' : 'Play';
          },
          click: function() {
            player.togglePause();
            // .refresh() method will reevaluate all functions
            // and update corresponding properties
            mb.refresh();
          }
        },
        // ...
      ]
    },
    // ...
  ]);
```

Functions can be used as values for properties
`label`, `icon`, `tooltip`, `checkable`, `checked`, `enabled`, `keys` and `items`.


## Documentation

### Methods

#### .defaults([appName][, opts])

Create and setup the menu bar.
On Mac this also creates the default menus (App, Edit and Window).
`appName` and `opts` are passed to `Menu.createMacBuiltin()`.

Be careful to call this before you add your menus, as it will remove any existing items.

#### .minimal()

Same as `.defaults()` but do not create the default menus on Mac.

Be careful to call this before you add your menus, as it will remove any existing items.

#### .dev()

Adds a menu called "Development" with the following items :
- Refresh `cmd+R`
- Toggle inspector `cmd+shift+i`

#### .build(menu)

Builds the menu described by `menu`. See below for format explanation.

#### .refresh()

Update properties whose value is defined through a function.

### Menu description

#### Menu

A menu has the following properties :

- `label` - string (required)
- `items` - array

The `items` property can take either
a scalar value or
a function that returns the value.

Example :

```javascript
// Menu
{
  label: 'Movie',
  items: [
    // items
  ]
}
```

#### Item

An item has the following properties :

- `label` - string (required)
- `icon` - string
- `tooltip` - string
- `click` - function
- `checkable` - boolean
- `checked` - boolean
- `enabled` - boolean
- `keys` - string or array, see *Keyboard shortcuts* below

The properties `label`, `icon`, `tooltip`, `checkable`, `checked`, `enabled` and `keys` can take either
a scalar value or
a function that returns the value.

Example :

```javascript
// Menu item
{
  label: 'Play',
  icon: 'ico/play.png',
  tooltip: 'Resume playing',
  click: function() {},
  enabled: true,
  keys: 'cmd+o',
},
```

#### Submenus

To create a submenu just put a menu in the `items` of its parent.

Example :

```javascript
// Menu with submenus
{
  label: 'Audio', // this is the top level menu
  items: [
    {
      label: 'Tracks',  // this is a submenu
      items: [
        {
          label: 'English',
          action: function() {
            player.setAudioTrack('en');
          }
        },
        {
          label: 'French',
          action: function() {
            player.setAudioTrack('fr');
          }
        },
        // ...
      ]
    },
    // ...
  ]
}
```

#### Separators

To add a separator just use the string `'separator'` instead of an item :

Example :

```javascript
// Menu with separators
{
  label: 'Video',
  items: [
    {
      label: 'Fullscreen',
      click: function() { /**/ }
    },
    'separator',
    {
      label: 'Subtitles',
      click: function() { /**/ }
    },
    // ...
  ]
}
```

#### Keyboard shortcuts

Keyboard shortcuts are described using a string or an array.

The string form is the easiest one :

```javascript
'cmd+p'
// or with several modifiers
'ctrl+alt+shift+q'
```

The array form allows the use of non alphanumeric keys :

```javascript
// this is command with letter p
['cmd', 'p']

// this is shift with left arrow
['shift', String.fromCharCode(28)]
```

Possible modifiers are `cmd`, `alt`, `shift`, `ctrl`.


## License

The MIT License (MIT) - Copyright (c) 2015 Alexandre Bintz <alexandre@bintz.io>  
See [LICENSE](LICENSE) file for full text.
