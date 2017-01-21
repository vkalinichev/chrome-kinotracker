chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {

    const response = {}

    for ( let prop of request ) {
        response[ prop ] = localStorage[ prop ] || request[ prop ]
    }

    sendResponse( response )
} )
