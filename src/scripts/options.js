const Rivets = require( 'rivets' )

Rivets['formatters'].localize = key =>
    chrome.i18n ? chrome.i18n.getMessage( key ) : key

const options = {

    addTag: true,
    tag: '1080p',
    sort: 1,
    order: 1,

    save() {},

    load() {}
}

const viewModel = {

    isDropdownOpened: false,

    close() {
        setTimeout( window.close, 150 )
    },

    closeDropdown() {
        viewModel.isDropdownOpened = false
        document.body.removeEventListener( 'mousedown', viewModel.closeDropdown )
    },

    toggleDropdown() {
        viewModel.isDropdownOpened = !viewModel.isDropdownOpened
        if ( viewModel.isDropdownOpened ) {
            document.body.addEventListener( 'mousedown', viewModel.closeDropdown )
        }
    }

}

function bindOptions() {
    const el = document.getElementById( 'options' )

    Rivets.bind( el, { options, view: viewModel } )
}

bindOptions()
