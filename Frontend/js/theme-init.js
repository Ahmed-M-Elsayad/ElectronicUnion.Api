/**
 * Applies saved theme and language before first paint.
 * Runs synchronously in <head> to prevent FOUC.
 */
(function initThemeAndLang() {
    'use strict';
    try {
        var html = document.documentElement;
        var savedLang = localStorage.getItem('appLang') || 'ar';
        var savedTheme = localStorage.getItem('appTheme');

        html.lang = savedLang;
        html.dir = savedLang === 'ar' ? 'rtl' : 'ltr';

        if (savedTheme === 'light') {
            html.classList.add('light-mode');
            html.classList.remove('dark-mode');
        } else {
            html.classList.add('dark-mode');
            html.classList.remove('light-mode');
        }
    } catch (e) {
        // localStorage disabled — keep defaults from HTML
    }
})();