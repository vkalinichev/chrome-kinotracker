class OptionsView

    constructor: ->
        @initialize()

    initialize: ->
        $ =>
            @ui =
                addTagCheckbox: $ ".js_checkbox_add_tag"
                tag: $ ".js_tag"
                sort: $ ".js_sort"
                sortOrder: $ ".js_sort_order"

            @bindEvents()
            @getSettings()


    bindEvents: ->
        $ document
            .on "click", ".js_save_btn",  @setSettings.bind @
            .on "click", ".js_load_btn",  @getSettings.bind @
            .on "click", ".js_reset_btn", @resetSettings.bind @
            .on "change", ".js_checkbox_add_tag", @disableTag.bind @


    get: ( property, defaults )-> localStorage[property] or defaults

    set: ( property, value )-> localStorage[ property ] = value


    setSettings: ->
        @set "AddTag", @ui.addTagCheckbox[0].checked
        @set "Tag",    @ui.tag.val()
        @set "Sort",   @ui.sort.val()
        @set "SortOrder", @ui.sortOrder.filter(":checked").val()
        window.close()

    getSettings: ->
        @ui.addTagCheckbox[0].checked = @get("AddTag") == "true"
        @disableTag()
        @ui.tag.val @get "Tag", 'DVDRip'
        @ui.sort.val @get "Sort", 4
        @ui.sortOrder[ @get("SortOrder", 2) - 1 ].checked = true

    resetSettings: ->
        @ui.addTagCheckbox[0].checked = false
        @disableTag()
        @ui.tag.val "-DVD5 -DVD9"
        @ui.sort.val 4
        @ui.sortOrder[1].checked = true


    disableTag: ->
        @ui.tag[0].disabled = not @ui.addTagCheckbox[0].checked

module.exports = new OptionsView()
