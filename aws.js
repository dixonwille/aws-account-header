function onError(error) {
  console.log(`Error: ${error}`);
}

function normaliseAccountID(acct) {
  return acct.replace(/-/ig, ''); 	
}

function onGot(item, acct) {
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

/**
 * injectScript - Inject internal script to available access to the `window`
 *
 * @param  {type} file_path Local path of the internal script.
 * @param  {type} tag The tag as string, where the script will be append (default: 'body').
 * @see    {@link http://stackoverflow.com/questions/20499994/access-window-variable-from-content-script}
 */
function injectScript(file_path, tag) {
    var node = document.getElementsByTagName(tag)[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', file_path);
    node.appendChild(script);
}


function requestCurrentAccountInfo( callback ) {
  if (chrome) {
    window.addEventListener("message", function(message) {
      console.log(message);
      if (message.data && message.data.from && ('aws-account-header' === message.data.from ) ) {
        callback (message.data.AccountInfo)
      }
    });

    injectScript(chrome.extension.getURL('inject.js'), 'body');
  } else {
    if ( window.wrappedJSObject && window.wrappedJSObject.ConsoleNavService && window.wrappedJSObject.ConsoleNavService.AccountInfo) {
      callback ( window.wrappedJSObject.ConsoleNavService.AccountInfo );
    } else {
      console.log ('no ConsoleNavService found');
    }
  }
}

requestCurrentAccountInfo ( function (accountInfo) {
  var normalisedAccId = normaliseAccountID(accountInfo.userAccountNumber);

  if (chrome) {
    chrome.storage.sync.get(function (item) {
      return onGot( item, normalisedAccId)
    });
  } else {
      browser.storage.sync.get().then(function (item) {
        return onGot( item, normalisedAccId)
      }, onError);
  }
});
