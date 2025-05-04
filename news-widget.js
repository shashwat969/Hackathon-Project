// news-widget.js
export async function initNewsWidget(containerId) {
    const NEWS_API_KEY = 'a8bccd912c7f4cca81254588ad081783';
    const DISASTER_KEYWORDS = 'disaster OR earthquake OR flood OR wildfire OR hurricane OR cyclone OR tsunami';
    const newsCache = {};

    async function fetchDisasterNewsUpdates() {
        // Same fetch logic as in newsupdate.html
        // ...
    }

    // All other news-related functions from newsupdate.html

    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
        const container = document.getElementById(containerId);
        if (container) {
            setupEventListeners();
            fetchDisasterNewsUpdates();
        }
    });
}
