import L from 'leaflet';

export const getFacilityIcon = (type: string) => {
  if (typeof window === 'undefined') {
    return null;
  }
  let iconUrl = '/icons/bin-icon.png';
  switch (type) {
    case 'BIN':
      iconUrl = '/icons/bin-icon.png';
      break;
    case 'TOILET':
      iconUrl = '/icons/toilet-icon.png';
      break;
    case 'WASTE_FACILITY':
      iconUrl = '/icons/treatment-facility-icon.png';
      break;
  }
  return new L.Icon({
    iconUrl,
    iconSize: [32, 32],
  });
};
