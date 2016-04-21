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
                favicon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAADAFBMVEUAAAAICAEAAAAAAABkjYoVEgEGDAf//v8FBQH9/P8AAAD/+/8ZFwmQlMKIi3yOkZGurLfev8OAfYQDCgW6s7P7/Ojp/v77//////39//94c1QAAAAAAAD////////////TfoZax2yUtKmrqIne2snmwtiZt5VciIaosaSlipGCpX2ur7ian9z/+v++rKSdvpcOCwCunaGjss1CaWZycE4nOjdsaUTY6tOhm2XZ1+orGy50eHT//f7J2dt5qadhc3LMzNFOSSoIJSE+V1hHQhrw///v7e/q2vDd0+P+7P/j8/N9dlfg39NDREP/9/+Wn54RDRG+4+G/v795dnJ+fXZNSi0cDR4QKuDpGStPwDYFH+IRLOAPK+kCA+PrGizwDyH0BxoAE+QSLeIBFd0ADN0AAt38FivqDB46vRvyARTsABG2AQykrPoCGukLJt8ABs6M7V1PyTRBuyc+uiLZAAzrAAV8iv9yg/9GX/82WPwxQfoIJe0QPesACOopO+S5vt5+iNmSlNjY1dcABcvGxsn/rruCg7tpcbqio67RoaywsZ79hZSd05F5hJCA5mxsjGdsqmG4VmD/Ljr5JjpTxjn+HTLyHTBIvy62Gys7nSnpEyfMFSY2tCE/wCAutxg0whArqBAipQblAAZ/pP+Tov+Snf9RfP9gc/8mPv8QLP3D5fRkdPPP0PFjj/CMme8OIexWUemRsuiiweSHkuRfceQMINYWLdRyftIACtLJzNAABdADFMTM4cPG1MN6d7+8tLrNsbqYqrpMU7resrnLyraGjLXtubPO87IUHLIqO7CTma8AAK+wza6nta7/nqv5mabpkJ3LfJyXspnF95Wd3JOp+JKPjo+RlIzjeYi6nITNYYOmc3mj/3jIanW6/3SF83Fi0nD/Z27/gm1uyGeX9FyieVpnvFn3S1Nk01BWgU/sJ0xUkEh15UfSQUXQMECxMT5W0DpRTTJf2i3hCCuWRCdGzib/GBzjABGWJRD/AA3PAAOoAwIjsgASlgCZBQDGAADpkVMCAAAAV3RSTlMACgQ2uol/e2xqTj4W+/bl4N/ampSJfWJJODcvKiEdCP7+/fz5+Pj49/T08Ozr6+fm5eTg4NfQzMzBwby4t7Szsq6uraempKObkpKOgoBcXFhSTks+KyiB+q3iAAACL0lEQVR4AWNABXL+jAx4AWeTPX4FXjPOsTDhU2Cb/bMVnwp5w+yETIgKWU4bX0yVkrd/TUvPPG8X6Cao8O6wKaaDxScuiotIT7gxcXbJooe9XJhWiL1PiIiImJWVFR+fdsAJ0wJXzey0CCCIi4sr7VZnRshwi4QxyIoJ3p1dEh8BAemT9gsjaZU4o2WpOqOkND4+IS0OrCDzgrEMsu/0Fz7mu/UqK3Py298JU0EGTG5hQ7HdY+b8OYpKFz8/X3X9x/+0aRERWd3ODCFIjvCbkFGYMefBpWPtlZue/vs+dVbpJBWjeiRXyKktmBJZOHfe1X3NKxef/ZL97VHnlgqUcHCYWRgZGZlR0LYjKrZy483OtTWpZSY8yNE8IQOooLigLT8mOmX9sprUqNycj9JICtxfzwUqKCo4mh8THp2XHJUUVdVhgKTA8+WCKSAT3pxqjgkPD48Oj04p50PyBHv/wg8gA+bf4wWaAAa56xyR4rD/79ei6dPnfbrcuDUKIp9XXe+C0N/07H5f34viJ3s3pEYlhUNAckULK0xBkLWQED+/xp7tsbExSdFQBdGpy48ghTYjD1Ow7qG6quSURLgZseVdHKjJQeR4z8GG1duigH6ISklMTKxdiq7C/M8dPW+B3dXRyXVLNjc08upos6GmSu6eK1YMoidz82pzLKSkQnkYMVI1ewcrA3f7rtgyZWYc+SIAmIwETq/YyYovc4meyDHDm4Ml1lzjwp+BfVA8BwCESNe4x56sjAAAAABJRU5ErkJggg==",
                link_selector : ".tLink",
                options: true
            },
            "tapochek.net": {
                title: "Tapochek.net",
                static_url: "//tapochek.net/tracker.php",
                favicon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAABiVBMVEVQb5wqR3HM1eNthqoJIUMLI0UAAADs8Pbr7/Zuhqvr8PUgPGICCBTO1+RVdZxMa5lAX4oHFDMDDyHv9Pvo7PPk6fDf5u/X4OnH0uDCz+O+zuSzwtiovNmdtNN0jrNde6Q4U4n///8+bqs8batWhLtPgLhWhrxAcK0rX6JEdbE3aaegt9VLfLZCc69olshikMSiudaKqs9gjsJaiL5Yh71Tg7s+b6xrmctkk8ZdjMFSgrk6bKnr8fdbir9Id7HU4e/T4O5diLxLe7RIebNFdK48bKk6a6goXJ/9/v7v9Pru8/nY5PJnlcf1+PyGps0/ca41Z6bs8viKqc2Boslbi8FUgLb7/P3y9vru9Prm7fXg6fTW4/HR3u29z+Wyx99um8xeir4xY6MkWZ3d5/LO2+vK2erD0+arwt6gutmYtdedtdSRsNSPrNB2oM98ncZrlcV4mcRxlcJskcD6/P3i6/TC1Oe6z+awx+K2yd+Hq9N7o85zmshjjcBiirxahLdPfbWct9eKrNNmkMLwfu7EAAAAIXRSTlNWM8ltFhgA6+pu6ikIy1tSRw8L8Obi3tbEwL+wqqB2YT5IUh+cAAACn0lEQVQ4y3WSd3uaUBSHaato1WZ1715ZgQAGFQcYRFGjiUZjTExcjWbvvUfHJ++9oHnM86QvfwDnvPy4nAuGe+xD2NMMuodxHPP8+JAF/+Htt2Ecc78Hl9tjJuM9rNvt8SUw4MG+g+1OZxIy+ghY6HTus59t2EtwNFniOC6jqmmC4EqlNJFW1UyG40ptb+yVDXsBDkdhG3W9XmL++C7khec0Utqp2HM7TDhsZ1QCVkMMQ1wuxObh2XQyJSiYCe004Q0RKYIhUnGQPeYYQoC6N811E/ZL8GH1aLocSparALQSxN3qOIrhtFkzYZ9jmNB9DID1FYAoNOH1LiEwarInCIKgrYN+qsdMSvB2hTk1xWpCYqmvn90tamyK+TVrrmGOYDWDTcRQp9FaL1iCobFQsBJCGlssjsH6wm/K4G9QlM6HBE2Yn7KEInu70ZyC5TOekhVDQupaa4ZlkYBeIRQlYLLFkyRJ/c0BhC4gwQ4TZgShbAmbVDAYlA8KALHKamRXYJMJafMU1uIBORCkNtEsWjtHvPEgUBTP7gBI88Dv20IBa3ySopL0ornIGYNSSOXWnENOr5lzkChSVvhET1BkWrmu9g9qQ6bJB6GcVEjSXwP9LEgyLVOJXFeQSfpgBRQu1k5Qs7YxDU52YIQlvAQST9IB+ubsquL7A8d1IVbE861gIEhSyzn0FVCggxPRSsUfiYhww698eV+0Ep0I0I8Fvy+SF/PnsdqemI/4/D3B1i+IYnjvei8cFruCsrxobrdkyHRgIooSwggrAa0hUIW//QBokiRKMIWfEDPBjxIk8GUEs38Cp6sNXY/H4/X6NKJeh9e63mjo4PUQjuHur+8cTpfT4XI5nU6HwwkPhwtWXI43Hwc9UMBH3M+exm3z4Pg/yWC/FZg/ZwkAAAAASUVORK5CYII=",
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


        htmlblock.append("<div class='kinotracker_block'><span class='kinotracker_label'>Скачать:</span>" + html + "</div>");
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