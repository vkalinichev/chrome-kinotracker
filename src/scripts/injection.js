const { findBestMatch } = require( 'string-similarity' )

const $ = require( 'jquery' )

class Kinotracker {

    constructor() {
        this.properties = {
            addTag: false,
            tag: 'DVDRip',
            sort: 4,
            sortOrder: 2
        }

        this.el = $( 'h1[itemprop=name]' )

        this.links = require( './data/links' )
        this.template = require( './templates/kinotracker.pug' )
        this.markerTemplate = require( './templates/marker.pug' )
        this.bubbleTemplate = require( './templates/bubble.pug' )
        this.loadProperties( this.properties )
        this.highlightMarkers()
        this.bindEvents()
    }

    render( data ) {
        this.el.append( this.template( data ) )
    }

    bindEvents() {
        const template = this.bubbleTemplate
        const links = this.links

        document.addEventListener( "mouseup", () => {
            const needle = window.getSelection().toString()
            const selectedRange = window.getSelection().getRangeAt( 0 ).cloneRange()

            if ( selectedRange.endOffset - selectedRange.startOffset <= 3 ) return

            fetch( "https://www.kinopoisk.ru/search/handler-chromium-extensions?v=1&query=" + encodeURIComponent( needle ) )
                .then( res => res.json() )
                .then( data => {
                    const bestMatch = findBestMatch( needle, [ data.name, data.rus ] ).bestMatch

                    if ( bestMatch.rating < .5 ) return

                    const selectedRangeRect = selectedRange.getBoundingClientRect()

                    const $bubble = $( template( { data, links } ) )

                    const left = selectedRangeRect.right + window.scrollX + "px"
                    const top = selectedRangeRect.top + window.scrollY + "px"

                    $bubble[ 0 ].style.setProperty( "left", left, "important" )
                    $bubble[ 0 ].style.setProperty( "top", top, "important" )

                    $( document.body ).append( $bubble )

                    const onClickOutside = () =>
                        document.removeEventListener( "mousedown", onClickOutside )
                    setTimeout( () => $bubble.remove(), 1000 )

                    document.addEventListener( "mousedown", onClickOutside )
                } )
        } )
    }

    addLinks( dyn_url, options, filmname ) {
        this.linksData = {
            links: this.links,
            clue: dyn_url,
            options: options,
            marker: filmname
        }

        this.render( this.linksData )
    }

    loadProperties( options ) {
        if ( location.host !== 'www.kinopoisk.ru' ) return
        chrome.extension.sendRequest( options, this.getInfo )
    }

    getInfo( opt ) {
        const banned_chars = /"|«|»|\(ТВ\)|&|:|!|·|\(сериал\)/g

        const mov_orig_name = $( 'span[itemprop=alternativeHeadline]' ).text()
        const year = $( 'table.info tr:first-of-type a:first-of-type' ).text()
        const filmname = ( mov_orig_name || this.el.text() )
        const mov = filmname.replace( banned_chars, '' )
        const marker = [ this.el.text(), mov_orig_name ].join( "&" )
        const dyn_url = `?o=${ opt.Sort }&s=${ opt.SortOrder }&nm=${ mov } ${ year}`

        opt.Tag = ( opt.AddTag === "true" ) ? opt.Tag : ""

        this.addLinks( dyn_url, opt.Tag, marker )
    }

    highlightMarkers() {
        const markerTemplate = this.markerTemplate

        if ( !this.links[ location.hostname ] ) return

        const markers = location
            .hash
            .replace( "#marker=", "" )
            .split( "&" )

        const $scopeElements = $( this.links[ location.hostname ].link_selector )

        $scopeElements.each( () => {
            const $this = $( this )
            let html = $this.html()

            markers.forEach( element => {
                const regexp = new RegExp( element, "i" )
                const marker = markerTemplate( { data: { marker: element } } )

                html = html.replace( regexp, marker )
            } )
            $this.html( html )
        } )
    }
}

module.exports = new Kinotracker