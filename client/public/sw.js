/* eslint-disable no-restricted-globals */
console.log('Service Worker Loaded...');
self.addEventListener('push', function (event) {
    let data = {};

    try {
        // Parse o payload recebido
        data = event.data ? JSON.parse(event.data.text()) : {};
    } catch (error) {
        console.error('Erro ao analisar o payload da notificação:', error);
    }

    const title = data.notification?.title || 'Título padrão';
    const options = {
        body: data.notification?.body || 'Corpo padrão',
        icon: data.notification?.icon || 'https://cdn.worldvectorlogo.com/logos/claro-1.svg',
        image: data.notification?.image,
        vibrate: data.notification?.vibrate || [100, 50, 100],
        actions: data.notification?.actions || [],
        data: data.notification?.data.url || 'http://localhost:3000',
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
  console.log("Event: ", event.notification)

  if (event.notification?.actions[0].action === 'explore') {
    event.waitUntil(
      // eslint-disable-next-line no-undef
      clients.openWindow(event.notification.url)
    );
  } else {
    // Tratar cliques fora das ações
    console.log('Notificação clicada, mas sem ação específica.');
  }
  event.notification.close(); // Fecha a notificação
});

