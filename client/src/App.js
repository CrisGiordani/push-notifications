navigator.serviceWorker.register('/sw.js')
  .then(async serviceWorker => {
    let subscription = await serviceWorker.pushManager.getSubscription();

    if(!subscription) {

      const responsePublicKey = await fetch('https://website-cuby-push-notification-back.jschbl.easypanel.host/push/public_key', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        return response.json();
      });

      console.log("Public Key:", responsePublicKey.publicKey);

      subscription = await serviceWorker.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: responsePublicKey.publicKey
      });
    }

    await fetch('https://website-cuby-push-notification-back.jschbl.easypanel.host/push/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(subscription)
    });
  });

const App = () => {
  return <div className="App">Aplicativo React com Notificações Push!</div>;
};

export default App;
