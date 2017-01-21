Rivets = require 'rivets'

Rivets.formatters.localize = ( key )->
    chrome.i18n?.getMessage( key ) or key


options =

    addTag: true
    tag: '1080p'
    sort: 1
    order: 1

    save: ->
        1

    load: ->
        2


viewModel =

    isDropdownOpened: false

    close: ->
        setTimeout ( -> window.close() ), 150

    toggleDropdown: ->
        @isDropdownOpened = !@isDropdownOpened


bindOptions = ->
    el = document.getElementById 'options'

    Rivets.bind el, { options, view: viewModel }


bindOptions()
