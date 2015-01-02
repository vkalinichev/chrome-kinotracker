$(document).ready(function(){
var	addTag	= $('input#cbaddtag'),
    tag     = $('input#inaddtag'),
    sort		= $('select#sort'),
    sortOrder	= $('input[name=sortorder]');

	addTag.change(disableTag);

    $(document)
        .on('click', '#save', saveSettings)
        .on('click', '#load', loadSettings)
        .on('click', '#reset', resetSettings);

	loadSettings();

  function saveSettings() {
    localStorage["AddTag"]	= addTag[0].checked;
    localStorage["Tag"]	    = tag.val();
    localStorage["Sort"]		= sort.val();
    localStorage["SortOrder"]	= sortOrder.filter(':checked').val();
    window.close();
  }

  function loadSettings() {
    addTag[0].checked = (readProp("AddTag")=="true");
    disableTag();
    tag.val(readProp("Tag",'DVDRip'));
    sort.val(readProp("Sort",4));
    sortOrder[readProp("SortOrder",2)-1].checked = true;
  }

  function resetSettings() {
    addTag[0].checked = false;
    disableTag();
    tag.val('DVDRip');
    sort.val(4);
    sortOrder[1].checked = true;
  }

  function disableTag() {
    tag[0].disabled = !addTag[0].checked;
  }

  function readProp(property, defVal) {
    return localStorage[property] || defVal;
  }


});
