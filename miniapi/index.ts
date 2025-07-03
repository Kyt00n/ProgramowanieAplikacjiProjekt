import express from 'express'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import cors from 'cors'
import mongoose, { Schema, Document } from "mongoose"
import { ProjectModel } from "./models/Project";
import { StoryModel } from "./models/Story";
import { TaskModel } from "./models/Task";

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

// Get a project by ID
app.get("/projects/:id", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const project = await ProjectModel.findOne({ id: Number(req.params.id), ownerId: userId });
  if (!project) return res.status(404).send("Project not found or not yours");
  res.json(project);
});

app.get("/stories", verifyToken, async (req, res) => {
  const stories = await StoryModel.find();
  res.json(stories);
});

// Get a story by ID
app.get("/stories/:id", verifyToken, async (req, res) => {
  const story = await StoryModel.findOne({ id: Number(req.params.id) });
  if (!story) return res.status(404).send("Story not found");
  res.json(story);
});

// Add a new story
app.post("/stories", verifyToken, async (req, res) => {
  const { name, description, priority, projectId, status, ownerId, dateOfCreation } = req.body;
  const last = await StoryModel.findOne().sort({ id: -1 });
  const newId = last ? last.id + 1 : 1;
  const story = new StoryModel({
    id: newId,
    name,
    description,
    priority,
    projectId,
    status,
    ownerId,
    dateOfCreation: dateOfCreation ? new Date(dateOfCreation) : new Date()
  });
  await story.save();
  res.status(201).json(story);
});

// Edit a story
app.put("/stories/:id", verifyToken, async (req, res) => {
  const { name, description, priority, projectId, status, ownerId, dateOfCreation } = req.body;
  const story = await StoryModel.findOneAndUpdate(
    { id: Number(req.params.id) },
    { name, description, priority, projectId, status, ownerId, dateOfCreation },
    { new: true }
  );
  if (!story) return res.status(404).send("Story not found");
  res.json(story);
});

// Delete a story
app.delete("/stories/:id", verifyToken, async (req, res) => {
  const result = await StoryModel.findOneAndDelete({ id: Number(req.params.id) });
  if (!result) return res.status(404).send("Story not found");
  res.sendStatus(204);
});
app.get("/tasks", verifyToken, async (req, res) => {
  // Optional: filter by storyId if provided as query param
  const { storyId } = req.query;
  let filter: any = {};
  if (storyId) filter.storyId = Number(storyId);
  const tasks = await TaskModel.find(filter);
  res.json(tasks);
});

// Get a task by ID
app.get("/tasks/:id", verifyToken, async (req, res) => {
  const task = await TaskModel.findOne({ id: Number(req.params.id) });
  if (!task) return res.status(404).send("Task not found");
  res.json(task);
});

// Add a new task
app.post("/tasks", verifyToken, async (req, res) => {
  const {
    name,
    description,
    storyId,
    priority,
    status,
    dateOfCreation,
    userId,
    dateStart,
    dateEnd,
    estimatedTime
  } = req.body;
  const last = await TaskModel.findOne().sort({ id: -1 });
  const newId = last ? last.id + 1 : 1;
  const task = new TaskModel({
    id: newId,
    name,
    description,
    storyId,
    priority,
    status,
    dateOfCreation: dateOfCreation ? new Date(dateOfCreation) : new Date(),
    userId,
    dateStart,
    dateEnd,
    estimatedTime
  });
  await task.save();
  res.status(201).json(task);
});

// Edit a task
app.put("/tasks/:id", verifyToken, async (req, res) => {
  const {
    name,
    description,
    storyId,
    priority,
    status,
    dateOfCreation,
    userId,
    dateStart,
    dateEnd,
    estimatedTime
  } = req.body;
  const task = await TaskModel.findOneAndUpdate(
    { id: Number(req.params.id) },
    {
      name,
      description,
      storyId,
      priority,
      status,
      dateOfCreation,
      userId,
      dateStart,
      dateEnd,
      estimatedTime
    },
    { new: true }
  );
  if (!task) return res.status(404).send("Task not found");
  res.json(task);
});

// Delete a task
app.delete("/tasks/:id", verifyToken, async (req, res) => {
  const result = await TaskModel.findOneAndDelete({ id: Number(req.params.id) });
  if (!result) return res.status(404).send("Task not found");
  res.sendStatus(204);
});

// Assign a task to a user
app.post("/tasks/:id/assign", verifyToken, async (req, res) => {
  const { userId } = req.body;
  const task = await TaskModel.findOneAndUpdate(
    { id: Number(req.params.id) },
    { userId },
    { new: true }
  );
  if (!task) return res.status(404).send("Task not found");
  res.json(task);
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