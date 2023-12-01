

import express, { Request, Response, Express } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

const app: Express = express();

app.use(cors());
app.use(express.json());



interface User {
  email: string;
  number: string;
}

const usersFilePath: string = path.join(__dirname, 'index.json');
const usersJson: string = fs.readFileSync(usersFilePath, 'utf-8');
const usersObj: User[] = JSON.parse(usersJson);

app.post('/', (req: Request, res: Response) => {
  const { email, number }: { email: string; number?: string } = req.body;
  const users: User[] = usersObj.filter((item: User) => {
    if (number) {
      return item.email === email && item.number === number;
    } else {
      return item.email === email;
    }
  });

  setTimeout(() => {
    users && res.json(users);
    console.log(users);
  }, 5000); 

});

const PORT = process.env.PORT || 3040;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


