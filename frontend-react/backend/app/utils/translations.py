# Translation utilities for multi-language support
from typing import Dict, Optional
import re

# Supported languages
SUPPORTED_LANGUAGES = ['en', 'hi', 'ta', 'bn', 'mr']  # English, Hindi, Tamil, Bengali, Marathi

# Common phrase translations
TRANSLATIONS: Dict[str, Dict[str, str]] = {
    # System messages
    'allocation_success': {
        'en': 'Resources allocated successfully',
        'hi': 'संसाधन सफलतापूर्वक आवंटित किए गए',
        'ta': 'வளங்கள் வெற்றிகரமாக ஒதுக்கப்பட்டன',
        'bn': 'সম্পদ সফলভাবে বরাদ্দ করা হয়েছে',
        'mr': 'संसाधने यशस्वीरित्या वाटप केली'
    },
    'dispatch_success': {
        'en': 'Resources dispatched successfully',
        'hi': 'संसाधन सफलतापूर्वक भेजे गए',
        'ta': 'வளங்கள் வெற்றிகரமாக அனுப்பப்பட்டன',
        'bn': 'সম্পদ সফলভাবে প্রেরণ করা হয়েছে',
        'mr': 'संसाधने यशस्वीरित्या पाठवली'
    },
    'critical_alert': {
        'en': 'Critical disaster detected',
        'hi': 'गंभीर आपदा का पता चला',
        'ta': 'முக்கியமான பேரிடர் கண்டறியப்பட்டது',
        'bn': 'গুরুতর দুর্যোগ সনাক্ত করা হয়েছে',
        'mr': 'गंभीर आपत्ती आढळली'
    },
    'resources_available': {
        'en': 'resources available',
        'hi': 'संसाधन उपलब्ध',
        'ta': 'வளங்கள் கிடைக்கின்றன',
        'bn': 'সম্পদ উপলব্ধ',
        'mr': 'संसाधने उपलब्ध'
    },
    'zones_active': {
        'en': 'active zones',
        'hi': 'सक्रिय क्षेत्र',
        'ta': 'செயலில் உள்ள மண்டலங்கள்',
        'bn': 'সক্রিয় অঞ্চল',
        'mr': 'सक्रिय क्षेत्र'
    },
    # Quick commands
    'cmd_allocate_critical': {
        'en': 'Allocate to critical zones',
        'hi': 'गंभीर क्षेत्रों को आवंटित करें',
        'ta': 'முக்கியமான மண்டலங்களுக்கு ஒதுக்கவும்',
        'bn': 'গুরুত্বপূর্ণ অঞ্চলে বরাদ্দ করুন',
        'mr': 'गंभीर क्षेत्रांना वाटप करा'
    },
    'cmd_status': {
        'en': 'Show system status',
        'hi': 'सिस्टम स्थिति दिखाएं',
        'ta': 'அமைப்பு நிலையைக் காட்டு',
        'bn': 'সিস্টেম স্থিতি দেখান',
        'mr': 'सिस्टम स्थिती दाखवा'
    },
    'cmd_help': {
        'en': 'Show available commands',
        'hi': 'उपलब्ध कमांड दिखाएं',
        'ta': 'கிடைக்கும் கட்டளைகளைக் காட்டு',
        'bn': 'উপলব্ধ কমান্ড দেখান',
        'mr': 'उपलब्ध कमांड दाखवा'
    },
    # Fallback Chat Responses
    'fallback_evacuate': {
        'en': "If you are in a red zone, evacuate immediately to the nearest shelter. Check the dashboard for shelter locations.",
        'hi': "यदि आप रेड ज़ोन में हैं, तो तुरंत नजदीकी आश्रय स्थल पर खाली करें। आश्रय स्थलों के लिए डैशबोर्ड देखें।",
        'mr': "जर तुम्ही रेड झोनमध्ये असाल, तर तात्काळ जवळच्या निवारा केंद्रात जा. निवारा केंद्रांसाठी डॅशबोर्ड तपासा."
    },
    'fallback_flood': {
        'en': "For floods: Move to higher ground. Disconnect electrical appliances. Do not walk through moving water. Call 112 for emergency.",
        'hi': "बाढ़ के लिए: ऊंचे स्थान पर जाएं। बिजली के उपकरण बंद करें। बहते पानी में न चलें। आपातकाल के लिए 112 डायल करें।",
        'mr': "पुरासाठी: उंच ठिकाणी जा. विद्युत उपकरणे बंद करा. वाहत्या पाण्यातून चालू नका. आपत्कालीन परिस्थितीसाठी 112 वर कॉल करा."
    },
    'fallback_earthquake': {
        'en': "Drop, Cover, and Hold On. Stay away from windows and exterior walls. After shaking stops, evacuate if building is damaged.",
        'hi': "झुकें, ढकें और पकड़ें। खिड़कियों और बाहरी दीवारों से दूर रहें। कंपन रुकने के बाद, यदि इमारत क्षतिग्रस्त है तो बाहर निकलें।",
        'mr': "खाली वाका, कव्हर घ्या आणि धरून ठेवा. खिडक्या आणि बाहेरील भिंतींपासून दूर राहा. हादरणे थांबल्यावर, इमारत खराब झाली असल्यास बाहेर पडा."
    },
    'fallback_cyclone': {
        'en': "Stay indoors away from windows. Stock emergency supplies. Listen to local authorities. Evacuate if ordered.",
        'hi': "खिड़कियों से दूर घर के अंदर रहें। आपातकालीन सामान इकट्ठा करें। स्थानीय अधिकारियों की बात सुनें। आदेश मिलने पर खाली करें।",
        'mr': "खिडक्यांपासून दूर घरातच राहा. आपत्कालीन साठा ठेवा. स्थानिक अधिकाऱ्यांचे ऐका. आदेश असल्यास जागा खाली करा."
    },
    'fallback_help': {
        'en': "Emergency services have been notified for high-risk areas. Please call 112 (National Emergency) or contact NDRF at 011-26105763 if you are in immediate danger.",
        'hi': "उच्च जोखिम वाले क्षेत्रों के लिए आपातकालीन सेवाओं को सूचित कर दिया गया है। यदि आप तत्काल खतरे में हैं तो कृपया 112 (राष्ट्रीय आपातकाल) पर कॉल करें या 011-26105763 पर NDRF से संपर्क करें।",
        'mr': "उच्च जोखीम असलेल्या क्षेत्रांसाठी आपत्कालीन सेवांना सूचित केले आहे. जर तुम्ही तत्काळ धोक्यात असाल तर कृपया 112 (राष्ट्रीय आणीबाणी) वर कॉल करा किंवा 011-26105763 वर NDRF शी संपर्क साधा."
    },
    'fallback_greeting': {
        'en': "Hello! I am AetherX, your AI disaster management assistant. Ask me about floods, earthquakes, cyclones, or emergency procedures.",
        'hi': "नमस्ते! मैं AetherX हूँ, आपका AI आपदा प्रबंधन सहायक। मुझसे बाढ़, भूकंप, चक्रवात या आपातकालीन प्रक्रियाओं के बारे में पूछें।",
        'mr': "नमस्कार! मी AetherX आहे, तुमचा AI आपत्ती व्यवस्थापन सहाय्यक. मला पूर, भूकंप, चक्रीवादळ किंवा आपत्कालीन प्रक्रियेबद्दल विचारा."
    },
    'fallback_default': {
        'en': "I'm here to help with disaster management queries. Ask me about safety procedures, evacuation routes, or emergency contacts.",
        'hi': "मैं आपदा प्रबंधन प्रश्नों में मदद करने के लिए यहाँ हूँ। मुझसे सुरक्षा प्रक्रियाओं, निकासी मार्गों या आपातकालीन संपर्कों के बारे में पूछें।",
        'mr': "मी आपत्ती व्यवस्थापन प्रश्नांसाठी मदत करण्यासाठी येथे आहे. मला सुरक्षा प्रक्रिया, निर्वासन मार्ग किंवा आपत्कालीन संपर्कांबद्दल विचारा."
    },
    # Disaster types
    'flood': {
        'en': 'Flood',
        'hi': 'बाढ़',
        'ta': 'வெள்ளம்',
        'bn': 'বন্যা',
        'mr': 'पूर'
    },
    'earthquake': {
        'en': 'Earthquake',
        'hi': 'भूकंप',
        'ta': 'நிலநடுக்கம்',
        'bn': 'ভূমিকম্প',
        'mr': 'भूकंप'
    },
    'wildfire': {
        'en': 'Wildfire',
        'hi': 'जंगल की आग',
        'ta': 'காட்டுத் தீ',
        'bn': 'দাবানল',
        'mr': 'वणवा'
    },
    'cyclone': {
        'en': 'Cyclone',
        'hi': 'चक्रवात',
        'ta': 'சூறாவளி',
        'bn': 'ঘূর্ণিঝড়',
        'mr': 'चक्रीवादळ'
    },
    # Resource types
    'ambulance': {
        'en': 'Ambulance',
        'hi': 'एम्बुलेंस',
        'ta': 'ஆம்புலன்ஸ்',
        'bn': 'অ্যাম্বুলেন্স',
        'mr': 'रुग्णवाहिका'
    },
    'helicopter': {
        'en': 'Helicopter',
        'hi': 'हेलीकॉप्टर',
        'ta': 'ஹெலிகாப்டர்',
        'bn': 'হেলিকপ্টার',
        'mr': 'हेलिकॉप्टर'
    },
    'fire_truck': {
        'en': 'Fire Truck',
        'hi': 'अग्निशमन वाहन',
        'ta': 'தீயணைப்பு வாகனம்',
        'bn': 'ফায়ার ট্রাক',
        'mr': 'अग्निशमन दल'
    },
    'police': {
        'en': 'Police',
        'hi': 'पुलिस',
        'ta': 'காவல்துறை',
        'bn': 'পুলিশ',
        'mr': 'पोलीस'
    },
    'ndrf_team': {
        'en': 'NDRF Team',
        'hi': 'एनडीआरएफ टीम',
        'ta': 'NDRF குழு',
        'bn': 'NDRF দল',
        'mr': 'NDRF पथक'
    }
}

def detect_language(text: str) -> str:
    """
    Detect language from text using character ranges
    Returns language code: 'en', 'hi', 'ta', 'bn', 'mr'
    """
    if not text:
        return 'en'
    
    # Hindi/Marathi (Devanagari): U+0900 to U+097F
    # Note: Simple detection can't easily distinguish Hi/Mr without more context/dictionaries,
    # but strictly checking specific chars might help. For now, defaulting Devanagari to Hindi
    # unless user explicitly sets it, but the input might come from user.
    # Logic: if 'language' param is passed, we use that. This is just auto-detect.
    if re.search(r'[\u0900-\u097F]', text):
        return 'hi' # Default de-facto for Devanagari in this simple regex
    
    # Tamil: U+0B80 to U+0BFF
    if re.search(r'[\u0B80-\u0BFF]', text):
        return 'ta'
    
    # Bengali: U+0980 to U+09FF
    if re.search(r'[\u0980-\u09FF]', text):
        return 'bn'
    
    # Default to English
    return 'en'

def translate(key: str, target_lang: str = 'en') -> str:
    """
    Translate a key to target language
    Falls back to English if translation not found
    """
    if target_lang not in SUPPORTED_LANGUAGES:
        target_lang = 'en'
    
    if key not in TRANSLATIONS:
        return key
    
    return TRANSLATIONS[key].get(target_lang, TRANSLATIONS[key].get('en', key))

def translate_text(text: str, target_lang: str = 'en') -> str:
    """
    Translate text by looking for known phrases
    For complex translations, this should use an AI model
    """
    # Normalize key
    key = text.lower().replace(' ', '_')
    
    # Try direct translation
    if key in TRANSLATIONS:
        return translate(key, target_lang)
    
    # Return original if no translation found
    return text

def get_language_name(lang_code: str) -> str:
    """Get full language name from code"""
    names = {
        'en': 'English',
        'hi': 'हिन्दी (Hindi)',
        'ta': 'தமிழ் (Tamil)',
        'bn': 'বাংলা (Bengali)',
        'mr': 'मराठी (Marathi)'
    }
    return names.get(lang_code, 'English')

def get_contextual_prompt(lang_code: str) -> str:
    """
    Get system prompt for AI in target language
    """
    prompts = {
        'en': "You are a disaster management AI assistant. Provide concise, actionable advice for emergency operations. Use formatting like bullet points for clarity.",
        'hi': "आप एक आपदा प्रबंधन AI सहायक हैं। आपातकालीन संचालन के लिए संक्षिप्त, कार्रवाई योग्य सलाह प्रदान करें। स्पष्टता के लिए बुलेट पॉइंट जैसे स्वरूपण का उपयोग करें।",
        'ta': "நீங்கள் ஒரு பேரிடர் மேலாண்மை AI உதவியாளர். அவசர நடவடிக்கைகளுக்கு சுருக்கமான, செயல்படக்கூடிய ஆலோசனை வழங்கவும்.",
        'bn': "আপনি একটি দুর্যোগ ব্যবস্থাপনা AI সহায়ক। জরুরি অপারেশনের জন্য সংক্ষিপ্ত, কার্যকর পরামর্শ প্রদান করুন।",
        'mr': "तुम्ही आपत्ती व्यवस्थापन AI सहाय्यक आहात. आपत्कालीन कार्यांसाठी संक्षिप्त, कृती करण्यायोग्य सल्ला द्या. स्पष्टतेसाठी बुलेट पॉइंट्स वापरा."
    }
    return prompts.get(lang_code, prompts['en'])
