import express from 'express'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import cors from 'cors'
import mongoose, { Schema, Document } from "mongoose"
import { ProjectModel } from "./models/Project";
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
const app = express()
const port = 3000

const tokenSecret = process.env.TOKEN_SECRET as string
let refreshToken: string

// --- User Mongoose Model ---
interface IUser extends Document {
  id: number;
  login: string;
  name: string;
  surname: string;
  role: 'admin' | 'devops' | 'developer';
  password: string;
}

const UserSchema = new Schema<IUser>({
  id: { type: Number, required: true, unique: true },
  login: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  role: { type: String, enum: ['admin', 'devops', 'developer'], required: true },
  password: { type: String, required: true }
});

const UserModel = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
// --------------------------

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/mydb";
mongoose.connect(mongoUri)
  .then(() => {
    console.log("MongoDB connected!");
    // Insert test users if not present
    UserModel.countDocuments().then(count => {
      if (count === 0) {
        UserModel.insertMany([
          { id: 1, login: "adam", name: "Adam", surname: "Kowalczyk", role: "admin", password: "adminpass" },
          { id: 2, login: "bartek", name: "Bartek", surname: "Kowalski", role: "devops", password: "devopspass" },
          { id: 3, login: "celina", name: "Celina", surname: "Wrona", role: "developer", password: "devpass" },
          { id: 4, login: "daniel", name: "Daniel", surname: "Góra", role: "developer", password: "devpass" },
          { id: 5, login: "eryk", name: "Eryk", surname: "Olsza", role: "developer", password: "devpass" }
        ]).then(() => {
          console.log("Test users inserted.");
        });
      } else {
        console.log("Users already exist, skipping test user insert.");
      }
    });
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World - simple api with JWT!')
})

app.post(
  "/token",
  function (req, res) {
    const expTime = req.body.exp || 60
    const token = generateToken(+expTime)
    refreshToken = generateToken(60 * 60)
    res.status(200).send({ token, refreshToken })
  }
)
app.post(
  "/refreshToken",
  function (req, res) {
    const refreshTokenFromPost = req.body.refreshToken
    if (refreshToken !== refreshTokenFromPost) {
      res.status(400).send('Bad refresh token!')
    }
    const expTime = req.headers.exp || 60
    const token = generateToken(+expTime)
    refreshToken = generateToken(60 * 60)
    setTimeout(() => {
      res.status(200).send({ token, refreshToken })
    }, 3000)
  }
)
app.get(
  "/protected/:id/:delay?",
  verifyToken,
  (req, res) => {
    const id = req.params.id
    const delay = req.params.delay ? +req.params.delay : 1000
    setTimeout(() => {
      res.status(200).send(`{"message": "protected endpoint ${id}"}`)
    }, delay)
  }
)
app.post("/login", async (req, res) => {
  const { login, password } = req.body;
  const user = await UserModel.findOne({ login, password });
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = generateToken(3600); // 1 hour expiration
  res.json({ user, token });
});

// Get all projects for the logged-in user
app.get("/projects", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const projects = await ProjectModel.find({ ownerId: userId });
  res.json(projects);
});

// Add a new project
app.post("/projects", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { name, description } = req.body;
  // Generate a new id (you may want to use MongoDB's _id instead)
  const last = await ProjectModel.findOne().sort({ id: -1 });
  const newId = last ? last.id + 1 : 1;
  const project = new ProjectModel({ id: newId, name, description, ownerId: userId });
  await project.save();
  res.status(201).json(project);
});

// Edit a project
app.put("/projects/:id", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { name, description } = req.body;
  const project = await ProjectModel.findOneAndUpdate(
    { id: Number(id), ownerId: userId },
    { name, description },
    { new: true }
  );
  if (!project) return res.status(404).send("Project not found or not yours");
  res.json(project);
});

// Delete a project
app.delete("/projects/:id", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const result = await ProjectModel.findOneAndDelete({ id: Number(id), ownerId: userId });
  if (!result) return res.status(404).send("Project not found or not yours");
  res.sendStatus(204);
});

function generateToken(expirationInSeconds: number) {
  const exp = Math.floor(Date.now() / 1000) + expirationInSeconds
  const token = jwt.sign({ exp, foo: 'bar' }, tokenSecret, { algorithm: 'HS256' })
  return token
}

function verifyToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization']
  const token = authHeader?.split(' ')[1]

  if (!token) return res.sendStatus(403)

  jwt.verify(token, tokenSecret, (err: any, user: any) => {
    if (err) {
      console.log(err)
      return res.status(401).send(err.message)
    }
    req.user = user; // Attach user info to request
    next()
  })
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})