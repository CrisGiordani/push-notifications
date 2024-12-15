import express, { Request, Response } from 'express';
import cors from 'cors';
import webpush from 'web-push';
import encodeUrl from 'encodeurl';

const VAPID_PUBLIC_KEY = 'BDAFRkRYA-h4r0SFyAFvufV2JCeLE-aDXk8mq9BFZ2yPJsXjqvK2MJu2ilPwo9FDdjd6hdAZfrSs2qO0bXJSe1w';
const VAPID_PRIVATE_KEY = '2b4jM3cKmZZX2r9GA6XpKgGpHbVZyFhWI12I6WRklq0';
webpush.setVapidDetails('mailto:cristiangiordani@gmail.com', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

const app = express();

app.use(express.json());
app.use(cors({ origin: '*' }));

const subscriptions: any[] = [];  // Simulando um banco de dados

app.get('/', (req: Request, res: Response) => {
  res.status(200).json("Hello, World!");
});

app.get('/push/public_key', (req: Request, res: Response) => {
  res.status(200).json({ publicKey: VAPID_PUBLIC_KEY });
});

app.post('/push/register', (req: Request, res: Response) => {
  const subscription: webpush.PushSubscription = req.body;
  subscriptions.push(subscription);  // Salvando a inscrição
  console.log('Inscrição recebida:', subscriptions);
});

app.post('/push/send', async (req: Request, res: Response): Promise<any> => {
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

  Promise.all(subscriptions.map(sub => webpush.sendNotification(sub, notificationPayload )))
    .then(() => res.status(200).json({ message: 'Notificação enviada!', payload: notificationPayload }))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Iniciar o servidor
const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log('Lista de subscriptions:', subscriptions);
});
