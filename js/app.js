/**
 * GEXZONE — Global JS
 * Theme (day/night), language (ES/AR), nav, chatbot
 */

(function () {
  'use strict';

  const STORAGE_THEME = 'gexzone_theme';
  const STORAGE_LANG = 'gexzone_lang';

  // ---- Theme ----
  function getTheme() {
    return localStorage.getItem(STORAGE_THEME) || 'night';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_THEME, theme);
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.setAttribute('aria-label', theme === 'night' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
      var icon = btn.querySelector('.theme-toggle-icon');
      if (icon) icon.textContent = theme === 'night' ? '\u263C' : '\uD83C\uDF19';
    }
  }

  function initTheme() {
    var theme = getTheme();
    setTheme(theme);
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        const current = getTheme();
        setTheme(current === 'day' ? 'night' : 'day');
      });
    }
  }

  // ---- Language (ES / AR) ----
  const i18n = {
    es: {
      nav: { formacion: 'Formación', tradingRoom: 'Trading Room', recursos: 'Recursos', volatilidad: 'Volatilidad', software: 'Software / Bots', contacto: 'Contacto' },
      footer: { terms: 'Términos y condiciones', cookies: 'Política de cookies', advisor: 'Aviso legal / Financial advisor', copyright: '© GEXZONE. Todos los derechos reservados.' },
      contact: { title: 'Contacto', intro: '¿Quieres saber si esta formación es para ti? Agenda una llamada con nuestro equipo para evaluar tu perfil y tus objetivos operativos o envíanos un mensaje directo.', bookCallTitle: 'Agendar una llamada', bookCallDesc: 'Elige el día y la hora que mejor te venga. Videollamada con un miembro del equipo para resolver dudas o evaluar tu perfil.', bookCallBtn: 'Elegir fecha y hora', bookCallHint: 'Tipo Calendly — sustituye el enlace por tu URL de Calendly, Cal.com o similar.', cta: 'Evalúa tu perfil con un experto institucional', ctaDesc: 'Una sesión con nuestro equipo para valorar tus objetivos y si la formación encaja contigo.', ctaBtn: 'Evalúa mi perfil', orMessage: 'O envíanos un mensaje', chatHint: 'Para preguntas rápidas usa el chat de la esquina; para temas extensos, agenda una llamada o escribe aquí.', name: 'Nombre', email: 'Correo electrónico', message: 'Mensaje', send: 'Enviar' },
      chatbot: { title: 'Chat GEXZONE', placeholder: 'Escribe tu mensaje...', send: 'Enviar', greeting: 'Hola. Soy el asistente de GEXZONE. Puedo responder preguntas frecuentes sobre formación y Trading Room. Para temas detallados, te recomendamos usar el formulario de contacto o agendar una llamada.' },
      testimonials: { title: 'Testimonios' },
      comingSoon: { badge: 'PRÓXIMAMENTE', title: 'Herramientas y bots en desarrollo', text: 'Estamos preparando soluciones que se integrarán con tu operativa. Muy pronto.' },
      convocatorias: { intro: '6 convocatorias anuales, con 2 meses de duración cada una y 3 sesiones semanales de 1 hora.' },
      recursos: { placeholder: 'Próximamente más recursos gratuitos: enlaces, guías y herramientas.' }
    },
    ar: {
      nav: { formacion: 'التدريب', tradingRoom: 'غرفة التداول', recursos: 'الموارد', volatilidad: 'التقلب', software: 'البرمجيات / البوتات', contacto: 'اتصل' },
      footer: { terms: 'الشروط والأحكام', cookies: 'سياسة ملفات تعريف الارتباط', advisor: 'إشعار قانوني / مستشار مالي', copyright: '© GEXZONE. جميع الحقوق محفوظة.' },
      contact: { title: 'اتصل بنا', intro: 'هل تريد معرفة ما إذا كان هذا التدريب مناسبًا لك؟ حدد موعدًا لمكالمة مع فريقنا لتقييم ملفك وأهدافك التشغيلية أو أرسل لنا رسالة مباشرة.', bookCallTitle: 'حجز مكالمة', bookCallDesc: 'اختر اليوم والوقت المناسبين. مكالمة فيديو مع أحد أعضاء الفريق للإجابة على أسئلتك أو تقييم ملفك.', bookCallBtn: 'اختيار التاريخ والوقت', bookCallHint: 'مثل Calendly — استبدل الرابط برابط Calendly أو Cal.com أو ما شابه.', cta: 'قيّم ملفك مع خبير مؤسسي', ctaDesc: 'جلسة مع فريقنا لتقييم أهدافك وما إذا كان التدريب مناسبًا لك.', ctaBtn: 'قيّم ملفي', orMessage: 'أو أرسل لنا رسالة', chatHint: 'للأسئلة السريعة استخدم الدردشة في الزاوية؛ للمواضيع الأطول، احجز مكالمة أو اكتب هنا.', name: 'الاسم', email: 'البريد الإلكتروني', message: 'الرسالة', send: 'إرسال' },
      chatbot: { title: 'دردشة GEXZONE', placeholder: 'اكتب رسالتك...', send: 'إرسال', greeting: 'مرحباً. أنا مساعد GEXZONE. يمكنني الإجابة على الأسئلة الشائعة حول التدريب وغرفة التداول. للمواضيع المفصلة نوصي باستخدام نموذج الاتصال أو تحديد مكالمة.' },
      testimonials: { title: 'الشهادات' },
      comingSoon: { badge: 'قريباً', title: 'أدوات وبوتات قيد التطوير', text: 'نحن نعد حلولاً ستتكامل مع أسلوب عملك. قريباً.' },
      convocatorias: { intro: '6 دورات سنوية، مدة كل منها شهران و3 جلسات أسبوعية ساعة واحدة.' },
      recursos: { placeholder: 'قريباً المزيد من الموارد المجانية: روابط وأدلة وأدوات.' }
    }
  };

  function getLang() {
    return localStorage.getItem(STORAGE_LANG) || 'es';
  }

  function setLang(lang) {
    localStorage.setItem(STORAGE_LANG, lang);
    document.documentElement.lang = lang === 'ar' ? 'ar' : 'es_ES';
    document.body.classList.toggle('rtl', lang === 'ar');
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    applyTranslations(lang);
  }

  function applyTranslations(lang) {
    const t = i18n[lang] || i18n.es;
    function get(obj, key) {
      const parts = key.split('.');
      let v = obj;
      for (let i = 0; i < parts.length; i++) v = v && v[parts[i]];
      return v;
    }
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const v = get(t, el.getAttribute('data-i18n'));
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      const v = get(t, el.getAttribute('data-i18n-placeholder'));
      if (v != null) el.placeholder = v;
    });
  }

  function initLang() {
    setLang(getLang());
    const btn = document.getElementById('lang-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        setLang(getLang() === 'es' ? 'ar' : 'es');
      });
    }
  }

  // ---- Mobile nav ----
  function initNav() {
    const toggle = document.getElementById('nav-toggle');
    const nav = document.getElementById('nav-main');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('open');
      }
    });
  }

  // ---- Chatbot ----
  function initChatbot() {
    const toggle = document.getElementById('chatbot-toggle');
    const panel = document.getElementById('chatbot-panel');
    const input = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('chatbot-send');
    const messages = document.getElementById('chatbot-messages');
    const lang = getLang();
    const t = i18n[lang] || i18n.es;

    if (!panel || !messages) return;

    function addMessage(text, isUser) {
      const div = document.createElement('div');
      div.className = 'chatbot-msg ' + (isUser ? 'user' : 'bot');
      div.textContent = text;
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }

    function send() {
      const value = (input && input.value) ? input.value.trim() : '';
      if (!value) return;
      addMessage(value, true);
      if (input) input.value = '';
      setTimeout(function () {
        addMessage(t.chatbot && t.chatbot.greeting ? t.chatbot.greeting : 'Gracias por tu mensaje. Un equipo te responderá pronto. Para consultas detalladas usa el formulario de contacto.', false);
      }, 600);
    }

    if (toggle) {
      toggle.addEventListener('click', function () {
        panel.classList.toggle('open');
        if (panel.classList.contains('open') && messages.children.length === 0) {
          addMessage(t.chatbot && t.chatbot.greeting ? t.chatbot.greeting : 'Hola. Soy el asistente de GEXZONE. ¿En qué puedo ayudarte?', false);
        }
      });
    }
    if (sendBtn) sendBtn.addEventListener('click', send);
    if (input) input.addEventListener('keydown', function (e) { if (e.key === 'Enter') send(); });
  }

  // ---- Active nav link ----
  function setActiveNav() {
    const path = (window.location.pathname || '').replace(/\/$/, '') || '/';
    document.querySelectorAll('.nav-main a').forEach(function (a) {
      const href = (a.getAttribute('href') || '').replace(/\/$/, '');
      const isIndex = href === '' || href === '/' || href === 'index.html';
      const isActive = (isIndex && (path === '' || path === '/' || path.endsWith('index.html'))) || (!isIndex && path.indexOf(href) !== -1);
      a.classList.toggle('active', isActive);
    });
  }

  // ---- Init ----
  function init() {
    initTheme();
    initLang();
    initNav();
    setActiveNav();
    initChatbot();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
