"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const web_push_1 = __importDefault(require("web-push"));
const VAPID_PUBLIC_KEY = 'BDAFRkRYA-h4r0SFyAFvufV2JCeLE-aDXk8mq9BFZ2yPJsXjqvK2MJu2ilPwo9FDdjd6hdAZfrSs2qO0bXJSe1w';
const VAPID_PRIVATE_KEY = '2b4jM3cKmZZX2r9GA6XpKgGpHbVZyFhWI12I6WRklq0';
web_push_1.default.setVapidDetails('mailto:cristiangiordani@gmail.com', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: '*' }));
const subscriptions = []; // Simulando um banco de dados
app.get('/push/public_key', (req, res) => {
    res.status(200).json({ publicKey: VAPID_PUBLIC_KEY });
});
app.post('/push/register', (req, res) => {
    const subscription = req.body;
    subscriptions.push(subscription); // Salvando a inscrição
    console.log('Inscrição recebida:', subscriptions);
});
app.post('/push/send', async (req, res) => {
    const payload = req.body;
    const notificationPayload = JSON.stringify({
        notification: {
            title: payload.notification.title,
            body: payload.notification.body,
            icon: 'https://cdn.worldvectorlogo.com/logos/claro-1.svg',
            image: payload.notification.image,
            vibrate: [100, 50, 100],
            actions: [
                { action: 'explore', title: 'Conferir' },
            ],
            data: {
                url: payload.notification.data, // URL para abrir
            },
        },
    });
    Promise.all(subscriptions.map(sub => web_push_1.default.sendNotification(sub, notificationPayload)))
        .then(() => res.status(200).json({ message: 'Notificação enviada!', payload: notificationPayload }))
        .catch(err => res.status(500).json({ error: err.message }));
});
// Iniciar o servidor
const PORT = 3333;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log('Lista de subscriptions:', subscriptions);
});
