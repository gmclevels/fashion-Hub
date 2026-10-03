export interface StateLocation {
  name: string;
  popularCities: string[];
}

export const NIGERIAN_STATES: StateLocation[] = [
  { name: 'Abia', popularCities: ['Aba', 'Umuahia', 'Ohafia', 'Arochukwu'] },
  { name: 'Adamawa', popularCities: ['Yola', 'Mubi', 'Jimeta', 'Numan'] },
  { name: 'Akwa Ibom', popularCities: ['Uyo', 'Eket', 'Ikot Ekpene', 'Oron'] },
  { name: 'Anambra', popularCities: ['Onitsha', 'Awka', 'Nnewi', 'Ekwulobia'] },
  { name: 'Bauchi', popularCities: ['Bauchi', 'Azare', 'Misau', 'Jama’are'] },
  { name: 'Bayelsa', popularCities: ['Yenagoa', 'Brass', 'Ogbia', 'Sagbama'] },
  { name: 'Benue', popularCities: ['Makurdi', 'Gboko', 'Otukpo', 'Katsina-Ala'] },
  { name: 'Borno', popularCities: ['Maiduguri', 'Biu', 'Bama', 'Monguno'] },
  { name: 'Cross River', popularCities: ['Calabar', 'Ikom', 'Ogoja', 'Ugep'] },
  { name: 'Delta', popularCities: ['Warri', 'Asaba', 'Ughelli', 'Sapele'] },
  { name: 'Ebonyi', popularCities: ['Abakaliki', 'Afikpo', 'Onueke', 'Edda'] },
  { name: 'Edo', popularCities: ['Benin City', 'Auchi', 'Ekpoma', 'Uromi'] },
  { name: 'Ekiti', popularCities: ['Ado-Ekiti', 'Ikere-Ekiti', 'Ijero', 'Oye-Ekiti'] },
  { name: 'Enugu', popularCities: ['Enugu', 'Nsukka', 'Awgu', 'Oji River'] },
  { name: 'FCT Abuja', popularCities: ['Wuse II', 'Garki', 'Maitama', 'Utako', 'Gwarinpa', 'Kubwa', 'Jabi', 'Lugbe'] },
  { name: 'Gombe', popularCities: ['Gombe', 'Kaltungo', 'Billiri', 'Bajoga'] },
  { name: 'Imo', popularCities: ['Owerri', 'Orlu', 'Okigwe', 'Mbaise'] },
  { name: 'Jigawa', popularCities: ['Dutse', 'Hadejia', 'Kazaure', 'Gumel'] },
  { name: 'Kaduna', popularCities: ['Kaduna Central', 'Zaria', 'Kafanchan', 'Sabon Tasha'] },
  { name: 'Kano', popularCities: ['Kano City (Kwari)', 'Sabon Gari', 'Dawanau', 'Fagge', 'Nassarawa'] },
  { name: 'Katsina', popularCities: ['Katsina', 'Daura', 'Funtua', 'Malumfashi'] },
  { name: 'Kebbi', popularCities: ['Birnin Kebbi', 'Argungu', 'Yauri', 'Zuru'] },
  { name: 'Kogi', popularCities: ['Lokoja', 'Okene', 'Kabba', 'Idah'] },
  { name: 'Kwara', popularCities: ['Ilorin', 'Offa', 'Omu-Aran', 'Jebba'] },
  { name: 'Lagos', popularCities: ['Ikeja', 'Lekki / Victoria Island', 'Yaba', 'Balogun / Lagos Island', 'Surulere', 'Trade Fair / Oshodi', 'Festac'] },
  { name: 'Nasarawa', popularCities: ['Lafia', 'Keffi', 'Karu', 'Akwanga'] },
  { name: 'Niger', popularCities: ['Minna', 'Suleja', 'Bida', 'Kontagora'] },
  { name: 'Ogun', popularCities: ['Abeokuta', 'Ijebu Ode', 'Sagamu', 'Ota'] },
  { name: 'Ondo', popularCities: ['Akure', 'Ondo Town', 'Owo', 'Ikare'] },
  { name: 'Osun', popularCities: ['Osogbo', 'Ile-Ife', 'Ede', 'Ilesa'] },
  { name: 'Oyo', popularCities: ['Ibadan (Bodija/Dugbe)', 'Ogbomoso', 'Oyo Town', 'Iseyin'] },
  { name: 'Plateau', popularCities: ['Jos', 'Bukuru', 'Pankshin', 'Shendam'] },
  { name: 'Rivers', popularCities: ['Port Harcourt (GRA/Mile 1)', 'Obio-Akpor', 'Bonny', 'Eleme'] },
  { name: 'Sokoto', popularCities: ['Sokoto City', 'Tambuwal', 'Wurno', 'Gwadabawa'] },
  { name: 'Taraba', popularCities: ['Jalingo', 'Wukari', 'Bali', 'Takum'] },
  { name: 'Yobe', popularCities: ['Damaturu', 'Potiskum', 'Gashua', 'Nguru'] },
  { name: 'Zamfara', popularCities: ['Gusau', 'Kaura Namoda', 'Talata Mafara', 'Anka'] }
];

export const ALL_STATE_NAMES = NIGERIAN_STATES.map(s => s.name);

export function getCitiesForState(stateName: string): string[] {
  const match = NIGERIAN_STATES.find(s => s.name.toLowerCase() === stateName.toLowerCase());
  return match ? match.popularCities : ['City Center'];
}
