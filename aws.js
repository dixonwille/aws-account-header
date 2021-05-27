function onError(error) {
  console.log(`Error: ${error}`);
}

function getCurrentAWSAccountID() {
  if ( window.wrappedJSObject.ConsoleNavService && window.wrappedJSObject.ConsoleNavService.AccountInfo) {
	const accInfo = window.wrappedJSObject.ConsoleNavService.AccountInfo;
    return accInfo.userAccountNumber;
  }
  const ele = document.getElementById("awsc-login-display-name-account")
  if (ele) {
    return ele.textContent;
  }
  return null;
}

function normaliseAccountID(acct) {
  return acct.replace(/-/ig, ''); 	
}

function onGot(item) {
  var acct = getCurrentAWSAccountID()
  if (acct) {
    acct = normaliseAccountID(acct);

    if (item.hasOwnProperty(acct)) {
      document
        .querySelectorAll(
          "body #awsgnav #nav-menubar, body #awsgnav #nav-menubar .nav-menu, #nav-menu-right, #awsc-nav-header"
        )
        .forEach(function(ele) {
          ele.style.backgroundColor = item[acct];
        });
    }
  }
}

if (chrome) {
  chrome.storage.sync.get(onGot);
} else {
  browser.storage.sync.get().then(onGot, onError);
}
