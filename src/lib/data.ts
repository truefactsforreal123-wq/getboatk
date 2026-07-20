export const site = {
  hotline: "17514",
  hotlineDisplay: "17514",
  landline: "0223910668",
  whatsapp: "201229222208",
  facebook: "https://web.facebook.com/getboatkeg",
  instagram: "https://www.instagram.com/getboatkeg",
  foundedYear: 1982,
};

export const whatsappLink = (message: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;

/* ── Branches (Cairo) ─────────────────────────────────────── */

export type Branch = {
  id: string;
  mapUrl: string;
};

export const branches: Branch[] = [
  {
    id: "downtown",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=27+Abdel+Khalek+Sarwat+St+Downtown+Cairo",
  },
  {
    id: "heliopolis",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=21+Ahmed+Tayseer+St+Heliopolis+Cairo",
  },
  {
    id: "nasr-city",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=10+Awal+May+St+Nasr+City+Cairo",
  },
];

/* ── Menu ─────────────────────────────────────────────────── */

export type MenuItem = {
  id: string;
  name: { ar: string; en: string };
  desc?: { ar: string; en: string };
  price?: number;
  sizes?: { label: { ar: string; en: string }; price: number }[];
  badge?: "popular" | "spicy" | "new";
};

export type MenuCategory = {
  id: string;
  name: { ar: string; en: string };
  tagline: { ar: string; en: string };
  items: MenuItem[];
};

export const menu: MenuCategory[] = [
  {
    id: "shawarma",
    name: { ar: "الشاورما", en: "Shawarma" },
    tagline: {
      ar: "التاج اللي على راسنا — على الفحم الطبيعي",
      en: "Our crown — over natural charcoal",
    },
    items: [
      {
        id: "sh-meal",
        name: { ar: "وجبة شاورما دجاج عالفحم", en: "Charcoal Chicken Shawarma Meal" },
        desc: {
          ar: "شاورما دجاج متبلة على الطريقة الدمشقية، خبز صاج، ثومية ومخلل",
          en: "Damascene-marinated chicken shawarma, saj bread, garlic sauce & pickles",
        },
        price: 165,
        badge: "popular",
      },
      {
        id: "sh-sand-ch",
        name: { ar: "ساندوتش شاورما دجاج", en: "Chicken Shawarma Sandwich" },
        desc: { ar: "خبز صاج، ثومية، مخلل", en: "Saj bread, garlic sauce, pickles" },
        price: 95,
      },
      {
        id: "sh-sand-meat",
        name: { ar: "ساندوتش شاورما لحمة", en: "Beef Shawarma Sandwich" },
        desc: { ar: "طحينة، بقدونس، بصل", en: "Tahini, parsley, onion" },
        price: 130,
      },
      {
        id: "sh-arabi",
        name: { ar: "شاورما عربي دجاج", en: "Arabic Chicken Shawarma" },
        desc: {
          ar: "طبق شاورما مجهز بخبز صاج ومقبلات",
          en: "Shawarma platter with saj bread and sides",
        },
        price: 185,
      },
      {
        id: "sh-fattah",
        name: { ar: "فتة شاورما", en: "Shawarma Fattah" },
        desc: {
          ar: "أرز، خبز محمص، شاورما وصوص الفتة",
          en: "Rice, toasted bread, shawarma and fattah sauce",
        },
        price: 175,
        badge: "new",
      },
      {
        id: "sh-rocket",
        name: { ar: "صاروخ شاورما", en: "Shawarma Rocket" },
        desc: {
          ar: "ساندوتش عملاق بشاورما إضافية وثومية مضاعفة",
          en: "Giant sandwich with extra shawarma and double garlic",
        },
        price: 140,
      },
    ],
  },
  {
    id: "grills",
    name: { ar: "المشويات", en: "Charcoal Grills" },
    tagline: {
      ar: "فحم طبيعي ونار هادية — زي ما بتتعمل في دمشق",
      en: "Natural charcoal and slow fire — the Damascus way",
    },
    items: [
      {
        id: "gr-mixed",
        name: { ar: "مشاوي مشكلة", en: "Mixed Grill" },
        desc: {
          ar: "كباب حلبي، شيش طاووق وريش ضاني",
          en: "Aleppo kebab, shish tawook and lamb chops",
        },
        price: 420,
        badge: "popular",
      },
      {
        id: "gr-faraj",
        name: { ar: "فروج مشوي عالفحم", en: "Charcoal Grilled Chicken" },
        sizes: [
          { label: { ar: "نصف", en: "Half" }, price: 175 },
          { label: { ar: "كامل", en: "Whole" }, price: 320 },
        ],
        desc: { ar: "متبل بالثوم والليمون على الطريقة الدمشقية", en: "Garlic-lemon Damascene marinade" },
      },
      {
        id: "gr-tawook",
        name: { ar: "شيش طاووق", en: "Shish Tawook" },
        desc: { ar: "مكعبات دجاج متبلة على الفحم", en: "Marinated chicken cubes over charcoal" },
        price: 240,
      },
      {
        id: "gr-kebab",
        name: { ar: "كباب حلبي", en: "Aleppo Kebab" },
        desc: { ar: "لحمة ضأن مفرومة يدوياً بالبهارات الحلبية", en: "Hand-minced lamb with Aleppo spices" },
        price: 285,
      },
      {
        id: "gr-wings",
        name: { ar: "أجنحة مشوية", en: "Grilled Wings" },
        desc: { ar: "أجنحة دجاج متبلة ومشوية على الفحم", en: "Marinated charcoal-grilled wings" },
        price: 155,
        badge: "spicy",
      },
    ],
  },
  {
    id: "meals",
    name: { ar: "الوجبات", en: "Signature Meals" },
    tagline: { ar: "وجبات تكفي جوعك… وتزيد", en: "Meals that satisfy — and then some" },
    items: [
      {
        id: "ml-family",
        name: { ar: "وجبة جيت بوئتك العائلية", en: "Get Boatkeg Family Feast" },
        desc: {
          ar: "شاورما + مشاوي + بروست + مقبلات ومشروبات — تكفي 4 أفراد",
          en: "Shawarma, grills, broast, sides & drinks — feeds 4",
        },
        price: 650,
        badge: "popular",
      },
      {
        id: "ml-rice",
        name: { ar: "أرز بالشاورما", en: "Shawarma Rice Bowl" },
        desc: { ar: "أرز بالشعيرية، شاورما دجاج وثومية", en: "Vermicelli rice, chicken shawarma, garlic sauce" },
        price: 145,
      },
      {
        id: "ml-pulled",
        name: { ar: "وجبة دجاج مسحب", en: "Pulled Chicken Meal" },
        desc: { ar: "دجاج مسحب بتتبيلة دمشقية مع أرز أو خبز", en: "Damascene pulled chicken with rice or bread" },
        price: 150,
      },
      {
        id: "ml-musakhan",
        name: { ar: "مسخن رول", en: "Musakhan Rolls" },
        desc: { ar: "دجاج وبصل مكرمل بخبز الطابون", en: "Chicken and caramelized onion in taboon bread" },
        price: 135,
        badge: "new",
      },
    ],
  },
  {
    id: "broast",
    name: { ar: "البروست", en: "Broast & Crispy" },
    tagline: { ar: "قرمشة بتتسمع من بعيد", en: "A crunch you can hear from afar" },
    items: [
      {
        id: "br-broast",
        name: { ar: "بروست دجاج", en: "Chicken Broast" },
        desc: { ar: "4 قطع دجاج طازج بتتبيلتنا السرية", en: "4 pcs fresh chicken in our secret marinade" },
        price: 185,
        badge: "popular",
      },
      {
        id: "br-crispy",
        name: { ar: "كرسبي ساندوتش", en: "Crispy Chicken Sandwich" },
        desc: { ar: "صدر دجاج مقرمش، خس، وصوص خاص", en: "Crispy chicken breast, lettuce, house sauce" },
        price: 105,
      },
      {
        id: "br-strips",
        name: { ar: "أصابع دجاج", en: "Chicken Strips" },
        desc: { ar: "أصابع دجاج مقرمشة مع صوصين", en: "Crispy chicken strips with two sauces" },
        price: 135,
      },
      {
        id: "br-family",
        name: { ar: "وجبة بروست عائلية", en: "Family Broast Meal" },
        desc: { ar: "8 قطع بروست + بطاطس + مشروبات", en: "8 pcs broast, fries & drinks" },
        price: 380,
      },
    ],
  },
  {
    id: "burgers",
    name: { ar: "البرجر", en: "Burgers" },
    tagline: { ar: "لحمة مشوية على الفحم — مش على الصاج", en: "Charcoal-grilled patties — never griddled" },
    items: [
      {
        id: "bg-beef",
        name: { ar: "برجر لحمة مشوي", en: "Grilled Beef Burger" },
        desc: { ar: "لحمة بقري مشوية على الفحم وصوصنا الخاص", en: "Charcoal beef patty with our house sauce" },
        price: 145,
      },
      {
        id: "bg-double",
        name: { ar: "تشيز برجر مزدوج", en: "Double Cheeseburger" },
        desc: { ar: "قطعتين لحمة، جبنة مضاعفة", en: "Double patty, double cheese" },
        price: 185,
        badge: "popular",
      },
      {
        id: "bg-chicken",
        name: { ar: "برجر دجاج مقرمش", en: "Crispy Chicken Burger" },
        desc: { ar: "دجاج مقرمش مع جبنة وصوص رانش", en: "Crispy chicken, cheese, ranch sauce" },
        price: 120,
      },
    ],
  },
  {
    id: "appetizers",
    name: { ar: "المقبلات", en: "Appetizers & Sides" },
    tagline: { ar: "بداية السفرة الدمشقية", en: "How every Damascene table begins" },
    items: [
      {
        id: "ap-hummus",
        name: { ar: "حمص بالطحينة", en: "Hummus" },
        desc: { ar: "حمص مهروس حريري بزيت الزيتون", en: "Silky hummus with olive oil" },
        price: 55,
      },
      {
        id: "ap-moutabal",
        name: { ar: "متبل باذنجان", en: "Moutabal" },
        desc: { ar: "باذنجان مشوي على الفحم بالطحينة", en: "Charcoal-smoked eggplant with tahini" },
        price: 55,
      },
      {
        id: "ap-tabbouleh",
        name: { ar: "تبولة", en: "Tabbouleh" },
        price: 60,
      },
      {
        id: "ap-fattoush",
        name: { ar: "فتوش", en: "Fattoush" },
        price: 60,
      },
      {
        id: "ap-fries",
        name: { ar: "بطاطس مقلية", en: "French Fries" },
        price: 45,
      },
      {
        id: "ap-pickles",
        name: { ar: "مخلل سوري", en: "Syrian Pickles" },
        price: 30,
      },
    ],
  },
  {
    id: "drinks",
    name: { ar: "المشروبات", en: "Drinks" },
    tagline: { ar: "طازة على طازة", en: "Fresh, always" },
    items: [
      {
        id: "dr-orange",
        name: { ar: "عصير برتقال طازج", en: "Fresh Orange Juice" },
        price: 45,
      },
      {
        id: "dr-lemon",
        name: { ar: "ليمون بالنعناع", en: "Lemon Mint" },
        price: 45,
      },
      {
        id: "dr-soft",
        name: { ar: "مشروبات غازية", en: "Soft Drinks" },
        price: 25,
      },
      {
        id: "dr-water",
        name: { ar: "مياه معدنية", en: "Mineral Water" },
        price: 15,
      },
    ],
  },
];
