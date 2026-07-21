import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const IMG = "https://llczpwuromcwiovpkdxf.supabase.co/storage/v1/object/public/menu-images";

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const branches = [
  {
    number: "1",
    nameAr: "وسط البلد",
    nameEn: "Downtown",
    addressAr: "٢٧ ش عبد الخالق ثروت، وسط البلد، القاهرة",
    addressEn: "27 Abdel Khalek Sarwat St, Downtown, Cairo",
    phone: "01050604000",
    whatsapp: "201050604000",
    mapsUrl: "https://maps.app.goo.gl/getboatkeg-downtown",
  },
  {
    number: "2",
    nameAr: "مصر الجديدة",
    nameEn: "Heliopolis",
    addressAr: "٢١ ش أحمد تيسير، مصر الجديدة، القاهرة",
    addressEn: "21 Ahmed Tayseer St, Heliopolis, Cairo",
    phone: "0223910668",
    whatsapp: "20223910668",
    mapsUrl: "https://maps.app.goo.gl/getboatkeg-heliopolis",
  },
  {
    number: "3",
    nameAr: "مدينة نصر",
    nameEn: "Nasr City",
    addressAr: "١٠ عمارات أول مايو، مدينة نصر، القاهرة",
    addressEn: "10 Awal May Buildings, Nasr City, Cairo",
    phone: "01229222208",
    whatsapp: "201229222208",
    mapsUrl: "https://maps.app.goo.gl/getboatkeg-nasrcity",
  },
];

type SeedItem = {
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  price?: number | null;
  sizes?: { label: { ar: string; en: string }; price: number }[] | null;
  badge?: string | null;
  image: string;
};

type SeedCategory = {
  nameAr: string;
  nameEn: string;
  image: string;
  items: SeedItem[];
};

const menu: SeedCategory[] = [
  {
    nameAr: "الساندوتشات",
    nameEn: "Sandwiches",
    image: `${IMG}/sandwiches/category.jpg`,
    items: [
      {
        nameAr: "ساندوتش شاورما فرايز سورى",
        nameEn: "Syrian Fries Shawarma",
        descAr: "شاورما سورية مع فرايز",
        descEn: "Syrian shawarma with fries",
        sizes: [
          { label: { ar: "صغير", en: "S" }, price: 86 },
          { label: { ar: "كبير", en: "XL" }, price: 98 },
        ],
        badge: "popular",
        image: `${IMG}/sandwiches/syrian-shawarma.jpg`,
      },
      {
        nameAr: "ساندوتش شاورما فرايز فرنساوى",
        nameEn: "French Fries Shawarma",
        descAr: "حجم XXL",
        descEn: "XXL size",
        price: 98,
        image: `${IMG}/sandwiches/french-shawarma.jpg`,
      },
      {
        nameAr: "ساندوتش فرايز كايزر",
        nameEn: "Fries Kaiser Sandwich",
        descAr: "حجم L",
        descEn: "L size",
        price: 58,
        image: `${IMG}/sandwiches/kaiser.jpg`,
      },
      {
        nameAr: "ساندوتش فرايز عيش لبنانى",
        nameEn: "Fries Lebanese Bread Sandwich",
        descAr: "عيش لبناني طازج",
        descEn: "Fresh Lebanese bread",
        price: 62,
        image: `${IMG}/sandwiches/lebanese.jpg`,
      },
      {
        nameAr: "مارا فرايز",
        nameEn: "Mara Fries",
        descAr: "وجبة مميزة",
        descEn: "Special meal",
        price: 115,
        badge: "popular",
        image: `${IMG}/sandwiches/mara-fries.jpg`,
      },
      {
        nameAr: "مارا كرسبي",
        nameEn: "Mara Crispy",
        descAr: "مقرمش وطري",
        descEn: "Crispy and tender",
        price: 150,
        image: `${IMG}/sandwiches/mara-crispy.jpg`,
      },
      {
        nameAr: "وجبة شاورما عربي فرايز",
        nameEn: "Arabic Fries Shawarma Meal",
        descAr: "وجبة كاملة",
        descEn: "Full meal",
        price: 125,
        image: `${IMG}/sandwiches/arabic-meal.jpg`,
      },
      {
        nameAr: "وجبة شاورما عربي فرايز دبل",
        nameEn: "Arabic Fries Shawarma Double",
        descAr: "دبل ساندوتش",
        descEn: "Double sandwich",
        price: 220,
        image: `${IMG}/sandwiches/arabic-double.jpg`,
      },
    ],
  },
  {
    nameAr: "الفتات",
    nameEn: "Fatteh",
    image: `${IMG}/fatteh/category.jpg`,
    items: [
      {
        nameAr: "فتة شاورما فرايز",
        nameEn: "Fries Shawarma Fatteh",
        descAr: "فتة بالشاورما والفرايز",
        descEn: "Fatteh with shawarma and fries",
        sizes: [
          { label: { ar: "صغير", en: "Small" }, price: 70 },
          { label: { ar: "وسط", en: "Medium" }, price: 115 },
          { label: { ar: "كبير", en: "Large" }, price: 135 },
        ],
        badge: "popular",
        image: `${IMG}/fatteh/shawarma-fries.jpg`,
      },
      {
        nameAr: "فتة شاورما مكسيكى",
        nameEn: "Mexican Shawarma Fatteh",
        descAr: "فتة بنكهة مكسيكية",
        descEn: "Mexican-style fatteh",
        sizes: [
          { label: { ar: "صغير", en: "Small" }, price: 75 },
          { label: { ar: "وسط", en: "Medium" }, price: 135 },
        ],
        image: `${IMG}/fatteh/mexican.jpg`,
      },
    ],
  },
  {
    nameAr: "الفراخ",
    nameEn: "Chicken",
    image: `${IMG}/chicken/category.jpg`,
    items: [
      {
        nameAr: "نص فرخة على الفحم",
        nameEn: "Half Charcoal Chicken",
        descAr: "نصف فرخة مشوية على الفحم",
        descEn: "Half chicken grilled over charcoal",
        price: 195,
        badge: "popular",
        image: `${IMG}/chicken/half-charcoal.jpg`,
      },
      {
        nameAr: "نص فرخة على الفحم مع أرز",
        nameEn: "Half Charcoal Chicken with Rice",
        descAr: "بالاطباق + بطاطس + كول سلو + مخلل + عيش",
        descEn: "With potato, coleslaw, pickles & bread",
        price: 210,
        image: `${IMG}/chicken/half-rice.jpg`,
      },
      {
        nameAr: "وجبة ٢ ورك ملفت تركى",
        nameEn: "2 Turkey Legs Meal",
        descAr: "ورك تركي طازج",
        descEn: "Fresh turkey legs",
        price: 170,
        image: `${IMG}/chicken/turkey-legs.jpg`,
      },
      {
        nameAr: "وجبة ٢ ورك ملفت تركى كاملة",
        nameEn: "2 Turkey Legs Full Meal",
        descAr: "بالاطباق + رز + تومية + مخلل + عيش",
        descEn: "With rice, garlic sauce, pickles & bread",
        price: 220,
        image: `${IMG}/chicken/turkey-full.jpg`,
      },
      {
        nameAr: "وجبة دروس ٤ قطع",
        nameEn: "4-Piece Drumsticks Meal",
        descAr: "أربعة قطع دروس",
        descEn: "Four drumsticks",
        price: 150,
        image: `${IMG}/chicken/drous-4.jpg`,
      },
      {
        nameAr: "وجبة دروس ٨ قطع",
        nameEn: "8-Piece Drumsticks Meal",
        descAr: "بالاطباق + بطاطس + مخلل + عيش",
        descEn: "With potato, pickles & bread",
        price: 175,
        image: `${IMG}/chicken/drous-8.jpg`,
      },
      {
        nameAr: "نص فرخة شاورما",
        nameEn: "Half Shawarma Chicken",
        descAr: "نصف فرخة بطعم الشاورما",
        descEn: "Half chicken shawarma-style",
        price: 195,
        image: `${IMG}/chicken/half-shawarma.jpg`,
      },
      {
        nameAr: "ربع فرخة شاورما ورك",
        nameEn: "Quarter Shawarma Chicken Leg",
        descAr: "ربع فرخة ورك شاورما",
        descEn: "Quarter chicken leg shawarma",
        price: 125,
        image: `${IMG}/chicken/quarter-shawarma.jpg`,
      },
    ],
  },
  {
    nameAr: "الأرز والمعجنات",
    nameEn: "Rice & Pastries",
    image: `${IMG}/rice/category.jpg`,
    items: [
      {
        nameAr: "صحن ميكسا",
        nameEn: "Mixa Plate",
        descAr: "صحن ميكسا مميز",
        descEn: "Special mixa plate",
        price: 175,
        image: `${IMG}/rice/mixa-plate.jpg`,
      },
      {
        nameAr: "وجبة ميكسا عربية",
        nameEn: "Arabic Mixa Meal",
        descAr: "وجبة عربية كاملة",
        descEn: "Full Arabic meal",
        price: 190,
        image: `${IMG}/rice/mixa-arabic.jpg`,
      },
      {
        nameAr: "وجبة ميكسا عربية وميتز",
        nameEn: "Arabic Mixa & Metz Meal",
        descAr: "ميكسا مع ميتز",
        descEn: "Mixa with metz",
        price: 190,
        image: `${IMG}/rice/mixa-metz.jpg`,
      },
      {
        nameAr: "فرخة ميكسا على الفحم مع أرز",
        nameEn: "Charcoal Mixa Chicken with Rice",
        descAr: "فرخة مشوية مع أرز",
        descEn: "Grilled chicken with rice",
        price: 190,
        image: `${IMG}/rice/mixa-charcoal-rice.jpg`,
      },
      {
        nameAr: "فرخة ميكسا على الفحم مع بطاطس",
        nameEn: "Charcoal Mixa Chicken with Potato",
        descAr: "فرخة مشوية مع بطاطس",
        descEn: "Grilled chicken with potato",
        price: 175,
        image: `${IMG}/rice/mixa-charcoal-potato.jpg`,
      },
      {
        nameAr: "فرخة ميكسا على الفحم كاملة",
        nameEn: "Charcoal Mixa Chicken Full",
        descAr: "مع بطاطس ومخلل وعيش",
        descEn: "With potato, pickles & bread",
        price: 175,
        image: `${IMG}/rice/mixa-charcoal-full.jpg`,
      },
      {
        nameAr: "شاورما فرايز (صحن)",
        nameEn: "Fries Shawarma Plate",
        descAr: "صحن شاورما مع فرايز",
        descEn: "Shawarma plate with fries",
        price: 175,
        image: `${IMG}/rice/shawarma-plate.jpg`,
      },
      {
        nameAr: "شاورما فرايز (وجبة)",
        nameEn: "Fries Shawarma Meal",
        descAr: "وجبة شاورما مع فرايز",
        descEn: "Shawarma meal with fries",
        price: 175,
        image: `${IMG}/rice/shawarma-meal.jpg`,
      },
      {
        nameAr: "مكساتا",
        nameEn: "Meksata",
        descAr: "طبق مكساتا المميز",
        descEn: "Special meksata dish",
        price: 175,
        badge: "popular",
        image: `${IMG}/rice/meksata.jpg`,
      },
      {
        nameAr: "مكساتو",
        nameEn: "Meksato",
        descAr: "طبق مكساتو",
        descEn: "Meksato dish",
        price: 175,
        image: `${IMG}/rice/meksato.jpg`,
      },
      {
        nameAr: "نيو مكساتا",
        nameEn: "New Meksata",
        descAr: "النسخة الجديدة من مكساتا",
        descEn: "New version of meksata",
        price: 175,
        image: `${IMG}/rice/new-meksata.jpg`,
      },
      {
        nameAr: "افكتكسا",
        nameEn: "Afktasa",
        descAr: "طبق افكتكسا المميز",
        descEn: "Special afktasa dish",
        price: 175,
        image: `${IMG}/rice/afktasa.jpg`,
      },
      {
        nameAr: "البشير",
        nameEn: "Al Basheer",
        descAr: "طبق البشير",
        descEn: "Al Basheer dish",
        price: 135,
        image: `${IMG}/rice/al-basheer.jpg`,
      },
    ],
  },
  {
    nameAr: "التوبات",
    nameEn: "Top Platters",
    image: `${IMG}/top-platters/category.jpg`,
    items: [
      {
        nameAr: "التوب",
        nameEn: "Al Tob",
        descAr: "برياني + فرايز + بطاطس + مخلل + تومية + عيش",
        descEn: "Biryani + fries + potato + pickles + garlic sauce + bread",
        price: 135,
        badge: "popular",
        image: `${IMG}/top-platters/al-tob.jpg`,
      },
      {
        nameAr: "الشاكة",
        nameEn: "Al Shaka",
        descAr: "برياني + فرايز + بطاطس + مخلل + تومية + عيش",
        descEn: "Biryani + fries + potato + pickles + garlic sauce + bread",
        price: 135,
        image: `${IMG}/top-platters/al-shaka.jpg`,
      },
      {
        nameAr: "الملكة",
        nameEn: "The Queen",
        descAr: "٣ فراخ + بطاطس + مخلل + تومية + عيش",
        descEn: "3 chickens + potato + pickles + garlic sauce + bread",
        price: 300,
        image: `${IMG}/top-platters/al-malaka.jpg`,
      },
      {
        nameAr: "الشالحة",
        nameEn: "Al Shalha",
        descAr: "٣ فراخ + بطاطس + مخلل + تومية + عيش",
        descEn: "3 chickens + potato + pickles + garlic sauce + bread",
        price: 275,
        image: `${IMG}/top-platters/al-shalha.jpg`,
      },
      {
        nameAr: "الشالة",
        nameEn: "Al Shala",
        descAr: "٢ ساندوتش + فرايز + ٢ بطاطس + ٣ مشروبات",
        descEn: "2 sandwiches + fries + 2 potato + 3 drinks",
        price: 230,
        image: `${IMG}/top-platters/al-shala.jpg`,
      },
    ],
  },
  {
    nameAr: "السلط والمقبلات",
    nameEn: "Salads & Appetizers",
    image: `${IMG}/salads/category.jpg`,
    items: [
      {
        nameAr: "سلطة فريش",
        nameEn: "Fresh Salad",
        descAr: "سلطة طازجة",
        descEn: "Fresh salad",
        price: 30,
        image: `${IMG}/salads/fresh.jpg`,
      },
      {
        nameAr: "سلطة خضراء",
        nameEn: "Green Salad",
        descAr: "خضار طازج",
        descEn: "Fresh greens",
        price: 30,
        image: `${IMG}/salads/green.jpg`,
      },
      {
        nameAr: "سلطة بطيخ",
        nameEn: "Watermelon Salad",
        descAr: "سلطة بطيخ منعشة",
        descEn: "Refreshing watermelon salad",
        price: 35,
        image: `${IMG}/salads/watermelon.jpg`,
      },
      {
        nameAr: "فول سو",
        nameEn: "Foul So",
        descAr: "فول طازج",
        descEn: "Fresh foul",
        price: 35,
        image: `${IMG}/salads/fool-so.jpg`,
      },
      {
        nameAr: "كول سلو",
        nameEn: "Coleslaw",
        descAr: "كول سلو طازج",
        descEn: "Fresh coleslaw",
        price: 35,
        image: `${IMG}/salads/coleslaw.jpg`,
      },
      {
        nameAr: "حمص",
        nameEn: "Hummus",
        descAr: "حمص بطحينة",
        descEn: "Hummus with tahini",
        price: 20,
        image: `${IMG}/salads/hummus.jpg`,
      },
      {
        nameAr: "متبل",
        nameEn: "Mutabbal",
        descAr: "متبل باذنجان",
        descEn: "Eggplant mutabbal",
        price: 25,
        image: `${IMG}/salads/mutabbal.jpg`,
      },
      {
        nameAr: "زبادي",
        nameEn: "Yogurt",
        descAr: "زبادي طازج",
        descEn: "Fresh yogurt",
        price: 25,
        image: `${IMG}/salads/yogurt.jpg`,
      },
    ],
  },
  {
    nameAr: "الإضافات",
    nameEn: "Add-ons",
    image: `${IMG}/addons/category.jpg`,
    items: [
      {
        nameAr: "بطاطس",
        nameEn: "Fries",
        descAr: "بطاطس مقرمشة",
        descEn: "Crispy fries",
        price: 35,
        image: `${IMG}/addons/fries.jpg`,
      },
      {
        nameAr: "بطاطس موزاريلا",
        nameEn: "Mozzarella Fries",
        descAr: "بطاطس بالجبنة",
        descEn: "Cheesy fries",
        price: 100,
        image: `${IMG}/addons/fries-mozzarella.jpg`,
      },
      {
        nameAr: "بطاطس كرسبي",
        nameEn: "Crispy Fries",
        descAr: "بطاطس مقرمشة",
        descEn: "Extra crispy fries",
        price: 100,
        image: `${IMG}/addons/fries-crispy.jpg`,
      },
      {
        nameAr: "رز كرسبي",
        nameEn: "Crispy Rice",
        descAr: "رز مقرمش",
        descEn: "Crispy rice",
        price: 100,
        image: `${IMG}/addons/rice-crispy.jpg`,
      },
      {
        nameAr: "حمص",
        nameEn: "Hummus",
        descAr: "حمص بطحينة",
        descEn: "Hummus with tahini",
        price: 20,
        image: `${IMG}/addons/hummus.jpg`,
      },
      {
        nameAr: "متبل",
        nameEn: "Mutabbal",
        descAr: "متبل باذنجان",
        descEn: "Eggplant mutabbal",
        price: 25,
        image: `${IMG}/addons/mutabbal.jpg`,
      },
      {
        nameAr: "زبادي",
        nameEn: "Yogurt",
        descAr: "زبادي طازج",
        descEn: "Fresh yogurt",
        price: 25,
        image: `${IMG}/addons/yogurt.jpg`,
      },
      {
        nameAr: "مدل",
        nameEn: "Mdal",
        descAr: "مدل",
        descEn: "Mdal",
        price: 15,
        image: `${IMG}/addons/mdal.jpg`,
      },
      {
        nameAr: "راب دي قطعى",
        nameEn: "Rap Chicken Pieces",
        descAr: "قطع دجاج",
        descEn: "Chicken pieces",
        price: 60,
        image: `${IMG}/addons/rap-chicken.jpg`,
      },
      {
        nameAr: "طفط سمانى",
        nameEn: "Taft Samani",
        descAr: "طفط سمانى",
        descEn: "Taft samani",
        price: 45,
        image: `${IMG}/addons/taft-samani.jpg`,
      },
    ],
  },
  {
    nameAr: "الوجبات الخاصة",
    nameEn: "Special Meals",
    image: `${IMG}/special/category.jpg`,
    items: [
      {
        nameAr: "جناح دجاج ميكسيكى",
        nameEn: "Mexican Chicken Wings",
        descAr: "جناح دجاج بنكهة مكسيكية",
        descEn: "Mexican-flavored chicken wings",
        price: 75,
        badge: "spicy",
        image: `${IMG}/special/mexican-wings.jpg`,
      },
      {
        nameAr: "وجبة شاورما عربي ميكسيكى رز شوية",
        nameEn: "Arabic Mexican Shawarma with Rice",
        descAr: "وجبة مع رز",
        descEn: "Meal with rice",
        price: 140,
        image: `${IMG}/special/arabic-mexican-rice.jpg`,
      },
      {
        nameAr: "وجبة شاورما عربي ميكسيكى دبل",
        nameEn: "Arabic Mexican Shawarma Double",
        descAr: "دبل ساندوتش",
        descEn: "Double sandwich",
        price: 150,
        image: `${IMG}/special/arabic-mexican-double.jpg`,
      },
      {
        nameAr: "إضافة مشروم وموتزريلا للدبل",
        nameEn: "Mushroom & Mozzarella Add-on",
        descAr: "إضافة مشروم وموتزريلا لوجبات الدبل",
        descEn: "Add mushroom and mozzarella to double meals",
        price: 260,
        image: `${IMG}/special/mushroom-mozzarella.jpg`,
      },
    ],
  },
  {
    nameAr: "المشروبات",
    nameEn: "Drinks",
    image: `${IMG}/drinks/category.jpg`,
    items: [
      {
        nameAr: "مشروبات",
        nameEn: "Drinks",
        descAr: "مشروبات غازية",
        descEn: "Soft drinks",
        price: 15,
        image: `${IMG}/drinks/soft.jpg`,
      },
      {
        nameAr: "مشروبات دجارة",
        nameEn: "Jara Drinks",
        descAr: "مشروبات دجارة",
        descEn: "Jara drinks",
        price: 15,
        image: `${IMG}/drinks/jara.jpg`,
      },
    ],
  },
];

async function main() {
  console.log("Seeding database...\n");

  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.branch.deleteMany();

  for (const branch of branches) {
    await prisma.branch.create({ data: branch });
  }
  console.log(`${branches.length} branches seeded`);

  for (let order = 0; order < menu.length; order++) {
    const category = menu[order];
    const created = await prisma.category.create({
      data: {
        nameAr: category.nameAr,
        nameEn: category.nameEn,
        order,
        image: category.image,
        items: {
          create: category.items.map((item) => ({
            nameAr: item.nameAr,
            nameEn: item.nameEn,
            descAr: item.descAr,
            descEn: item.descEn,
            price: item.price ?? null,
            sizes: item.sizes ? (item.sizes as Prisma.InputJsonValue) : Prisma.JsonNull,
            image: item.image,
            badge: item.badge ?? null,
            available: true,
          })),
        },
      },
    });
    console.log(`  ${category.nameEn}: ${created.id} (${category.items.length} items)`);
  }
  console.log(`\n${menu.length} categories seeded`);

  await prisma.systemSetting.upsert({
    where: { key: "customer_live_tracking" },
    update: {},
    create: { key: "customer_live_tracking", value: true as unknown as Prisma.InputJsonValue },
  });
  await prisma.systemSetting.upsert({
    where: { key: "staff_sound_alerts" },
    update: {},
    create: { key: "staff_sound_alerts", value: true as unknown as Prisma.InputJsonValue },
  });
  await prisma.systemSetting.upsert({
    where: { key: "order_history_ttl_hours" },
    update: {},
    create: { key: "order_history_ttl_hours", value: 4 as unknown as Prisma.InputJsonValue },
  });
  console.log("System settings seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
