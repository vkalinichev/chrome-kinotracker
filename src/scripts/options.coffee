class OptionsView

    constructor: ->
        $ => @initialize()

    initialize: ->
        @ui =
            dropdowns: $ ".js_dropdown"
            addTag: $ ".js_add_tag"
            tag: $ ".js_tag"
            sort: $ ".js_sort"
            order: $ ".js_order"

        @bindEvents()
        @getSettings()


    bindEvents: ->
        $ document
            .on "click", ".js_save_btn",  @setSettings.bind @
            .on "click", ".js_cancel_btn",  @closeWindow
#            .on "click", ".js_reset_btn", @resetSettings.bind @
            .on "change", ".js_add_tag", @disableTag.bind @

        $ ".js_dropdown"
            .on "click", ".js_dropdown_toggle", @dropdownToggle.bind @
            .on "click", "[data-value]", @dropdownSet.bind @


    get: ( property, defaults )-> localStorage[property] or defaults

    set: ( property, value )-> localStorage[ property ] = value

    closeWindow: ->
        setTimeout ->
            window.close()
        , 150

    dropdownToggle: (event)->
        console.log "dropdownToggle", event.delegateTarget

        $dropdown = $ event.delegateTarget

        $dropdown.toggleClass "dropdown_open"
        isOpen = $dropdown.hasClass "dropdown_open"
        if isOpen
            $ document
                .one "mousedown", (event)->
                    if not $(event.target).closest( $dropdown ).length
                        $dropdown.removeClass "dropdown_open"
                        

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
#            $item.prependTo $item.parent()

            $toggle.text $item.text()

    dropdownSet: ( event )->
        $dropdown = $ event.delegateTarget
        $toggle = $dropdown.find ".js_dropdown_toggle"
        $item = $ event.currentTarget
        $item
            .addClass "dropdown__item_active"
            .siblings()
                .removeClass "dropdown__item_active"
#        $item.prependTo $item.parent()

        $toggle.text $item.text()
        $dropdown
            .data 'value', $item.data 'value'
            .removeClass "dropdown_open"

    setSettings: ->
        @set "AddTag", @ui.addTag[0].checked
        @set "Tag",    @ui.tag.val()
        @set "Sort",   @ui.sort.data 'value'
        @closeWindow()

    getSettings: ->
        settings =
            addTag: @get("AddTag") == "true"
            tag: @get "Tag", 'DVDRip'
            sort: @get "Sort", 4
            order: @get "Order", 2

        @ui.addTag[0].checked = settings.addTag
        @disableTag()
        @ui.tag.val settings.tag
        @ui.sort.data 'value', settings.sort
        @ui.order.data 'value', settings.order
        @dropdownsInit()


    disableTag: ->
        @ui.tag[0].disabled = not @ui.addTag[0].checked

module.exports = new OptionsView()
