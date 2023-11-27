const SERVER = 'http://localhost:3001';

// FIXME:
// class AnnualLeaveExceededError extends Error { };

export async function urlaubEintragen(mitarbeiter: string): Promise<string> {
  const request = await fetch(
    `${SERVER}/urlaub-melden`,
    {
      method: 'POST',
      body: JSON.stringify({ mitarbeiter }),
      headers: { 'Content-Type': 'application/json' }
    },
  );
  const text = await request.text()

  // FIXME:
  // if (text.startsWith('Error: too much')) {
  //   throw new AnnualLeaveExceededError('Jetzt arbeite erstmal wieder.');
  // }

  return text;
}

export async function urlaubBestaetigen(mitarbeiter: string): Promise<string> {
  const request = await fetch(
    `${SERVER}/urlaub-bestaetigen/`,
    {
      method: 'POST',
      body: JSON.stringify({ mitarbeiter }),
      headers: { 'Content-Type': 'application/json' },
    })
  const text = await request.text()

  if (text.startsWith('Error')) {
    throw new Error('urlaubBestaetigen hat nicht geklappt.');
  }

  return text;
}

export async function urlaubAbsagen(mitarbeiter: string): Promise<string> {
  const request = await fetch(
    `${SERVER}/urlaub-absagen/`,
    {
      method: 'POST',
      body: JSON.stringify({ mitarbeiter }),
      headers: { 'Content-Type': 'application/json' },
    })
  const text = await request.text();

  if (text.startsWith('Error')) {
    throw new Error('urlaubAbsagen hat nicht geklappt.');
  }

  return text;
}

export async function sendMails(recipients: string[], mailOptions: any): Promise<string[]> {
  for (const recipient of recipients) {
    const request = await fetch(
      `${SERVER}/email/`,
      {
        method: 'POST',
        body: JSON.stringify({ ...mailOptions, to: recipient }),
        headers: { 'Content-Type': 'application/json' },
      })
    const text = await request.text();

    if (text.startsWith('Error')) {
      throw new Error('nono');
    }
  }
  return recipients;
}

