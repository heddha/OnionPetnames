initialize();

function initialize() {
  var gettingAllStorageItems = browser.storage.local.get(null);
  gettingAllStorageItems.then((results) => {
    var petnameKeys = Object.keys(results);
    for (let petnameKey of petnameKeys) {
      var curValue = results[petnameKey];
      displayEntry(petnameKey,curValue);
    }
  }, onError);
}
