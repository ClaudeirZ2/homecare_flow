// Distância em metros entre dois pontos de GPS (fórmula de Haversine).
// Uso para saber se o check-in foi feito perto da casa do paciente.
function distanciaEmMetros(lat1, lng1, lat2, lng2) {
  const RAIO_TERRA = 6371000; // metros
  const rad = (graus) => (graus * Math.PI) / 180;

  const dLat = rad(lat2 - lat1);
  const dLng = rad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;

  return Math.round(RAIO_TERRA * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// Até essa distância eu considero que o profissional estava na casa do paciente
const RAIO_PERMITIDO_M = Number(process.env.RAIO_CHECKIN_M) || 300;

module.exports = { distanciaEmMetros, RAIO_PERMITIDO_M };
