async function testDebug() {
  const r = await fetch('http://127.0.0.1:9223/json');
  const list = await r.json();
  const page = list.find(p => p.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);

  const send = (method, params = {}) => new Promise((resolve) => {
    const id = Math.floor(Math.random() * 1000000);
    const handler = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.id === id) {
        ws.removeEventListener('message', handler);
        resolve(data.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });

  ws.onopen = async () => {
    await send('Runtime.enable');
    await send('Page.enable');

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.method === 'Runtime.consoleAPICalled') {
        console.log('BROWSER LOG:', data.params.type, data.params.args.map(a => a.value || a.description).join(' '));
      }
      if (data.method === 'Runtime.exceptionThrown') {
        console.log('EXCEPTION:', JSON.stringify(data.params.exceptionDetails));
      }
    };

    await send('Runtime.evaluate', { expression: `localStorage.clear(); location.reload();` });
    await new Promise(res => setTimeout(res, 800));

    // Try accessing #home
    await send('Runtime.evaluate', { expression: `location.hash = 'home';` });
    await new Promise(res => setTimeout(res, 300));

    // Now submit login form
    const submitRes = await send('Runtime.evaluate', {
      expression: `
        try {
          document.getElementById('loginEmail').value = 'test@example.com';
          document.getElementById('loginPassword').value = '123456';
          var form = document.getElementById('formLogin');
          form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
          ({
            appHidden: document.getElementById('app').hidden,
            landingHidden: document.getElementById('landing').hidden,
            hash: location.hash
          })
        } catch(e) {
          ({ error: e.message })
        }
      `,
      returnByValue: true
    });
    console.log('Submit result:', submitRes.result.value);

    process.exit(0);
  };
}

testDebug();
