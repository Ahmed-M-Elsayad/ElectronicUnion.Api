'use strict';

/**
 * Application entry point.
 * Handles: theme toggle, language toggle, i18n, team table rendering,
 * scroll reveal animations, and AI chat.
 */
(function app() {
    const STORAGE = Object.freeze({ theme: 'appTheme', lang: 'appLang' });
    const DEFAULT_LANG = 'ar';
    const DEFAULT_THEME = 'dark';

    const html = document.documentElement;
    const langBtn = document.getElementById('langBtn');
    const themeBtn = document.getElementById('themeBtn');
    const teamBody = document.getElementById('teamBody');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const sendBtn = document.getElementById('sendBtn');

    /** @type {{lang: string, theme: string}} */
    const state = {
        lang: safeGet(STORAGE.lang) || DEFAULT_LANG,
        theme: safeGet(STORAGE.theme) || DEFAULT_THEME
    };

    // ---------- Storage helpers ----------
    function safeGet(key) {
        try { return localStorage.getItem(key); } catch { return null; }
    }
    function safeSet(key, value) {
        try { localStorage.setItem(key, value); } catch { /* ignore */ }
    }

    // ---------- i18n ----------
    function applyTranslations() {
        const dict = TRANSLATIONS[state.lang];
        if (!dict) return;

        document.querySelectorAll('[data-i18n]').forEach((el) => {
            const key = el.dataset.i18n;
            const value = dict[key];
            if (typeof value === 'string') {
                el.textContent = value;
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
            const key = el.dataset.i18nPlaceholder;
            const value = dict[key];
            if (typeof value === 'string') {
                el.placeholder = value;
            }
        });

        document.title = dict.pageTitle || document.title;
        document.documentElement.lang = state.lang;
        document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
    }

    // ---------- Theme ----------
    function applyTheme() {
        const isDark = state.theme === 'dark';
        html.classList.toggle('dark-mode', isDark);
        html.classList.toggle('light-mode', !isDark);
    }

    function toggleTheme() {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        safeSet(STORAGE.theme, state.theme);
        applyTheme();
    }

    function toggleLang() {
        state.lang = state.lang === 'ar' ? 'en' : 'ar';
        safeSet(STORAGE.lang, state.lang);
        applyTranslations();
        renderTeam();
        applyTranslations();
    }

    // ---------- Team table ----------
    function renderTeam() {
        if (!teamBody) return;

        const isAr = state.lang === 'ar';
        const dict = TRANSLATIONS[state.lang];
        const fragment = document.createDocumentFragment();

        TEAM_DATA.forEach((member, index) => {
            const tr = document.createElement('tr');
            if (index === 0) tr.classList.add('leader');

            const nameTd = document.createElement('td');
            nameTd.textContent = isAr ? member.ar : member.en;

            const idTd = document.createElement('td');
            idTd.textContent = member.id;

            const roleTd = document.createElement('td');
            roleTd.textContent = isAr ? member.roleAr : member.roleEn;

            tr.append(nameTd, idTd, roleTd);
            fragment.appendChild(tr);
        });

        teamBody.replaceChildren(fragment);

        const caption = document.querySelector('table caption');
        if (caption && dict) caption.textContent = dict.teamCaption || '';
    }

    // ---------- Scroll reveal ----------
    function initReveal() {
        const items = document.querySelectorAll('.reveal');
        if (!items.length) return;

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced || !('IntersectionObserver' in window)) {
            items.forEach((el) => el.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
        );

        items.forEach((el) => observer.observe(el));
    }

    // ---------- AI Chat ----------
    function appendMessage(text, role) {
        const div = document.createElement('div');
        div.className = `chat-msg chat-msg-${role}`;
        div.textContent = text;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return div;
    }

    async function askAI(message) {
        const dict = TRANSLATIONS[state.lang];
        const loadingMsg = appendMessage(
            state.lang === 'ar' ? '...جاري التفكير' : 'Thinking...',
            'bot'
        );

        try {
            const response = await fetch(`${API_BASE_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            loadingMsg.textContent = data.reply || (state.lang === 'ar' ? 'لا يوجد رد.' : 'No response.');
        } catch (err) {
            console.error('AI Error:', err);
            loadingMsg.textContent = state.lang === 'ar'
                ? 'عذراً، حدث خطأ في الاتصال بالمساعد الذكي.'
                : 'Sorry, could not reach the AI assistant.';
        }
    }

    function initChat() {
        if (!chatForm) return;

        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const message = chatInput.value.trim();
            if (!message) return;

            appendMessage(message, 'user');
            chatInput.value = '';
            chatInput.disabled = true;
            if (sendBtn) sendBtn.disabled = true;

            await askAI(message);

            chatInput.disabled = false;
            if (sendBtn) sendBtn.disabled = false;
            chatInput.focus();
        });
    }

    // ---------- Event binding ----------
    function bindEvents() {
        if (langBtn) langBtn.addEventListener('click', toggleLang);
        if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
    }

    // ---------- Init ----------
    function init() {
        applyTheme();
        applyTranslations();
        renderTeam();
        applyTranslations();
        bindEvents();
        initReveal();
        initChat();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();