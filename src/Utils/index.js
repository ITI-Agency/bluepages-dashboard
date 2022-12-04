// for preparing filters queries
const prepareQueryFilters = (filters) => {
	const params = filters
		?.map((filter) => `${Object.keys(filter)[0]}=${filter[Object.keys(filter)[0]]}`)
		.join("&");
	return filters.length ? `?${params}` : "";
};
const plans = [
	{
		package_id: 1,
		name_en: 'FREE',
		name_ar: 'مجاني',
	},
	{
		package_id: 2,
		name_en: 'BASIC',
		name_ar: 'موثق مدفوع أساسي',
	},
	{
		package_id: 3,
		name_en: 'PREMIUM Main',
		name_ar: "بريميوم - وسط الصفحه الرئيسيه",
	},
	{
		package_id: 4,
		name_en: 'SILVER Main',
		name_ar: "فضي - أسفل الصفحه الرئيسيه",
	},
	{
		package_id: 5,
		name_en: 'GOLD',
		name_ar: 'ذهبي - أعلي الصفحه الرئيسيه',
	},
	{
		package_id: 6,
		name_en: 'PREMIUM City',
		name_ar: "بريميوم - وسط صفحه المدينه",
	},
	{
		package_id: 7,
		name_en: 'SILVER City',
		name_ar: "فضي - أسفل  صفحه المدينه",
	},
	{
		package_id: 8,
		name_en: 'Bronze',
		name_ar: "برونز - مربع النشاط",
	},
];
export default {
	prepareQueryFilters,
	plans

};
