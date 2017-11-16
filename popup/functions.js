/* initialise variables */

var boolNew = false;
var tmpText = {};

if (document.querySelector('[name="onionText"]'))
{var inputBody = document.querySelector('[name="onionText"]')
var inputTitle = document.querySelector('[name="petnameText"]')};

if (document.querySelector('.petname-container'))
{var petnameContainer = document.querySelector('.petname-container')};


if(document.querySelector('.getAddField'))
{var getAddFieldButton = document.querySelector('.getAddField');
getAddFieldButton.addEventListener('click', showAddField);}


if(document.querySelector("input[name='secretPassphrase']"))
{var secretPassphraseInput = document.querySelector("input[name='secretPassphrase']");}


if(document.querySelector("button[name='importButton']"))
{var importButton = document.querySelector("button[name='importButton']");
importButton.addEventListener('click', importRules);}


if(document.querySelector('.add'))
{var addButton = document.querySelector('.add');
addButton.addEventListener('click', addEntry);}


if(document.querySelector('.clear'))
{var clearButton = document.querySelector('.clear');
clearButton.addEventListener('click', clearAll);}

/*if(document.querySelector('#theGreatA'))
{ console.error("greatA detected");
  document.querySelector('#theGreatA').addEventListener('click', exportRules);
}*/

if(document.querySelector("button[name='exportEverything']"))
{var exportRuleButton = document.querySelector("button[name='exportEverything']");  exportRuleButton.addEventListener('click', exportRules);}


if(document.getElementById("importRulesFile"))
{document.getElementById("importRulesFile").addEventListener("change", importRules);}


/* generic error handler */

function onError(error) {
  alert(error);
}



/*CRYPTO AS TAKEN FROM CryptoJS*/


/*encryptData uses the CryptoJS library and encrypts given data with secretPassphraseInput as the Key.*/
  function encryptData(data)
  {
    var encrypted = CryptoJS.AES.encrypt(data, secretPassphraseInput.value);
    return encrypted.toString();
  }

/*decryptData uses the CryptoJS library and decrypts given data with secretPassphraseInput as the Key */
  function decryptData(data)
  {
    var decrypted = CryptoJS.AES.decrypt(data, secretPassphraseInput.value);
    return decrypted;
  }



/*IMPORTHING THINGS*/


/*Inport Rules funtion is called when button with id "importRulesFile" is pressed. Imports and decrypts the contents of the given file with the passphrase from input field "secretPassphrase". Saves the entries in internal Storage afterwards.. */
function importRules(event)
{
  var file = event.target.files[0];
  var reader = new FileReader();
  reader.onload = function(event) {
    var data = event.target.result;
    try
    { var decrypted = decryptData(data);
      var decryptedToString = decrypted.toString(CryptoJS.enc.Utf8);
      var parsed = JSON.parse(decryptedToString);
      var keysOfParsed = Object.keys(parsed);
      for (var obj of keysOfParsed)
      {//console.log(parsed[obj])
        storeEntry(obj, parsed[obj])};
        document.getElementById("disclaimer").innerHTML = "<p> <br> The entries have been added to your database.";
      }
      catch (exception)
      {
        document.getElementById("disclaimer").innerHTML = "<br> <br> Import unsuccessful. Wrong password?";
      }
    };
    reader.readAsText(file);
  }




/*EXPORTING THINGS!*/


/*exportRules is called when the exportEverything button is pressed. Takes all entries from Storage and gives them to the writeDocument function.*/
  function exportRules()
  {
    var gettingAllStorageItems = browser.storage.local.get(null);
    gettingAllStorageItems.then((results) => {
      var petnameKeys = Object.keys(results);
      var tmptmpText = {}
      for (let petnameKey of petnameKeys) {
        var onionName = results[petnameKey];
        tmptmpText[petnameKey] = onionName;
      }
      writeDocument(tmptmpText);
    }, onError);
  }

/*writeDocument saves shit. Encrypted. Things didn't work with a single button, so the two buttons are the unfortunate solution.*/
  function writeDocument(tmpText)
  {
    var a = document.getElementById("theGreatA");
    var inputButton = document.getElementById("inputButton");
    var textToSaveAsBlob = new Blob([encryptData(JSON.stringify(tmpText))], {type:"text/plain"});
    a.href = URL.createObjectURL(textToSaveAsBlob);
    a.download = "Exported_Onion_Rules.json";
  }




/*Makes things appear or disappear, depending on whether whichOne is true or false*/
  function showThing(bool, whichOne)
  {
    if(bool==true)
    {document.getElementById(whichOne).style.display="block";}
    else if(bool==false)
    {document.getElementById(whichOne).style.display="none";}
  }

/*Makes the addNewEntry field disappear and appear!*/
  function showAddField()
  {
    boolNew=!boolNew;
    showThing(boolNew, "newEntryForm");
    showThing(boolNew, "newEntryButton");
  }


/* The following functions are taken from https://github.com/mdn/webextensions-examples/tree/master/quicknote */


/* Add an entry to the display, and storage */

  function addEntry() {
    var petname = inputTitle.value;
    var onionname = inputBody.value;
    var gettingItem = browser.storage.local.get(petname);
    gettingItem.then((result) => {
      var objTest = Object.keys(result);
      if(objTest.length < 1 && petname !== '' && onionname !== '') {
        inputTitle.value = '';
        inputBody.value = '';
        storeEntry(petname,onionname);
      }
    }, onError);
  }

  /* function to store a new entry in storage */

  function storeEntry(title, body) {
    var storingEntry = browser.storage.local.set({ [title] : body });
    storingEntry.then(() => {
      displayEntry(title,body);
    }, onError);
  }

  /* function to display an entry in the entry box */

  function displayEntry(title, body) {

    /* create entry display box */
    var entry = document.createElement('div');
    var entryDisplay = document.createElement('div');
    var entryH = document.createElement('h2');
    var entryParagraph = document.createElement('p');
    var deleteButton = document.createElement('button');
    var clearFix = document.createElement('div');

    entry.setAttribute('class','entry');

    entryH.textContent = title;
    entryParagraph.textContent = body;
    deleteButton.setAttribute('class','delete');
    deleteButton.textContent = 'Delete entry';
    clearFix.setAttribute('class','clearfix');

    entryDisplay.appendChild(entryH);
    entryDisplay.appendChild(entryParagraph);
    entryDisplay.appendChild(deleteButton);
    entryDisplay.appendChild(clearFix);

    entry.appendChild(entryDisplay);

    /* set up listener for the delete functionality */

    deleteButton.addEventListener('click',(e) => {
      const evtTgt = e.target;
      evtTgt.parentNode.parentNode.parentNode.removeChild(evtTgt.parentNode.parentNode);
      browser.storage.local.remove(title);
    })

    /* create entry edit box */
    var entryEdit = document.createElement('div');
    var petnameEdit = document.createElement('input');
    var onionnameEdit = document.createElement('textarea');
    var clearFix2 = document.createElement('div');

    var updateButton = document.createElement('button');
    var cancelButton = document.createElement('button');

    updateButton.setAttribute('class','update');
    updateButton.textContent = 'Update entry';
    cancelButton.setAttribute('class','cancel');
    cancelButton.textContent = 'Cancel update';

    entryEdit.appendChild(petnameEdit);
    petnameEdit.value = title;
    entryEdit.appendChild(onionnameEdit);
    onionnameEdit.textContent = body;
    entryEdit.appendChild(updateButton);
    entryEdit.appendChild(cancelButton);

    entryEdit.appendChild(clearFix2);
    clearFix2.setAttribute('class','clearfix');

    entry.appendChild(entryEdit);

    petnameContainer.appendChild(entry);
    entryEdit.style.display = 'none';

    /* set up listeners for the update functionality */

    entryH.addEventListener('click',() => {
      entryDisplay.style.display = 'none';
      entryEdit.style.display = 'block';
    })

    entryParagraph.addEventListener('click',() => {
      entryDisplay.style.display = 'none';
      entryEdit.style.display = 'block';
    })

    cancelButton.addEventListener('click',() => {
      entryDisplay.style.display = 'block';
      entryEdit.style.display = 'none';
      petnameEdit.value = title;
      onionnameEdit.value = body;
    })

    updateButton.addEventListener('click',() => {
      if(petnameEdit.value !== title || onionnameEdit.value !== body) {
        updateEntry(title,petnameEdit.value,onionnameEdit.value);
        entry.parentNode.removeChild(entry);
      }
    });
  }


/* function to update entries */

function updateEntry(delEntry,newTitle,newBody) {
  var storingEntry = browser.storage.local.set({ [newTitle] : newBody });
  storingEntry.then(() => {
    if(delEntry !== newTitle) {
      var removingEntry = browser.storage.local.remove(delEntry);
      removingEntry.then(() => {
        displayEntry(newTitle, newBody);
      }, onError);
    } else {
      displayEntry(newTitle, newBody);
    }
  }, onError);
}


/* Clear all entries from the display/storage */

function clearAll() {
  while (petnameContainer.firstChild) {
    petnameContainer.removeChild(petnameContainer.firstChild);
  }
  browser.storage.local.clear();
}

/*Modified displayEntry function to only display things, not change them and not have buttons surrounding them*/

function displayEntriesONLY(title, body)
{
  var entry = document.createElement('div');
  var entryDisplay = document.createElement('div');
  var entryH = document.createElement('button');
  var entryParagraph = document.createElement('a');

  entry.setAttribute('class','entry');
  entryH.textContent = title;

  entryH.addEventListener('click',() => {
    browser.tabs.create({url:body})
  });

  entryDisplay.appendChild(entryH);
  entry.appendChild(entryDisplay);
  var alternativeEntry = document.createElement('div');
  //alternativeEntry.textContent = SortLocalStorage();
  petnameContainer.appendChild(entry);

}
