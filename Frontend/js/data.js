'use strict';

/**
 * Team members data.
 * @typedef {{ar: string, en: string, id: string, roleAr: string, roleEn: string}} TeamMember
 * @type {ReadonlyArray<TeamMember>}
 */
const TEAM_DATA = Object.freeze([
    { ar: 'أحمد محمد أحمد صابر عبد الحميد محمد', en: 'Ahmed Mohamed Ahmed Saber Abd Elhamid Mohamed', id: '2025034', roleAr: 'قائد الفريق', roleEn: 'Team Leader' },
    { ar: 'إبراهيم محمد عبد الله راغب', en: 'Ibrahim Mohammed Abdullah', id: '2025008', roleAr: 'عضو', roleEn: 'Member' },
    { ar: 'أحمد سامح منصور عبد العاطي', en: 'Ahmed Sameh Mansour Abd Elati', id: '2026144', roleAr: 'عضو', roleEn: 'Member' },
    { ar: 'أحمد محمد أحمد خضر', en: 'Ahmed Mohamed Ahmed Khadr', id: '2026142', roleAr: 'عضو', roleEn: 'Member' },
    { ar: 'إسراء فاروق جلال', en: 'Esraa Farouk Galal', id: '2026135', roleAr: 'عضو', roleEn: 'Member' },
    { ar: 'سعيدة رمضان أمين غنيم', en: 'Saida Ramadan Ameen', id: '2025155', roleAr: 'عضو', roleEn: 'Member' },
    { ar: 'كنزي راضي حامد', en: 'Kenzy Rady Hamed', id: '2025005', roleAr: 'عضو', roleEn: 'Member' },
    { ar: 'محمد ممدوح نبيل', en: 'Mohamed Mamdouh Nabil', id: '2026146', roleAr: 'عضو', roleEn: 'Member' },
    { ar: 'محمود كامل محمد حسب الله موسى', en: 'Mahmoud Kamel Mohamed', id: '2026152', roleAr: 'عضو', roleEn: 'Member' }
]);

/**
 * i18n dictionary.
 * Keys are used in HTML via data-i18n attribute.
 */
const TRANSLATIONS = Object.freeze({
    ar: {
        pageTitle: 'فريق الاتحاد الإلكتروني | Electronic Union Team',
        mainTitle: 'فريق الاتحاد الإلكتروني',
        subTitle: 'المعهد العالي للهندسة والتكنولوجيا بكفر الشيخ',
        langBtnLabel: 'English',
        themeBtnLabel: 'الوضع النهاري',
        supervisorHead: 'تحت إشراف:',
        supervisorName: 'د. إبراهيم جمال الدين إبراهيم زويل',
        manualLabel: 'فتح كتيب المشروع (Project Manual PDF)',
        teamHead: 'فريق العمل',
        teamCaption: 'أعضاء فريق العمل',
        thName: 'اسم الطالب',
        thID: 'الكود',
        thRole: 'الدور',
        powerSupplyTitle: 'وحدة التغذية (Power Supply)',
        powerSupplyDesc: 'تحويل طاقة الـ AC وتوفير خطوط تغذية متعددة ومستقرة، تشمل جهوداً ثابتة وجهوداً متغيرة ومحمية لدعم الدوائر الإلكترونية للمحطة.',
        signalGenTitle: 'مولد الإشارات (Signal Gen)',
        signalGenDesc: 'توليد الإشارات واختبار الترددات القائم على رقاقة XR2206 لإنتاج موجات جيبية، مثلثية، ومربعة بدقة عالية وثبات عند تردد 1kHz.',
        amplifierTitle: 'مكبر الإشارة (Amplifier)',
        amplifierDesc: 'مكبر جهد تناظري متغير (Variable Gain) مصمم بترانزيستور 2N2222 لإدخال الإشارات الضعيفة وتقويتها مع تصفية كاملة للـ DC Noise.',
        oscilloscopeTitle: 'راسم الإشارات (Oscilloscope)',
        oscilloscopeDesc: 'نظام قياس رقمي مبني على معالج مصغر لقراءة الموجات عبر بن الـ ADC وتصييرها رسومياً بشكل فوري لتسهيل مراقبة ورصد الإشارة التناظرية.',
        aiTitle: 'الذكاء الاصطناعي (AI Component)',
        aiDesc: 'مساعد تفاعلي ذكي يستقبل الأوامر الصوتية السحابية عبر الإنترنت للإجابة على الأسئلة الهندسية وشرح الدوائر والمكونات للمستخدم.',
        aiChatHead: 'المساعد الذكي',
        chatPlaceholder: 'اسأل عن أي حاجة في الإلكترونيات...'
    },
    en: {
        pageTitle: 'Electronic Union Team',
        mainTitle: 'Electronic Union Team',
        subTitle: 'KFS Higher Institute of Engineering & Technology',
        langBtnLabel: 'عربي',
        themeBtnLabel: 'Light Mode',
        supervisorHead: 'Under Supervision of:',
        supervisorName: 'Dr. Ibrahim Gamal El-Din Ibrahim Zewail',
        manualLabel: 'Open Project Manual (PDF)',
        teamHead: 'Project Team',
        teamCaption: 'Project team members',
        thName: 'Student Name',
        thID: 'ID Code',
        thRole: 'Role',
        powerSupplyTitle: 'Power Supply Unit',
        powerSupplyDesc: 'Converts AC power and provides multiple stable power rails, including fixed, variable, and protected outputs to support the station electronics.',
        signalGenTitle: 'Function Generator',
        signalGenDesc: 'Signal generation and frequency testing based on the XR2206 IC, producing high-precision and stable sine, triangle, and square waves at 1kHz.',
        amplifierTitle: 'Signal Amplifier',
        amplifierDesc: 'An analog variable-gain voltage amplifier designed using a 2N2222 transistor to capture and boost weak signals with full DC noise filtering.',
        oscilloscopeTitle: 'Oscilloscope Module',
        oscilloscopeDesc: 'A digital measurement system based on a microcontroller to read waveforms via ADC and render them graphically in real-time for monitoring.',
        aiTitle: 'Artificial Intelligence',
        aiDesc: 'A smart interactive assistant that receives cloud-based voice commands over the internet to answer engineering queries and explain circuits.',
        aiChatHead: 'AI Assistant',
        chatPlaceholder: 'Ask anything about electronics...'
    }
});

/**
 * Backend API base URL.
 * CHANGE THIS after deploying the backend to Azure / MonsterASP / etc.
 */
const API_BASE_URL = 'https://your-api-domain.com';