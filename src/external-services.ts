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

/** Unreliably create a file with silly content */
app.post('/create-file/:file_name', async (req: Request, res: Response) => {
  const failTooLate = Math.random() > 0.5;
  const fileName = req.params.file_name;
  const suffix = `-${Math.random().toString(36).substring(7, 14)}`
  const fileContent = `lol ${Math.random().toString(36).substring(7, 14)}`;
  fs.writeFile(`${BASE_DIRECTORY}${fileName}${suffix}`, fileContent, (err) => {
    if (err || failTooLate) throw err;
    res.send(`File saved ${fileName}`);
  });
});

/** Unreliably read a file */
app.get('/read-file/:file_name', async (req: Request, res: Response) => {
  const fileName = req.params.file_name;
  const fail = Math.random() > 0.5;
  fs.readFile(`${BASE_DIRECTORY}${fileName}`, 'utf8', (err, data) => {
    if (err || fail) {
      console.log(err);
      res.status(500).send(`Error while reading file ${fileName}`);
    } else {
      res.send(data);
    }
  });
});
