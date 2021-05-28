if ( ConsoleNavService && ConsoleNavService.AccountInfo) {
  window.postMessage({from: "aws-account-header", ver: 1, AccountInfo: ConsoleNavService.AccountInfo});
}

