
self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

// Recibir notificaciones push
self.addEventListener('push', event => {

    let datos = {
        title: 'Valle Entregas',
        body: 'Tienes una actualización de tu pedido.',
        url: './'
    };

    if (event.data) {
        try {
            datos = {
                ...datos,
                ...event.data.json()
            };
        } catch (e) {
            datos.body = event.data.text();
        }
    }

    event.waitUntil(
        self.registration.showNotification(datos.title, {
            body: datos.body,
            icon: './icon-192.png',
            badge: './icon-192.png',
            data: {
                url: datos.url || './'
            }
        })
    );
});

// Abrir Valle Entregas al tocar la notificación
self.addEventListener('notificationclick', event => {

    event.notification.close();

    const url = event.notification.data?.url || './';

    event.waitUntil(
        self.clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then(clients => {

            for (const client of clients) {
                if ('focus' in client) {
                    return client.focus();
                }
            }

            return self.clients.openWindow(url);
        })
    );
});
