// Service worker do Home Care Flow (o que faz o sistema funcionar como app no celular).
// Estratégia:
// - páginas: tenta a internet primeiro; sem internet, abre a última versão salva do app;
// - arquivos do build (/assets/...): usa o que já está salvo (os nomes mudam a cada versão);
// - chamadas da API NÃO passam por aqui (dados sempre atualizados, nada sensível fica guardado).
const VERSAO = 'hcf-v2';
const ARQUIVOS_BASE = ['/', '/index.html', '/manifest.webmanifest', '/favicon.png', '/icone-192.png', '/icone-512.png'];

self.addEventListener('install', (evento) => {
  evento.waitUntil(caches.open(VERSAO).then((cache) => cache.addAll(ARQUIVOS_BASE)));
  self.skipWaiting();
});

// Ao ativar uma versão nova, apaga os caches antigos
self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys()
      .then((nomes) => Promise.all(nomes.filter((n) => n !== VERSAO).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (evento) => {
  const { request } = evento;
  const url = new URL(request.url);

  // Só cuido de GET do próprio site; API (outro domínio) e POST/PUT passam direto
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // Navegação (abrir /escalas, /plantoes...): internet primeiro, cópia salva se estiver offline
  if (request.mode === 'navigate') {
    evento.respondWith(
      fetch(request)
        .then((resposta) => {
          const copia = resposta.clone();
          caches.open(VERSAO).then((cache) => cache.put('/index.html', copia));
          return resposta;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Arquivos estáticos: cache primeiro, e guarda o que buscar da internet
  if (url.pathname.startsWith('/assets/') || ARQUIVOS_BASE.includes(url.pathname)) {
    evento.respondWith(
      caches.match(request).then((salvo) => salvo || fetch(request).then((resposta) => {
        if (resposta.ok) {
          const copia = resposta.clone();
          caches.open(VERSAO).then((cache) => cache.put(request, copia));
        }
        return resposta;
      }))
    );
  }
});
