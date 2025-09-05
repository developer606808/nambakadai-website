'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Translation messages
const messages = {
  en: {
    home: {
      title: 'Welcome to Nambakadai',
      subtitle: 'Farm to Table Marketplace',
      description: 'Connect directly with local farmers and vendors',
      featuredProducts: 'Featured Products',
      featuredProductsDesc: 'Discover the best products from our trusted sellers',
      equipmentRental: 'Equipment Rental',
      equipmentRentalDesc: 'Rent farming equipment and machinery for your needs',
      joinCommunity: 'Join Our Community',
      joinCommunityDesc: 'Start selling your products and reach more customers',
      createStore: 'Create Store',
      browseProducts: 'Browse Products',
      becomeSeller: 'Become a Seller',
      browseCategories: 'Browse Categories',
      trustedSellers: 'Verified Farmers & Sellers',
      trustedSellersDesc: 'Shop from verified local farmers and trusted sellers with quality assurance and excellent service',
      readyToJoin: 'Ready to Join?',
      joinToday: 'Join thousands of farmers and customers today',
      getStarted: 'Get Started',
      exploreStores: 'Explore Stores'
    },
    nav: {
      home: 'Home',
      products: 'Products',
      stores: 'Stores',
      about: 'About',
      contact: 'Contact',
      rentals: 'Rentals'
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      price: 'Price',
      category: 'Category',
      location: 'Location',
      allCategories: 'All Categories',
      viewDetails: 'View Details',
      share: 'Share',
      copyLink: 'Copy Link',
      close: 'Close',
      available: 'Available',
      featured: 'Featured',
      reviews: 'reviews',
      perDay: 'per day',
      perHour: 'per hour'
    },
    rentals: {
      title: 'Rent Farming Equipment',
      subtitle: 'Without Breaking the Bank',
      description: 'Access high-quality farming equipment without the high costs of ownership. Daily, weekly, and monthly rental options available with flexible terms.',
      browseByCategory: 'Browse by Category',
      availableEquipment: 'Available Equipment',
      searchPlaceholder: 'Search equipment by name, category, or location...',
      listYourEquipment: 'List Your Equipment',
      browseEquipment: 'Browse Equipment',
      equipmentFound: 'equipment found',
      loadMore: 'Load More Equipment',
      noEquipmentFound: 'No Equipment Found',
      adjustFilters: 'Try adjusting your search criteria or filters to find more equipment.',
      clearFilters: 'Clear Filters',
      haveEquipmentToRent: 'Have Equipment to Rent Out?',
      rentOutDescription: 'Turn your idle equipment into income. List your farming equipment, tools, or machinery on our platform and start earning today.',
      howRentingWorks: 'How Renting Works',
      bookOnline: 'Book Online',
      bookOnlineDesc: 'Browse available equipment, select your dates, and book directly through our platform.',
      confirmAndPay: 'Confirm & Pay',
      confirmAndPayDesc: 'Receive confirmation from the owner, make secure payment, and arrange pickup or delivery.',
      useAndReturn: 'Use & Return',
      useAndReturnDesc: 'Use the equipment for your agreed rental period and return it in the same condition.',
      equipmentAvailable: 'Equipment Available',
      happyFarmers: 'Happy Farmers',
      averageRating: 'Average Rating',
      support: 'Support',
      shareEquipment: 'Share Equipment',
      scanQRCode: 'Scan QR code to view equipment',
      linkCopied: 'Link copied to clipboard!'
    },
    categories: {
      tractor: 'Tractor',
      harvester: 'Harvester',
      tools: 'Tools',
      irrigation: 'Irrigation',
      storage: 'Storage',
      transport: 'Transport',
      processing: 'Processing'
    }
  },
  ta: {
    home: {
      title: 'நம்பக்கடைக்கு வரவேற்கிறோம்',
      subtitle: 'விவசாயம் முதல் மேசை வரை சந்தை',
      description: 'உள்ளூர்விவசாயிகள் மற்றும் விற்பனையாளர்களுடன் நேரடியாக இணையுங்கள்',
      featuredProducts: 'சிறப்பு தயாரிப்புகள்',
      featuredProductsDesc: 'எங்கள் நம்பகமான விற்பனையாளர்களிடமிருந்து சிறந்த தயாரிப்புகளைக் கண்டறியுங்கள்',
      equipmentRental: 'உபகரணங்கள் வாடகை',
      equipmentRentalDesc: 'உங்கள் தேவைகளுக்கு விவசாய உபகரணங்கள் மற்றும் இயந்திரங்களை வாடகைக்கு எடுங்கள்',
      joinCommunity: 'எங்கள் சமூகத்தில் இணையுங்கள்',
      joinCommunityDesc: 'உங்கள் தயாரிப்புகளை விற்கத் தொடங்கி மேலும் வாடிக்கையாளர்களை அடையுங்கள்',
      createStore: 'கடை உருவாக்கு',
      browseProducts: 'தயாரிப்புகளை உலாவு',
      becomeSeller: 'விற்பனையாளராக ஆகுங்கள்',
      browseCategories: 'வகைகளை உலாவு',
      trustedSellers: 'சரிபார்க்கப்பட்ட விவசாயிகள் மற்றும் விற்பனையாளர்கள்',
      trustedSellersDesc: 'தர உத்தரவாதம் மற்றும் சிறந்த சேவையுடன் சரிபார்க்கப்பட்ட உள்ளூர்விவசாயிகள் மற்றும் நம்பகமான விற்பனையாளர்களிடமிருந்து ஷாப்பிங் செய்யுங்கள்',
      readyToJoin: 'இணைய தயாரா?',
      joinToday: 'ஆயிரக்கணக்கான விவசாயிகள் மற்றும் வாடிக்கையாளர்களுடன் இன்றே இணையுங்கள்',
      getStarted: 'தொடங்கு',
      exploreStores: 'கடைகளை ஆராயுங்கள்'
    },
    nav: {
      home: 'முகப்பு',
      products: 'தயாரிப்புகள்',
      stores: 'கடைகள்',
      about: 'எங்களைப் பற்றி',
      contact: 'தொடர்பு',
      rentals: 'வாடகை'
    },
    common: {
      loading: 'ஏற்றுகிறது...',
      error: 'பிழை',
      success: 'வெற்றி',
      search: 'தேடு',
      filter: 'வடிகட்டு',
      sort: 'வரிசைப்படுத்து',
      price: 'விலை',
      category: 'வகை',
      location: 'இடம்',
      allCategories: 'அனைத்து வகைகளும்',
      viewDetails: 'விவரங்களைப் பார்',
      share: 'பகிர்',
      copyLink: 'இணைப்பை நகலெடு',
      close: 'மூடு',
      available: 'கிடைக்கிறது',
      featured: 'சிறப்பு',
      reviews: 'மதிப்புரைகள்',
      perDay: 'நாள் ஒன்றுக்கு',
      perHour: 'மணி ஒன்றுக்கு'
    },
    rentals: {
      title: 'விவசாய உபகரணங்களை வாடகைக்கு எடுங்கள்',
      subtitle: 'பணத்தை உடைக்காமல்',
      description: 'உயர் தரமான விவசாய உபகரணங்களை உரிமையின் உயர் செலவுகள் இல்லாமல் அணுகுங்கள். தினசரி, வாராந்திர மற்றும் மாதாந்திர வாடகை விருப்பங்கள் நெகிழ்வான சலுகைகளுடன் கிடைக்கின்றன.',
      browseByCategory: 'வகை மூலம் உலாவு',
      availableEquipment: 'கிடைக்கும் உபகரணங்கள்',
      searchPlaceholder: 'பெயர், வகை அல்லது இடத்தின் மூலம் உபகரணங்களைத் தேடுங்கள்...',
      listYourEquipment: 'உங்கள் உபகரணங்களை பட்டியலிடுங்கள்',
      browseEquipment: 'உபகரணங்களை உலாவு',
      equipmentFound: 'உபகரணங்கள் கிடைத்தன',
      loadMore: 'மேலும் உபகரணங்களை ஏற்று',
      noEquipmentFound: 'உபகரணங்கள் எதுவும் கிடைக்கவில்லை',
      adjustFilters: 'மேலும் உபகரணங்களைக் கண்டறிய தேடல் அளவுகோல்கள் அல்லது வடிகட்டிகளை மாற்ற முயற்சிக்கவும்.',
      clearFilters: 'வடிகட்டிகளை அழி',
      haveEquipmentToRent: 'வாடகைக்கு கொடுக்க உபகரணங்கள் உள்ளனவா?',
      rentOutDescription: 'உங்கள் செயலற்ற உபகரணங்களை வருமானமாக மாற்றுங்கள். உங்கள் விவசாய உபகரணங்கள், கருவிகள் அல்லது இயந்திரங்களை எங்கள் தளத்தில் பட்டியலிட்டு இன்றே வருமானம் ஈட்டத் தொடங்குங்கள்.',
      howRentingWorks: 'வாடகை எவ்வாறு செயல்படுகிறது',
      bookOnline: 'ஆன்லைனில் முன்பதிவு செய்யுங்கள்',
      bookOnlineDesc: 'கிடைக்கும் உபகரணங்களை உலாவுங்கள், உங்கள் தேதிகளைத் தேர்ந்தெடுத்து, எங்கள் தளத்தின் மூலம் நேரடியாக முன்பதிவு செய்யுங்கள்.',
      confirmAndPay: 'உறுதிப்படுத்து & செலுத்து',
      confirmAndPayDesc: 'உரிமையாளரிடமிருந்து உறுதிப்படுத்தலைப் பெறுங்கள், பாதுகாப்பான கட்டணம் செய்யுங்கள், மற்றும் பிக் அப் அல்லது டெலிவரியை ஏற்பாடு செய்யுங்கள்.',
      useAndReturn: 'பயன்படுத்து & திரும்ப கொடு',
      useAndReturnDesc: 'உங்கள் ஒப்பந்த வாடகை காலத்திற்கு உபகரணத்தைப் பயன்படுத்தி அதை அதே நிலையில் திரும்ப கொடுங்கள்.',
      equipmentAvailable: 'கிடைக்கும் உபகரணங்கள்',
      happyFarmers: 'மகிழ்ச்சியான விவசாயிகள்',
      averageRating: 'சராசரி மதிப்பீடு',
      support: 'ஆதரவு',
      shareEquipment: 'உபகரணத்தைப் பகிர்',
      scanQRCode: 'உபகரணத்தைப் பார்க்க QR குறியீட்டை ஸ்கேன் செய்யுங்கள்',
      linkCopied: 'இணைப்பு கிளிப்போர்டுக்கு நகலெடுக்கப்பட்டது!'
    },
    categories: {
      tractor: 'டிராக்டர்',
      harvester: 'அறுவடை இயந்திரம்',
      tools: 'கருவிகள்',
      irrigation: 'நீர்ப்பாசனம்',
      storage: 'சேமிப்பு',
      transport: 'போக்குவரத்து',
      processing: 'செயலாக்கம்'
    }
  }
};

type Locale = 'en' | 'ta';
type Messages = typeof messages.en;

interface I18nContextType {
  locale: Locale;
  messages: Messages;
  t: (key: string) => string;
  setLocale: (locale: Locale) => void;
  isHydrated: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  // Initialize with 'en' as default, will be updated by useEffect
  const [locale, setLocaleState] = useState<Locale>('en');
  const [currentMessages, setCurrentMessages] = useState<Messages>(messages.en);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load locale from cookie on mount (client-side only)
  useEffect(() => {
    // Only access document on client side
    if (typeof window !== 'undefined') {
      try {
        const cookies = document.cookie.split('; ');
        const localeCookie = cookies.find(row => row.startsWith('APP_LOCALE='));

        if (localeCookie) {
          const savedLocale = localeCookie.split('=')[1] as Locale;
          console.log('i18n: Found saved locale in cookie:', savedLocale);

          if (savedLocale && (savedLocale === 'en' || savedLocale === 'ta')) {
            setLocaleState(savedLocale);
            setCurrentMessages(messages[savedLocale]);
          } else {
            console.log('i18n: Invalid locale in cookie, using default');
          }
        } else {
          console.log('i18n: No locale cookie found, using default');
        }
      } catch (error) {
        console.error('i18n: Error reading cookie:', error);
      }

      setIsHydrated(true);
    }
  }, []);


  const setLocale = (newLocale: Locale) => {
    console.log('i18n: Setting locale to', newLocale);
    setLocaleState(newLocale);
    setCurrentMessages(messages[newLocale]);

    // Save to cookie (client-side only)
    if (typeof window !== 'undefined') {
      document.cookie = `APP_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
      console.log('i18n: Cookie set to', document.cookie);
    }
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = currentMessages;

    for (const k of keys) {
      if (typeof value === 'string') break;
      value = value?.[k];
    }

    return typeof value === 'string' ? value : key;
  };

  return (
    <I18nContext.Provider value={{ locale, messages: currentMessages, t, setLocale, isHydrated }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

export function useTranslation() {
  const { t } = useI18n();
  return { t };
}