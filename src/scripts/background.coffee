chrome.extension.onRequest.addListener (request, sender, sendResponse)->
    
    response = {}
    for prop of request
        response[prop] = localStorage[prop] or request[prop]

    sendResponse response
