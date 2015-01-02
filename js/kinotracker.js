(function () {
  var props = {
        AddTag: false,
        Tag: 'DVDRip',
        Sort: 4,
        SortOrder: 2
      },

      links = {
        rutracker: {
          title: "RuTracker.Org",
          static_url: "//rutracker.org/forum/tracker.php",
          favicon: "//rutracker.org/favicon.ico",
          options: true
        },
        tapochek: {
          title: "Tapochek.net",
          static_url: "//tapochek.net/tracker.php",
          favicon: "//tapochek.net/favicon.ico",
          options: false
        }
      };

  load_props(props);

  function addLinks(htmlblock, dyn_url, options) {
    var html = "";

    for (var i = 0, url, img, length = links.length; i < length; i++) {
      url = links[i].static_url + dyn_url;
      if (links[i].options) url += " " + options;
      img = "<img class=\"kinotracker_img\" title=\"Искать на " + links[i].title + "\" src=\"" + links[i].favicon + "\"/>";
      html += "<a class=\"kinotracker_link\" target=\"_blank\" href=\"" + url + "\">" + img + "</a>"
    }

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
        mov = (mov_orig_name || mov_local_name.text()).replace(banned_chars, ''),    // Название фильма (оригинал/рус)
        dyn_url = '?o=' + opt.Sort + '&s=' + opt.SortOrder + '&nm=' + mov + ' ' + year;

    opt.Tag = ( opt.AddTag === "true" ) ? opt.Tag : "";

    addLinks(mov_local_name, dyn_url, opt.Tag);
  }

}());