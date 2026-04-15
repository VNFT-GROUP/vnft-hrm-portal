import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import viLocale from "i18n-iso-countries/langs/vi.json";
import zhLocale from "i18n-iso-countries/langs/zh.json";

countries.registerLocale(viLocale);
countries.registerLocale(enLocale);
countries.registerLocale(zhLocale);

const COUNTRIES_VI = Object.values(countries.getNames("vi"));

export function getCountryNameForLocale(
  viName: string,
  language: string,
): string {
  if (language === "vi") return viName;

  const viNames = countries.getNames("vi");
  const code = Object.keys(viNames).find((key) => viNames[key] === viName);

  if (!code) return viName;

  return countries.getName(code, language === "zh" ? "zh" : "en") || viName;
}

export const ALL_COUNTRIES_SORTED = [
  "Việt Nam",
  ...COUNTRIES_VI.filter((country) => country !== "Việt Nam").sort((a, b) =>
    a.localeCompare(b, "vi"),
  ),
];

export const WORLD_RELIGIONS = [
  "Không",
  "Phật giáo",
  "Công giáo (Thiên chúa / Tin Lành)",
  "Đạo Cao Đài",
  "Phật giáo Hòa Hảo",
  "Hồi giáo",
  "Ấn Độ giáo (Hindu)",
  "Tín ngưỡng dân gian",
  "Thần đạo (Shinto)",
  "Đạo giáo",
  "Tôn giáo Yoruba",
  "Voodoo",
  "Đạo Sikh",
  "Ahmadiyya",
  "Do Thái giáo",
  "Thông linh học",
  "Đạo Mu (Mu-ism)",
  "Giáo hội Thống nhất",
  "Ayyavazhi",
  "Đạo Baháʼí",
  "Nho giáo",
  "Sarna giáo",
  "Kỳ Na giáo (Jainism)",
  "Thiên đạo giáo (Cheondoism)",
  "Hội thánh Đức Chúa Trời",
  "Iglesia ni Cristo",
  "Ravidassia",
  "Thiên Lý giáo (Tenriism)",
  "Druze",
  "Đạo Tengri",
  "Rastafari",
  "Yarsanism",
  "Wicca",
  "Yazidi giáo",
  "Assian giáo",
  "Donyi-Polo",
  "Giáo hội truyền thống Châu Mỹ",
  "Sanamahi giáo",
  "Bái hỏa giáo (Zoroastrianism)",
  "Mandae giáo",
  "Khoa học Hạnh phúc",
  "Tu nghiệm đạo (Shugendō)",
  "Samaritan giáo",
  "Khác",
];

export const ETHNICITIES_VN = [
  "Kinh",
  "Tày",
  "Thái",
  "Hoa",
  "Khơ-me",
  "Mường",
  "Nùng",
  "HMông",
  "Dao",
  "Gia-rai",
  "Ngái",
  "Ê-đê",
  "Ba na",
  "Xơ-Đăng",
  "Sán Chay",
  "Cơ-ho",
  "Chăm",
  "Sán Dìu",
  "Hrê",
  "Mnông",
  "Ra-glai",
  "Xtiêng",
  "Bru-Vân Kiều",
  "Thổ",
  "Giáy",
  "Cơ-tu",
  "Gié Triêng",
  "Mạ",
  "Khơ-mú",
  "Co",
  "Tà-ôi",
  "Chơ-ro",
  "Kháng",
  "Xinh-mun",
  "Hà Nhì",
  "Chu ru",
  "Lào",
  "La Chí",
  "La Ha",
  "Phù Lá",
  "La Hủ",
  "Lự",
  "Lô Lô",
  "Chứt",
  "Mảng",
  "Pà Thẻn",
  "Co Lao",
  "Cống",
  "Bố Y",
  "Si La",
  "Pu Péo",
  "Brâu",
  "Ơ Đu",
  "Rơ măm",
];

export const GLOBAL_ETHNICITIES = [
  "Asian or Asian British",
  "Indian",
  "Pakistani",
  "Bangladeshi",
  "Chinese",
  "Any other Asian background",
  "Black, Black British, Caribbean or African",
  "Caribbean",
  "African",
  "Any other Black, Black British, or Caribbean background",
  "Mixed or multiple ethnic groups",
  "White and Black Caribbean",
  "White and Black African",
  "White and Asian",
  "Any other Mixed or multiple ethnic background",
  "White",
  "English, Welsh, Scottish, Northern Irish or British",
  "Irish",
  "Gypsy or Irish Traveller",
  "Roma",
  "Any other White background",
  "Arab",
  "Any other ethnic group",
];
