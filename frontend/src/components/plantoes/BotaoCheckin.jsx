import { useState } from 'react';
import { MapPin } from 'lucide-react';
import Button from '../ui/Button';

// Botão que pede a localização do navegador (GPS) e depois faz o check-in ou check-out
export default function BotaoCheckin({ rotulo = 'Check-in GPS', onLocalizado, onErro, variant = 'primary', icone = MapPin }) {
  const [localizando, setLocalizando] = useState(false);

  function capturar() {
    if (!navigator.geolocation) {
      onErro?.('Geolocalização não suportada neste navegador. Use o QR Code.');
      return;
    }
    setLocalizando(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await onLocalizado({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        } finally {
          setLocalizando(false);
        }
      },
      () => {
        setLocalizando(false);
        onErro?.('Não foi possível obter sua localização. Verifique a permissão do navegador ou use o QR Code.');
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }

  return <Button size="sm" variant={variant} icone={icone} onClick={capturar} carregando={localizando}>{rotulo}</Button>;
}
