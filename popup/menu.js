initializeEntriesONLY();

function initializeEntriesONLY() {
  var gettingAllStorageItems = browser.storage.local.get(null);
  gettingAllStorageItems.then((results) => {
    var petnameKeys = Object.keys(results);
    for (let petnameKey of petnameKeys) {
      var curValue = results[petnameKey];
      displayEntriesONLY(petnameKey,curValue);
    }
  }, onError);
}



//var importRuleButton = document.querySelector("button[name='importEverything']");
//importRuleButton.addEventListener('click', importRules);
