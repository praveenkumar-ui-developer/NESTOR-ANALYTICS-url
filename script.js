$(document).ready(() => {
    
    const tabs = [];

    // Function to render tabs
    function renderTabs() {
        const $tabList = $('#tab-list');
        $tabList.empty();
        tabs.forEach((tab, index) => {
            const $tabContainer = $('<div>').addClass('tab-container').toggleClass('active', index === tabs.length - 1);
            const $tab = $('<div>').addClass('tab').text(tab.query || '').click(() => switchTab($tabContainer));
            const $closeBtn = $('<span>').addClass('close-btn').text('X').click(() => closeTab($tabContainer));
            const $input = $('<input>').addClass('url-input').attr('type', 'text').attr('placeholder', 'Enter Search Query').val(tab.query || '');
            $input.on('keydown', function(e) {
                if (e.keyCode === 13) {
                    const index = $('.tab-container').index($tabContainer);
                    tabs[index].query = $(this).val();
                    searchWikipedia($(this).val());
                }
            });
            const isActiveTab = index === tabs.length - 1;
            $input.toggle(isActiveTab);
            $tabContainer.append($input, $tab, $closeBtn);
            $tabList.append($tabContainer);
        });
    }

    // Function to add a new tab
    $('#new-tab-btn').click(() => {
        tabs.push({ query: '' });
        renderTabs();
        switchTab($('.tab-container').last());
    });

    // Function to switch to a tab
    function switchTab($tabContainer) {
        $('.tab-container').removeClass('active');
        $tabContainer.addClass('active');
        const index = $('.tab-container').index($tabContainer);
        $('#tab-content').show();
        const query = tabs[index].query;
        searchWikipedia(query);
        $('.search-bar').hide();
        $tabContainer.find('.search-bar').show();
    }

    // Function to close a tab
    function closeTab($tabContainer) {
        const index = $('.tab-container').index($tabContainer);
        tabs.splice(index, 1);
        renderTabs();
        if (index === 0 && tabs.length > 0) {
            switchTab($('.tab-container').eq(0));
        } else if (index > 0) {
            switchTab($('.tab-container').eq(index - 1));
        } else {
            $('#content-iframe').attr('src', ''); // No tabs left, clear iframe content
            $('#tab-content').hide();
        }
    }

    // Function to search Wikipedia
    function searchWikipedia(query) {
        const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(query)}`;

        $.ajax({
            url: apiUrl,
            dataType: 'jsonp',
            success: function(response) {
                // Process the search results and display them in the iframe or your custom UI
                const searchResults = response.query.search;
                if (searchResults.length > 0) {
                    const pageTitle = searchResults[0].title;
                    loadUrl(`https://en.wikipedia.org/wiki/${pageTitle}`);
                } else {
                    $('#content-iframe').attr('src', ''); // Clear iframe if no search results found
                }
            },
            error: function(xhr, status, error) {
                console.error('Error fetching search results:', error);
            }
        });
    }

    // Function to load URL in iframe
    function loadUrl(url) {
        $('#content-iframe').attr('src', url);
    }
    loadUrl('https://city-weather-webapplication.netlify.app');

    // Attach click event listener to tabs
    $(document).on('click', '.tab-container', function() {
        switchTab($(this));
    });

    // Initial rendering
    renderTabs();
});

