localize = ( key )->
    chrome.i18n.getMessage key

class OptionsView

    constructor: ->
        $ => @initialize()

    initialize: ->
        @ui =
            dropdowns: $ ".js_dropdown"
            togglers: $ ".js_toggler"
            addTag: $ ".js_add_tag"
            tag: $ ".js_tag"
            sort: $ ".js_sort"
            order: $ ".js_order"

        @i18n =
            texts: $ "[data-text]"
            placeholders: $ "[data-placeholder]"
            titles: $ "[data-title]"

        @localize()
        @bindEvents()
        @getSettings()

    localize: ->
        @i18n.texts.each ->
            @innerText = localize @dataset.text

        @i18n.placeholders.each ->
            @placeholder = localize @dataset.placeholder

        @i18n.titles.each ->
            @title = localize @dataset.title


    bindEvents: ->
        $ document
            .on "click", ".js_save_btn",  @setSettings.bind @
            .on "click", ".js_cancel_btn",  @closeWindow
            .on "change", ".js_add_tag", @disableTag.bind @
            .on "click", ".js_toggler", @togglerToggle.bind @

        $ ".js_dropdown"
            .on "click", ".js_dropdown_toggle", @dropdownToggle.bind @
            .on "click", "[data-value]", @dropdownSet.bind @


    get: ( property, defaults )-> localStorage[ property ] or defaults

    set: ( property, value )-> localStorage[ property ] = value

    closeWindow: ->
        setTimeout ->
            window.close()
        , 150

    dropdownToggle: (event)->
        $dropdown = $ event.delegateTarget

        $dropdown.toggleClass "dropdown_open"
        isOpen = $dropdown.hasClass "dropdown_open"
        if isOpen
            $ document
                .one "mousedown", (event)->
                    if not $(event.target).closest( $dropdown ).length
                        $dropdown.removeClass "dropdown_open"

    togglersInit: ->
        self = @
        @ui.togglers.each ->
            @dataset.state = @dataset.value is @dataset.on
            self.togglerUpdate @

    togglerToggle: (event)->
        toggler = event.currentTarget
        data = toggler.dataset
        data.state = data.state isnt "true"

        @togglerUpdate toggler

    togglerUpdate: (toggler)->
        data = toggler.dataset
        isOn = data.state is "true"
        state = if isOn then "on" else "off"

        data.value = data[ state ]
        toggler.title = localize( data[ "#{state}Title" ] )

        toggler.classList.toggle "toggler_on", isOn
        toggler.classList.toggle "toggler_off", not isOn


    dropdownsInit: ->
        @ui.dropdowns.each ->
            $dropdown = $ @
            $toggle = $dropdown.find ".js_dropdown_toggle"
            value = $dropdown.data 'value'
            $item = $dropdown.find "[data-value=#{value}]"
            $item
                .addClass "dropdown__item_active"
                .siblings()
                    .removeClass "dropdown__item_active"

            $toggle.text $item.text()

    dropdownSet: ( event )->
        $dropdown = $ event.delegateTarget
        $toggle = $dropdown.find ".js_dropdown_toggle"
        $item = $ event.currentTarget
        $item
            .addClass "dropdown__item_active"
            .siblings()
                .removeClass "dropdown__item_active"

        $toggle.text $item.text()
        $dropdown
            .data 'value', $item.data 'value'
            .removeClass "dropdown_open"

    setSettings: ->
        @set "AddTag", @ui.addTag[0].checked
        @set "Tag",    @ui.tag.val()
        @set "Sort",   @ui.sort.data 'value'
        @set "Order",  @ui.order[0].dataset.value

        @closeWindow()

    getSettings: ->
        settings =
            addTag: @get("AddTag") == "true"
            tag: @get "Tag", 'DVDRip'
            sort: @get "Sort", 4
            order: @get "Order", 2

        @ui.addTag[0].checked = settings.addTag
        @ui.tag.val settings.tag
        @ui.sort.data 'value', settings.sort
        @ui.order[0].dataset.value = settings.order

        @disableTag()
        @dropdownsInit()
        @togglersInit()

    disableTag: ->
        @ui.tag[0].disabled = not @ui.addTag[0].checked

module.exports = new OptionsView()
