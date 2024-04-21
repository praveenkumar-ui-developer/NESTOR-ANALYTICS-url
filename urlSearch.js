$(document).ready(() => {
    // Initialize an empty array to store tab URLs and search queries
    const tabs = [];

    // Function to render tabs
    function renderTabs() {
        const $tabList = $('#tab-list');
        $tabList.empty();
        tabs.forEach((tab, index) => {
            const $tabContainer = $('<div>').addClass('tab-container').toggleClass('active', index === tabs.length - 1);
            const $tab = $('<div>').addClass('tab').text(tab.url || '').click(() => switchTab($tabContainer));
            const $closeBtn = $('<span>').addClass('close-btn').text('X').click(() => closeTab($tabContainer));
            const $input = $('<input>').addClass('url-input').attr('type', 'text').attr('placeholder', 'Enter URL').val(tab.url || '');
            $input.on('keydown', function(e) {
                if (e.keyCode === 13) {
                    const index = $('.tab-container').index($tabContainer);
                    const url = $(this).val();
                    tabs[index].url = url;
                    loadUrl(url);
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
        tabs.push({ url: '' });
        renderTabs();
        switchTab($('.tab-container').last());
    });

    // Function to switch to a tab
    function switchTab($tabContainer) {
        $('.tab-container').removeClass('active');
        $tabContainer.addClass('active');
        const index = $('.tab-container').index($tabContainer);
        const url = tabs[index].url;
        loadUrl(url);
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
        }
    }

    // Function to load URL in iframe
    function loadUrl(url) {
        $('#content-iframe').attr('src', url);
        // Handle URL loading errors
        $('#content-iframe').on('error', function() {
            alert('Failed to load URL: ' + url);
        });
    }
    loadUrl('https://city-weather-webapplication.netlify.app');

    // Attach click event listener to tabs
    $(document).on('click', '.tab-container', function() {
        switchTab($(this));
    });

    // Initial rendering
    renderTabs();
});





// https://www.accuweather.com/en/in/hyderabad/202190/weather-forecast/202190