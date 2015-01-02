chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    var response = {};
    var prop;
    for (prop in request) {
      if (request.hasOwnProperty(prop))
        response[prop] = localStorage[prop] || request[prop];
    }
    sendResponse(response);
});
