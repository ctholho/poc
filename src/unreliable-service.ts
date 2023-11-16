import express, { Request, Response } from 'express';
import http from 'http';
import fs from 'fs';

const PORT = 3001;
const BASE_DIRECTORY = './sideeffects/';
// set default dir for fs

const app = express();
app.use(express.json());
const httpServer = http.createServer(app);
httpServer.listen(PORT, () => {
  console.log(`External sideeffects Server is running on http://localhost:${PORT}`);
});

function randomString() {
  return Math.random().toString(36).substring(7, 14)
}

/** Unreliably create a file with silly content */
app.post('/create-file/:fileName', async (req: Request, res: Response) => {
  const fileName = req.params.fileName;
  const suffix = randomString()
  const fileContent = 'boring is as boring does'

  try {
    await fs.promises.writeFile(`${BASE_DIRECTORY}${fileName}${suffix}`, fileContent);
  }
  catch (err) {
    return res.status(500).send(`Error while writing file ${fileName}.`);
  }
  res.send(`File saved ${fileName}`);
});

/** Unreliably read a file */
app.get('/read-file/:fileName', async (req: Request, res: Response) => {
  const fileName = req.params.fileName;
  const fail = Math.random() < 0.5;

  fs.readFile(`${BASE_DIRECTORY}${fileName}`, 'utf8', (err, data) => {
    if (err || fail) {
      console.log(err);
      res.status(500).send(`Error while reading file ${fileName}`);
    } else {
      res.send(data);
    }
  });
});
