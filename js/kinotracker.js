(function () {
    var props = {
            AddTag: false,
            Tag: 'DVDRip',
            Sort: 4,
            SortOrder: 2
        },

        postfix = "#marker={{marker}}",

        links = {
            "rutracker.org": {
                title: "RuTracker.Org",
                static_url: "//rutracker.org/forum/tracker.php",
                favicon: "//rutracker.org/favicon.ico",
                link_selector : ".tLink",
                options: true
            },
            "tapochek.net": {
                title: "Tapochek.net",
                static_url: "//tapochek.net/tracker.php",
                favicon: "//tapochek.net/favicon.ico",
                link_selector : ".genmed",
                options: false
            }
        },

    link_template = '' +
        '<a class="kinotracker_link" target="_blank" href="{{link}}">' +
            '<img class="kinotracker_img" title="Искать на {{title}}" src="{{favicon}}"/>' +
        '</a>',

    marker_template = '<span class="kinotracker_marked">{{marker}}</span>';

    load_props(props);

    function addLinks(htmlblock, dyn_url, options, filmname) {
        var html = "", url;

        Object.keys(links).forEach(function(key) {
            url = links[key].static_url + dyn_url;

            if (links[key].options) url += " " + options;

            url += postfix;

            html += link_template
                .split("{{link}}").join(url)
                .split("{{title}}").join(links[key].title)
                .split("{{favicon}}").join(links[key].favicon)
                .split("{{marker}}").join(filmname);
        });


        htmlblock.append("<div class='kinotracker_block'>" + html + "</div>");
    }

    function load_props(opt) {
        chrome.extension.sendRequest(
            opt,
            function (resp) {
              getAnswer(resp)
            }
        );
    }

    function getAnswer(opt) {
        var banned_chars = /"|«|»|\(ТВ\)|&|:|!|·|\(сериал\)/g,
            mov_local_name = $('h1[itemprop=name]'),                                     // Блок названия на русском
            mov_orig_name = $('span[itemprop=alternativeHeadline]').text(),              // Оригинальное название
            year = $('table.info tr:first-of-type a:first-of-type').text(),              // Год выпуска
            filmname = (mov_orig_name || mov_local_name.text()),
            mov = filmname.replace(banned_chars, ''),    // Название фильма (оригинал/рус)
            marker = [mov_local_name.text(),mov_orig_name].join("&"),
            dyn_url = '?o=' + opt.Sort + '&s=' + opt.SortOrder + '&nm=' + mov + ' ' + year;

        opt.Tag = ( opt.AddTag === "true" ) ? opt.Tag : "";

        addLinks(mov_local_name, dyn_url, opt.Tag, marker);
    }

    if (links[location.hostname]) {
        var markers = location.hash.replace("#marker=", "").split("&");

        $(links[location.hostname].link_selector).each(function() {
            var $this = $(this),
                html = $this.html();

            markers.forEach(function (element, index, array) {
                var regexp = new RegExp(element, "i"),
                    wrapped_marker = marker_template.split("{{marker}}").join(element);

                html = html.replace(regexp, wrapped_marker);
            });

            $this.html(html)
        })
    }
}());