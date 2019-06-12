# SadGod
SadGod helps you extract data from ROTMG's internal SWF files. Currently it allows you to read the names and values of all binary packet ids used in the network communication. This is helpful because the game often changes the packet ids.

This library uses the MIT license. Please use this library for good purposes :)

## Basics
Step 1. Install SadGod
```js
npm install sadgod
```

Step 2. Require and Use SadGod
```js
const {getCurrentSWFData} = require('sadgod')

getCurrentSWFData.then(swfData => {
    console.log(Got Data, swfData)
}).catch(err => {
    console.log(err)
})
```
One warning: SadGod uses JPEXS's SWF decompiler to extract the script files. This can take a long time, however this data will be cached and reused when requesting the swf data later so it will be lightning fast. This process must be repeated if you delete your cache or the game is updated.

## Caching
SadGod uses caching in multiple places. Metadata about the most recent game version is stored in `/ApplicationStorage.json`, the downloaded swf's are downloaded permanently in the `/downloads/` folder, and the extracted swf contents are cached permanently in the `/extracted/` folder. Feel free to delete these files at your leasure as they will be automatically rebuilt when you next call upon the library.
