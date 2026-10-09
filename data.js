/* ข้อมูลจำลองทั้งหมดของแอปเกาะสีชัง (แก้ไขที่ไฟล์นี้ได้เลย)
   ทุกอย่างเป็นข้อมูลตัวอย่างสำหรับ prototype */
const DATA = {
  /* ---------- จุดบนหน้า Home (6 จุด) ---------- */
  spots: [
    { id: 'pier', icon: '⚓', x: 95, y: 228,
      name: { th: 'ท่าเรือ', en: 'Pier' },
      desc: { th: 'จุดขึ้นลงเรือจากศรีราชา เริ่มต้นการเดินทางบนเกาะ', en: 'Ferry landing from Si Racha, where your island trip begins.' } },
    { id: 'beach', icon: '🏖️', x: 295, y: 238,
      name: { th: 'ชายหาด', en: 'Beach' },
      desc: { th: 'หาดทรายน้ำใส เหมาะกับการเดินเล่นและชมพระอาทิตย์ตก', en: 'Clear water and soft sand, great for a stroll and sunsets.' } },
    { id: 'temple', icon: '⛩️', x: 175, y: 122,
      name: { th: 'วัด/ศาลเจ้า', en: 'Temple / Shrine' },
      desc: { th: 'สถานที่ศักดิ์สิทธิ์ของชาวเกาะ ผสมผสานวัฒนธรรมไทย-จีน', en: 'A sacred island landmark blending Thai and Chinese culture.' } },
    { id: 'view', icon: '🌅', x: 265, y: 110,
      name: { th: 'จุดชมวิว', en: 'Viewpoint' },
      desc: { th: 'ชมทะเลกว้างและเรือสินค้าจอดเรียงรายในอ่าว', en: 'Wide sea views with cargo ships anchored in the bay.' } },
    { id: 'food', icon: '🍤', x: 165, y: 205,
      name: { th: 'ร้านอาหาร', en: 'Restaurant' },
      desc: { th: 'อาหารทะเลสดๆ จากชาวประมงบนเกาะ', en: 'Fresh seafood from local fishermen.' } },
    { id: 'waste', icon: '♻️', x: 225, y: 262,
      name: { th: 'จุดทิ้งขยะ', en: 'Waste Point' },
      desc: { th: 'ทิ้งขยะให้ถูกถัง ช่วยกันรักษาเกาะสีชังให้สะอาด', en: 'Sort your waste properly and help keep the island clean.' } }
  ],

  /* ---------- ภารกิจตามล่าสมบัติ ---------- */
  missions: [
    { id: 'm1', points: 20, title: { th: 'เช็กอินที่ท่าเรือเมื่อถึงเกาะ', en: 'Check in at the pier when you arrive' } },
    { id: 'm2', points: 20, title: { th: 'ถ่ายรูปกับวิวทะเลที่จุดชมวิว', en: 'Take a photo at the viewpoint' } },
    { id: 'm3', points: 20, title: { th: 'ลองกินอาหารพื้นถิ่น 1 มื้อ', en: 'Try one local meal' } },
    { id: 'm4', points: 20, title: { th: 'ทิ้งขยะแยกประเภทที่จุดทิ้งขยะ', en: 'Sort your waste at a waste point' } },
    { id: 'm5', points: 20, title: { th: 'เยี่ยมชมวัดหรือศาลเจ้า', en: 'Visit a temple or shrine' } }
  ],
  missionBonus: 50,

  /* ---------- ของรางวัล (ส่วนลดร้านท้องถิ่น) ---------- */
  rewards: [
    { id: 'r1', cost: 50,  emoji: '🥤', shop: { th: 'คาเฟ่ลมทะเล', en: 'Sea Breeze Cafe' }, name: { th: 'ส่วนลดเครื่องดื่ม 20%', en: '20% off drinks' } },
    { id: 'r2', cost: 80,  emoji: '🦀', shop: { th: 'ครัวริมเล', en: 'Rim Le Kitchen' }, name: { th: 'ส่วนลดอาหารทะเล 10%', en: '10% off seafood' } },
    { id: 'r3', cost: 100, emoji: '🍜', shop: { th: 'ก๋วยเตี๋ยวเรือหน้าท่า', en: 'Pier Boat Noodles' }, name: { th: 'ฟรีน้ำแข็งใสหลังอาหาร', en: 'Free shaved ice with a meal' } },
    { id: 'r4', cost: 120, emoji: '🛍️', shop: { th: 'ร้านของฝากป้าแดง', en: "Pa Daeng Souvenirs" }, name: { th: 'ส่วนลดของฝาก 15%', en: '15% off souvenirs' } },
    { id: 'r5', cost: 200, emoji: '🛺', shop: { th: 'กลุ่มสามล้อเกาะสีชัง', en: 'Island Tricycle Group' }, name: { th: 'ส่วนลดค่าสามล้อ 50 บาท', en: '50 THB off a tricycle ride' } }
  ],

  /* ---------- หมุดบนแผนที่ (3 layer) ---------- */
  pins: [
    /* ร้านอาหาร */
    { id: 'f1', layer: 'food', x: 150, y: 195, icon: '🍤',
      name: { th: 'ครัวริมเล', en: 'Rim Le Kitchen' },
      menu: { th: 'ปูผัดผงกะหรี่, ปลาหมึกย่าง, ต้มยำทะเล', en: 'Curry crab, grilled squid, seafood tom yum' },
      price: { th: '120–350 บาท/จาน', en: '120–350 THB / dish' } },
    { id: 'f2', layer: 'food', x: 210, y: 240, icon: '🍜',
      name: { th: 'ก๋วยเตี๋ยวเรือหน้าท่า', en: 'Pier Boat Noodles' },
      menu: { th: 'ก๋วยเตี๋ยวเรือหมู, เกี๊ยวทอด', en: 'Pork boat noodles, fried wontons' },
      price: { th: '40–80 บาท/ชาม', en: '40–80 THB / bowl' } },
    { id: 'f3', layer: 'food', x: 282, y: 200, icon: '🥥',
      name: { th: 'คาเฟ่ลมทะเล', en: 'Sea Breeze Cafe' },
      menu: { th: 'มะพร้าวปั่น, กาแฟเย็น, ขนมปังปิ้ง', en: 'Coconut smoothie, iced coffee, toast' },
      price: { th: '50–120 บาท', en: '50–120 THB' } },
    { id: 'f4', layer: 'food', x: 130, y: 242, icon: '🦐',
      name: { th: 'ร้านป้าแดง', en: "Pa Daeng's Place" },
      menu: { th: 'กุ้งเผา, ยำทะเล, ข้าวผัดปู', en: 'Grilled prawns, seafood salad, crab fried rice' },
      price: { th: '80–300 บาท/จาน', en: '80–300 THB / dish' } },
    /* ประวัติสถานที่ */
    { id: 'h1', layer: 'history', x: 175, y: 120, icon: '🏛️',
      name: { th: 'พระจุฑาธุชราชฐาน', en: 'Phra Chutathut Palace Ruins' },
      story: { th: 'สร้างขึ้นในสมัยรัชกาลที่ 5 เพื่อเป็นที่ประทับตากอากาศบนเกาะ ปัจจุบันเหลือร่องรอยอาคารให้เดินชม (เนื้อหาตัวอย่างสำหรับ prototype)', en: 'Built in the reign of King Rama V as a seaside retreat. Traces of the buildings remain to explore. (Sample content for the prototype)' } },
    { id: 'h2', layer: 'history', x: 245, y: 95, icon: '⛩️',
      name: { th: 'ศาลเจ้าพ่อเขาใหญ่', en: 'Chao Pho Khao Yai Shrine' },
      story: { th: 'ศาลเจ้าเก่าแก่ที่ชาวเกาะเคารพนับถือ มีงานประจำปีที่ผู้คนมาร่วมกันอย่างคึกคัก (เนื้อหาตัวอย่างสำหรับ prototype)', en: 'An old shrine revered by islanders, with a lively annual festival. (Sample content for the prototype)' } },
    { id: 'h3', layer: 'history', x: 295, y: 150, icon: '🛕',
      name: { th: 'วัดบนเขา', en: 'Hilltop Temple' },
      story: { th: 'วัดเล็กๆ บนเนินเขา มีบันไดขึ้นไปชมวิวทะเล และถ้ำให้เดินสำรวจ (เนื้อหาตัวอย่างสำหรับ prototype)', en: 'A small hilltop temple with stairs up to sea views and a cave to explore. (Sample content for the prototype)' } },
    { id: 'h4', layer: 'history', x: 150, y: 170, icon: '⚓',
      name: { th: 'ท่าเรือเก่า', en: 'Old Pier' },
      story: { th: 'ท่าเรือเดิมที่เคยเป็นประตูสู่เกาะ ชาวประมงยังใช้จอดเรือจนถึงทุกวันนี้ (เนื้อหาตัวอย่างสำหรับ prototype)', en: 'The original landing of the island, still used by fishermen today. (Sample content for the prototype)' } },
    /* จุดทิ้งขยะ */
    { id: 'w1', layer: 'waste', x: 100, y: 215, icon: '♻️',
      name: { th: 'จุดทิ้งขยะท่าเรือ', en: 'Pier Waste Point' },
      bins: { th: 'ขยะทั่วไป (น้ำเงิน), รีไซเคิล (เหลือง)', en: 'General (blue), Recyclable (yellow)' } },
    { id: 'w2', layer: 'waste', x: 215, y: 262, icon: '♻️',
      name: { th: 'จุดทิ้งขยะชายหาด', en: 'Beach Waste Point' },
      bins: { th: 'ขยะทั่วไป (น้ำเงิน), รีไซเคิล (เหลือง), ขยะเปียก (เขียว)', en: 'General (blue), Recyclable (yellow), Organic (green)' } },
    { id: 'w3', layer: 'waste', x: 300, y: 225, icon: '♻️',
      name: { th: 'จุดทิ้งขยะตลาด', en: 'Market Waste Point' },
      bins: { th: 'ขยะเปียก (เขียว), ขยะทั่วไป (น้ำเงิน)', en: 'Organic (green), General (blue)' } },
    { id: 'w4', layer: 'waste', x: 180, y: 182, icon: '☣️',
      name: { th: 'จุดทิ้งขยะอันตราย', en: 'Hazardous Waste Point' },
      bins: { th: 'ขยะอันตราย (แดง) เช่น ถ่านไฟฉาย หลอดไฟ', en: 'Hazardous (red), e.g. batteries, light bulbs' } }
  ],
  checkinPoints: 10,

  /* ---------- กิจกรรม ---------- */
  activities: [
    { id: 'a1', cat: 'sea', sea: true, emoji: '🤿', price: 890,
      name: { th: 'ดำน้ำตื้นชมปะการัง', en: 'Snorkeling trip' },
      desc: { th: 'นั่งเรือไปจุดดำน้ำตื้น พร้อมอุปกรณ์และไกด์พาชม ใช้เวลาประมาณ 3 ชั่วโมง', en: 'Boat to a snorkeling spot with gear and a guide, about 3 hours.' },
      provider: { name: { th: 'ทีมดำน้ำเกาะสีชัง', en: 'Sichang Dive Crew' }, phone: '081-000-0101', rating: 4.8, reviews: 126, emoji: '🧑‍🚀' } },
    { id: 'a2', cat: 'sea', sea: true, emoji: '🛶', price: 600,
      name: { th: 'พายคายัคชมอ่าว', en: 'Kayaking the bay' },
      desc: { th: 'พายคายัคชมอ่าวเงียบๆ ช่วงเย็น มีเสื้อชูชีพให้ทุกคน', en: 'A calm evening paddle with life jackets for everyone.' },
      provider: { name: { th: 'ลุงชาติ คายัค', en: 'Uncle Chart Kayaks' }, phone: '081-000-0102', rating: 4.6, reviews: 74, emoji: '👨‍🦳' } },
    { id: 'a3', cat: 'sea', sea: true, emoji: '🦑', price: 750,
      name: { th: 'ตกหมึกยามเย็น', en: 'Evening squid fishing' },
      desc: { th: 'ออกเรือตกหมึกกับชาวประมง แล้วนำมาย่างกินสดๆ บนเรือ', en: 'Fish for squid with local fishermen and grill your catch.' },
      provider: { name: { th: 'เรือประมงพี่โต้ง', en: "P'Tong Fishing Boat" }, phone: '081-000-0103', rating: 4.7, reviews: 58, emoji: '👨‍🍳' } },
    { id: 'a4', cat: 'culture', sea: false, emoji: '🏛️', price: 300,
      name: { th: 'เดินชมพระราชวังเก่า', en: 'Old palace walking tour' },
      desc: { th: 'เดินชมซากพระราชฐานพร้อมเล่าประวัติ ใช้เวลา 1.5 ชั่วโมง', en: 'Guided walk through the old palace grounds, 1.5 hours.' },
      provider: { name: { th: 'กลุ่มเยาวชนรักถิ่น', en: 'Local Youth Guides' }, phone: '081-000-0104', rating: 4.9, reviews: 91, emoji: '🧑‍🎓' } },
    { id: 'a5', cat: 'land', sea: false, emoji: '🛺', price: 400,
      name: { th: 'สามล้อชมเกาะรอบเกาะ', en: 'Tricycle island tour' },
      desc: { th: 'นั่งสามล้อพ่วงรอบเกาะ แวะจุดสำคัญ 5 จุด', en: 'Ride a sidecar tricycle around the island with 5 stops.' },
      provider: { name: { th: 'กลุ่มสามล้อเกาะสีชัง', en: 'Island Tricycle Group' }, phone: '081-000-0105', rating: 4.5, reviews: 203, emoji: '👨‍✈️' } },
    { id: 'a6', cat: 'land', sea: false, emoji: '🌄', price: 500,
      name: { th: 'เดินป่าขึ้นจุดชมวิว', en: 'Hike to the viewpoint' },
      desc: { th: 'เดินขึ้นเขาชมวิวพระอาทิตย์ตกพร้อมไกด์ท้องถิ่น', en: 'Sunset hike with a local guide.' },
      provider: { name: { th: 'พี่นิ่ม ไกด์เดินป่า', en: "P'Nim Trail Guide" }, phone: '081-000-0106', rating: 4.8, reviews: 67, emoji: '👩‍🦰' } }
  ],

  /* ---------- จ้างบริการ ---------- */
  services: [
    { id: 's1', cat: 'guide', sea: false, emoji: '🧭', price: 800,
      name: { th: 'ไกด์ท้องถิ่น ลุงสมชาย', en: 'Local guide: Uncle Somchai' },
      desc: { th: 'ไกด์ที่เกิดและโตบนเกาะ เล่าเรื่องราวและพาไปที่ลับๆ (ต่อวัน)', en: 'Born and raised on the island, shows you hidden spots (per day).' },
      provider: { name: { th: 'ลุงสมชาย', en: 'Uncle Somchai' }, phone: '082-000-0201', rating: 4.9, reviews: 142, emoji: '👨‍🦳' } },
    { id: 's2', cat: 'guide', sea: false, emoji: '🧭', price: 700,
      name: { th: 'ไกด์ พี่นิ่ม', en: "Guide: P'Nim" },
      desc: { th: 'ไกด์สายธรรมชาติและเดินป่า พูดอังกฤษได้ (ต่อวัน)', en: 'Nature and trail guide who speaks English (per day).' },
      provider: { name: { th: 'พี่นิ่ม', en: "P'Nim" }, phone: '082-000-0202', rating: 4.8, reviews: 88, emoji: '👩‍🦰' } },
    { id: 's3', cat: 'photo', sea: false, emoji: '📸', price: 1500,
      name: { th: 'ช่างภาพ โอ๊ต', en: 'Photographer: Oat' },
      desc: { th: 'ถ่ายภาพท่องเที่ยว 2 ชั่วโมง ส่งไฟล์ภายใน 3 วัน', en: '2-hour travel shoot, files delivered within 3 days.' },
      provider: { name: { th: 'โอ๊ต', en: 'Oat' }, phone: '082-000-0203', rating: 4.7, reviews: 53, emoji: '🧑‍🎨' } },
    { id: 's4', cat: 'photo', sea: false, emoji: '📸', price: 1200,
      name: { th: 'ช่างภาพ มายด์', en: 'Photographer: Mind' },
      desc: { th: 'ถ่ายภาพคู่/ครอบครัวช่วงพระอาทิตย์ตก 1.5 ชั่วโมง', en: '1.5-hour couple or family sunset shoot.' },
      provider: { name: { th: 'มายด์', en: 'Mind' }, phone: '082-000-0204', rating: 4.9, reviews: 79, emoji: '👩‍🎤' } },
    { id: 's5', cat: 'boat', sea: true, emoji: '⛵', price: 1800,
      name: { th: 'เรือหางยาว กัปตันหมี', en: 'Longtail boat: Captain Mee' },
      desc: { th: 'เหมาเรือหางยาวรอบเกาะ นั่งได้ 6 คน ใช้เวลา 2–3 ชั่วโมง', en: 'Private longtail around the island, up to 6 people, 2–3 hours.' },
      provider: { name: { th: 'กัปตันหมี', en: 'Captain Mee' }, phone: '082-000-0205', rating: 4.6, reviews: 110, emoji: '🧔' } },
    { id: 's6', cat: 'boat', sea: true, emoji: '🚤', price: 3500,
      name: { th: 'เรือเร็วไปเกาะใกล้เคียง', en: 'Speedboat to nearby islets' },
      desc: { th: 'เหมาเรือเร็วไปเกาะใกล้เคียง นั่งได้ 8 คน', en: 'Private speedboat to nearby islets, up to 8 people.' },
      provider: { name: { th: 'กัปตันต้น', en: 'Captain Ton' }, phone: '082-000-0206', rating: 4.5, reviews: 36, emoji: '🧑‍✈️' } }
  ],
  timeSlots: ['08:00', '10:00', '13:00', '15:30', '17:00'],

  /* ---------- เวลาเรือ (ข้อมูลจำลอง) ---------- */
  ferry: {
    toIsland:   ['07:00', '08:30', '10:00', '11:30', '13:00', '14:30', '16:00', '17:30'],
    toMainland: ['06:30', '08:00', '09:30', '11:00', '12:30', '14:00', '15:30', '17:00'],
    fare: 50
  },

  /* ---------- น้ำขึ้นน้ำลงของวัน (จำลอง ระดับเป็นเมตร ชั่วโมง 0–24) ---------- */
  tide: Array.from({ length: 25 }, (_, h) => +(1.5 + 1.0 * Math.sin(((h - 2) / 12.4) * 2 * Math.PI)).toFixed(2)),

  /* ---------- คนขับ (จำลอง) ---------- */
  drivers: {
    tricycle: [
      { name: 'ลุงชาติ', nameEn: 'Uncle Chart', plate: 'สามล้อ 12', phone: '083-000-0301', emoji: '👨‍🦳' },
      { name: 'พี่เอก', nameEn: "P'Ek", plate: 'สามล้อ 27', phone: '083-000-0302', emoji: '👨' }
    ],
    moto: [
      { name: 'พี่โจ', nameEn: "P'Jo", plate: 'กข 1234 ชบ', phone: '083-000-0303', emoji: '🧑‍🦱' },
      { name: 'น้องบอล', nameEn: 'Ball', plate: 'งจ 5678 ชบ', phone: '083-000-0304', emoji: '🧑' }
    ]
  },

  /* ---------- เบอร์ฉุกเฉิน ---------- */
  emergency: [
    { icon: '👮', phone: '191',  name: { th: 'ตำรวจ', en: 'Police' } },
    { icon: '🚑', phone: '1669', name: { th: 'การแพทย์ฉุกเฉิน', en: 'Emergency medical' } },
    { icon: '🧳', phone: '1155', name: { th: 'ตำรวจท่องเที่ยว', en: 'Tourist police' } },
    { icon: '🏥', phone: '038-000-0911', name: { th: 'ศูนย์ช่วยเหลือเกาะสีชัง (จำลอง)', en: 'Island help center (mock)' } }
  ]
};

/* ---------- ข้อความสองภาษา ---------- */
const I18N = {
  th: {
    app_name: 'เกาะสีชัง',
    tab_home: 'Home', tab_maps: 'Maps', tab_book: 'จอง', tab_travel: 'เดินทาง', tab_settings: 'ตั้งค่า',
    title_login: 'เข้าสู่ระบบ', title_home: 'เกาะสีชัง', title_missions: 'ภารกิจตามล่าสมบัติ', title_points: 'คะแนนสะสม',
    title_rewards: 'แลกของรางวัล', title_maps: 'แผนที่คู่มือเกาะ', title_book: 'จองและจ้างบริการ', title_detail: 'รายละเอียด',
    title_checkout: 'ชำระเงิน', title_status: 'สถานะการจอง', title_provider: 'ข้อมูลผู้ให้บริการ', title_travel: 'เวลาเรือและน้ำขึ้นน้ำลง',
    title_ride: 'เรียกรถ', title_driver: 'สถานะคนขับ', title_settings: 'ตั้งค่า',
    back: 'ย้อนกลับ', close: 'ปิด', ok: 'ตกลง',
    login: 'เข้าสู่ระบบ', signup: 'สมัครสมาชิก', email: 'อีเมล', password: 'รหัสผ่าน', guest: 'เข้าแบบ Guest',
    no_account: 'ยังไม่มีบัญชี? สมัครสมาชิก', has_account: 'มีบัญชีแล้ว? เข้าสู่ระบบ', choose_lang: 'เลือกภาษา',
    err_email: 'กรุณากรอกอีเมลให้ถูกต้อง', err_pw: 'รหัสผ่านอย่างน้อย 4 ตัวอักษร', login_note: 'ระบบจำลอง ใช้อีเมลอะไรก็ได้',
    welcome_title: 'ยินดีต้อนรับสู่เกาะสีชัง', welcome_sub: 'สำรวจเกาะ สะสมแต้ม จองกิจกรรมกับคนท้องถิ่น',
    hello: 'สวัสดี', pts: 'แต้ม', my_points: 'แต้มของฉัน',
    tap_hint: 'แตะจุดบนเกาะเพื่อดูรายละเอียดและเช็กอินรับแต้ม',
    qb_missions: 'ภารกิจ', qb_points: 'คะแนน', qb_rewards: 'แลกรางวัล',
    checkin: 'เช็กอินรับแต้ม', checked: 'เช็กอินวันนี้แล้ว', checkin_ok: 'เช็กอินสำเร็จ! +{n} แต้ม', checkin_rule: 'เช็กอินได้ครั้งละ {n} แต้ม ต่อจุดต่อวัน',
    progress: 'ความคืบหน้า', mission_hint: 'ทำภารกิจเสร็จแล้วแตะเพื่อติ๊กรับแต้ม', mission_get: 'ภารกิจสำเร็จ! +{n} แต้ม',
    mission_bonus: 'ครบทุกภารกิจ! โบนัส +{n} แต้ม', mission_all: '🎉 ทำครบทุกภารกิจแล้ว',
    total_points: 'แต้มรวม', by_source: 'แต้มแบ่งตามแหล่งที่มา', history: 'ประวัติแต้ม', no_history: 'ยังไม่มีประวัติแต้ม',
    src_mission: 'ภารกิจ', src_waste: 'ทิ้งขยะถูกจุด', src_booking: 'จองกิจกรรม', src_checkin: 'เช็กอิน', src_redeem: 'แลกรางวัล',
    go_rewards: 'ไปแลกของรางวัล',
    redeem: 'แลก', redeem_done: 'แลกสำเร็จ!', not_enough: 'แต้มไม่พอ', cost: 'ใช้', my_codes: 'โค้ดของฉัน', no_codes: 'ยังไม่มีโค้ด',
    code: 'โค้ดส่วนลด', show_code: 'แสดงโค้ดนี้ที่ร้านเพื่อรับส่วนลด', redeemed_at: 'แลกเมื่อ',
    layer_food: 'ร้านอาหาร', layer_history: 'ประวัติสถานที่', layer_waste: 'จุดทิ้งขยะ',
    menu_rec: 'เมนูแนะนำ', price_range: 'ช่วงราคา', story: 'เรื่องเล่า', bin_types: 'ประเภทถัง', navigate: 'นำทาง',
    nav_started: 'เริ่มนำทางไป {n} (จำลอง)', sample_note: 'ข้อมูลทั้งหมดเป็นตัวอย่างสำหรับ prototype',
    tab_activities: 'กิจกรรม', tab_services: 'จ้างบริการ', all: 'ทั้งหมด',
    cat_sea: 'ทางทะเล', cat_land: 'บนบก', cat_culture: 'วัฒนธรรม', cat_guide: 'ไกด์', cat_photo: 'ช่างภาพ', cat_boat: 'เรือ',
    price_all: 'ทุกราคา', price_low: 'ไม่เกิน 500', price_mid: '501–1,000', price_high: 'มากกว่า 1,000', no_items: 'ไม่พบรายการตามตัวกรอง',
    per_person: 'ต่อคน', per_trip: 'ต่อครั้ง', date: 'วันที่', time: 'เวลา', people: 'จำนวนคน', book_now: 'จองเลย', provider: 'ผู้ให้บริการ',
    tide_warn: 'กิจกรรมทางทะเล ควรเช็กน้ำขึ้นน้ำลงก่อนออกเรือ', tide_high_at: 'น้ำขึ้นสูงสุด', tide_low_at: 'น้ำลงต่ำสุด',
    tide_advice: 'ช่วงน้ำลงต่ำเรืออาจเข้า-ออกท่าลำบาก และช่วงน้ำขึ้นสูงคลื่นอาจแรง ควรทำตามคำแนะนำของผู้ให้บริการ',
    total: 'ยอดรวม', pay_method: 'วิธีชำระเงิน', pay_promptpay: 'พร้อมเพย์ (จำลอง)', pay_card: 'บัตรเครดิต (จำลอง)', pay_cash: 'เงินสดหน้างาน',
    pay_now: 'ชำระเงิน (จำลอง)', pay_note: 'ไม่มีการตัดเงินจริง', booking_ok: 'จองสำเร็จ! รอผู้ให้บริการยืนยัน',
    booking_confirmed: 'ผู้ให้บริการยืนยันการจองของคุณแล้ว', booking_summary: 'สรุปการจอง',
    st_pending: 'รอยืนยัน', st_confirmed: 'ยืนยันแล้ว', st_done: 'เสร็จสิ้น', pending_note: 'กำลังรอผู้ให้บริการยืนยัน (จำลอง ~5 วินาที)',
    mark_done: 'จำลองว่าเสร็จสิ้นกิจกรรม', done_pts: 'กิจกรรมเสร็จสิ้น! +{n} แต้ม', booking_pts_note: 'เมื่อเสร็จสิ้นรับ {n} แต้ม',
    booking_code: 'รหัสการจอง', view_provider: 'ดูข้อมูลผู้ให้บริการ', phone: 'เบอร์โทร', rating: 'คะแนนรีวิว', reviews: 'รีวิว', call: 'โทร',
    ferry_in: 'ศรีราชา → เกาะสีชัง', ferry_out: 'เกาะสีชัง → ศรีราชา', next_dep: 'เที่ยวถัดไป', depart_at: 'ออกเวลา', tomorrow: 'พรุ่งนี้',
    countdown: 'อีก', schedule: 'ตารางเรือ', fare: 'ค่าโดยสาร', baht: 'บาท', tide_today: 'น้ำขึ้นน้ำลงวันนี้', now_level: 'ตอนนี้', meter: 'ม.',
    high: 'น้ำขึ้น', low: 'น้ำลง', call_ride: 'เรียกรถ', remind_ferry: 'ใกล้เวลาเรือออก! เที่ยว {t} อีก {m} นาที', mock_note: 'ข้อมูลจำลอง',
    ride_pick: 'จุดรับ', ride_drop: 'จุดส่ง', ride_type: 'ประเภทรถ', ride_tricycle: 'สามล้อ', ride_moto: 'มอเตอร์ไซค์รับจ้าง',
    send_req: 'ส่งคำขอ', same_place: 'จุดรับและจุดส่งต้องไม่ซ้ำกัน', ride_sent: 'ส่งคำขอเรียกรถแล้ว',
    driver: 'คนขับ', plate: 'ทะเบียน', ride_st0: 'รับคำขอแล้ว', ride_st1: 'กำลังมา', ride_st2: 'ถึงแล้ว',
    ride_t0: 'คนขับรับคำขอของคุณแล้ว', ride_t1: 'คนขับกำลังมาหาคุณ', ride_t2: 'คนขับถึงจุดรับแล้ว', cancel_ride: 'ยกเลิก', new_ride: 'เรียกรถใหม่',
    no_ride: 'ยังไม่มีคำขอเรียกรถ', ride_auto: 'สถานะเปลี่ยนอัตโนมัติทุก 5 วินาที (จำลอง)', ride_cancelled: 'ยกเลิกคำขอแล้ว',
    account: 'บัญชี', guest_user: 'ผู้ใช้ Guest', lang_label: 'ภาษา', notif: 'การแจ้งเตือน', notif_on: 'เปิด', notif_off: 'ปิด',
    booking_hist: 'ประวัติการจอง', no_booking: 'ยังไม่มีการจอง', logout: 'ออกจากระบบ', logout_ok: 'ออกจากระบบแล้ว',
    welcome_toast: 'ยินดีต้อนรับ {n}', offline: '📴 โหมดออฟไลน์ — ใช้แผนที่และเวลาเรือที่เก็บไว้ในเครื่อง',
    sos: 'ฉุกเฉิน', sos_title: 'เบอร์ฉุกเฉินบนเกาะ', sos_desc: 'แตะเพื่อโทร (ในเครื่องมือถือ)'
  },
  en: {
    app_name: 'Ko Sichang',
    tab_home: 'Home', tab_maps: 'Maps', tab_book: 'Book', tab_travel: 'Travel', tab_settings: 'Settings',
    title_login: 'Log in', title_home: 'Ko Sichang', title_missions: 'Treasure Hunt', title_points: 'My Points',
    title_rewards: 'Redeem Rewards', title_maps: 'Island Guide Map', title_book: 'Book & Hire', title_detail: 'Details',
    title_checkout: 'Payment', title_status: 'Booking Status', title_provider: 'Provider Info', title_travel: 'Ferry & Tides',
    title_ride: 'Request a Ride', title_driver: 'Driver Status', title_settings: 'Settings',
    back: 'Back', close: 'Close', ok: 'OK',
    login: 'Log in', signup: 'Sign up', email: 'Email', password: 'Password', guest: 'Continue as Guest',
    no_account: 'No account? Sign up', has_account: 'Have an account? Log in', choose_lang: 'Choose language',
    err_email: 'Please enter a valid email', err_pw: 'Password needs at least 4 characters', login_note: 'Mock login, any email works',
    welcome_title: 'Welcome to Ko Sichang', welcome_sub: 'Explore the island, earn points, book local experiences',
    hello: 'Hello', pts: 'pts', my_points: 'My points',
    tap_hint: 'Tap a spot on the island for details and to check in for points',
    qb_missions: 'Missions', qb_points: 'Points', qb_rewards: 'Rewards',
    checkin: 'Check in for points', checked: 'Checked in today', checkin_ok: 'Checked in! +{n} pts', checkin_rule: '{n} points per spot per day',
    progress: 'Progress', mission_hint: 'Finish a mission, then tap to tick it and earn points', mission_get: 'Mission complete! +{n} pts',
    mission_bonus: 'All missions done! Bonus +{n} pts', mission_all: '🎉 All missions complete',
    total_points: 'Total points', by_source: 'Points by source', history: 'Points history', no_history: 'No points history yet',
    src_mission: 'Missions', src_waste: 'Proper waste disposal', src_booking: 'Bookings', src_checkin: 'Check-ins', src_redeem: 'Redeemed',
    go_rewards: 'Go to rewards',
    redeem: 'Redeem', redeem_done: 'Redeemed!', not_enough: 'Not enough points', cost: 'Cost', my_codes: 'My codes', no_codes: 'No codes yet',
    code: 'Discount code', show_code: 'Show this code at the shop for your discount', redeemed_at: 'Redeemed',
    layer_food: 'Restaurants', layer_history: 'History', layer_waste: 'Waste points',
    menu_rec: 'Recommended', price_range: 'Price range', story: 'Story', bin_types: 'Bin types', navigate: 'Navigate',
    nav_started: 'Navigating to {n} (mock)', sample_note: 'All data is sample content for the prototype',
    tab_activities: 'Activities', tab_services: 'Hire a service', all: 'All',
    cat_sea: 'Sea', cat_land: 'Land', cat_culture: 'Culture', cat_guide: 'Guides', cat_photo: 'Photographers', cat_boat: 'Boats',
    price_all: 'Any price', price_low: 'Up to 500', price_mid: '501–1,000', price_high: 'Over 1,000', no_items: 'No items match the filters',
    per_person: 'per person', per_trip: 'per trip', date: 'Date', time: 'Time', people: 'People', book_now: 'Book now', provider: 'Provider',
    tide_warn: 'Sea activity: check the tide before heading out', tide_high_at: 'High tide', tide_low_at: 'Low tide',
    tide_advice: 'Boats may struggle to dock at low tide and waves can be rough at high tide. Follow your provider’s advice.',
    total: 'Total', pay_method: 'Payment method', pay_promptpay: 'PromptPay (mock)', pay_card: 'Credit card (mock)', pay_cash: 'Cash on site',
    pay_now: 'Pay (mock)', pay_note: 'No real charge is made', booking_ok: 'Booked! Waiting for provider confirmation',
    booking_confirmed: 'The provider confirmed your booking', booking_summary: 'Booking summary',
    st_pending: 'Pending', st_confirmed: 'Confirmed', st_done: 'Completed', pending_note: 'Waiting for the provider (mock, ~5 seconds)',
    mark_done: 'Simulate activity completed', done_pts: 'Activity completed! +{n} pts', booking_pts_note: 'Earn {n} points on completion',
    booking_code: 'Booking ID', view_provider: 'View provider info', phone: 'Phone', rating: 'Rating', reviews: 'reviews', call: 'Call',
    ferry_in: 'Si Racha → Ko Sichang', ferry_out: 'Ko Sichang → Si Racha', next_dep: 'Next departure', depart_at: 'Departs at', tomorrow: 'tomorrow',
    countdown: 'in', schedule: 'Schedule', fare: 'Fare', baht: 'THB', tide_today: 'Today’s tide', now_level: 'Now', meter: 'm',
    high: 'High', low: 'Low', call_ride: 'Request a ride', remind_ferry: 'Ferry leaving soon! {t} departs in {m} min', mock_note: 'Mock data',
    ride_pick: 'Pickup', ride_drop: 'Drop-off', ride_type: 'Vehicle', ride_tricycle: 'Tricycle', ride_moto: 'Motorbike taxi',
    send_req: 'Send request', same_place: 'Pickup and drop-off must differ', ride_sent: 'Ride request sent',
    driver: 'Driver', plate: 'Plate', ride_st0: 'Request accepted', ride_st1: 'On the way', ride_st2: 'Arrived',
    ride_t0: 'A driver accepted your request', ride_t1: 'Your driver is on the way', ride_t2: 'Your driver has arrived', cancel_ride: 'Cancel', new_ride: 'New request',
    no_ride: 'No ride requested yet', ride_auto: 'Status changes automatically every 5 seconds (mock)', ride_cancelled: 'Request cancelled',
    account: 'Account', guest_user: 'Guest user', lang_label: 'Language', notif: 'Notifications', notif_on: 'On', notif_off: 'Off',
    booking_hist: 'Booking history', no_booking: 'No bookings yet', logout: 'Log out', logout_ok: 'Logged out',
    welcome_toast: 'Welcome, {n}', offline: '📴 Offline mode — using maps and ferry times saved on this device',
    sos: 'SOS', sos_title: 'Island emergency numbers', sos_desc: 'Tap to call (on a phone)'
  }
};
