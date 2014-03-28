var urlPattern = /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;

chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
    if(!text) return;
    $.ajax({
        url:'http://haskell.org/hoogle?hoogle='+text,
        type:'get',
        dataType:'xml',
        success: function(data){ 
            var suggestions = $('.ans', data);
            var suggestionsMap = suggestions.map(function(_, sugg){
                var from = $(sugg, data).next().filter('.from').html();
                var link = $('a.a', sugg).attr('href');
                var text = $(sugg).html();
                text = text.replace(/<(\/)?b>/g, '<$1match>');
                if(from)
                    text = text + " <dim> - "+from+"</dim>";
                return {content: link, description: text}
            });
            suggest(suggestionsMap.toArray());
        }
    });
});

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(function(text) {
    if(urlPattern.test(text))
        navigate(text);
    else
        navigate('http://haskell.org/hoogle?hoogle='+text);
});

function navigate(url) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        chrome.tabs.update(tabs[0].id, {
            url: url
        });
    });
}
