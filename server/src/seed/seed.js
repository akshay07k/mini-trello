import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Workspace from '../models/Workspace.js';
import Board from '../models/Board.js';
import List from '../models/List.js';
import Card from '../models/Card.js';
import { BASE_STEP, nextPosition } from '../utils/position.js';

dotenv.config();
await connectDB();

const run = async () => {
  await Promise.all([
    User.deleteMany({}),
    Workspace.deleteMany({}),
    Board.deleteMany({}),
    List.deleteMany({}),
    Card.deleteMany({})
  ]);

  const alice = await User.create({ name: 'Alice', email: 'alice@example.com', password: 'password' });
  const bob = await User.create({ name: 'Bob', email: 'bob@example.com', password: 'password' });

  const ws = await Workspace.create({ name: 'Acme Inc', owner: alice._id, members: [alice._id, bob._id] });

  const board = await Board.create({
    title: 'Product Roadmap',
    visibility: 'workspace',
    owner: alice._id,
    members: [alice._id, bob._id],
    workspace: ws._id
  });

  const backlog = await List.create({ title: 'Backlog', board: board._id, position: BASE_STEP });
  const inprog  = await List.create({ title: 'In Progress', board: board._id, position: BASE_STEP * 2 });
  const done    = await List.create({ title: 'Done', board: board._id, position: BASE_STEP * 3 });

  let pos = 0;
  await Card.create({
    title: 'Set up project',
    description: 'Initialize repo and CI',
    labels: ['setup'],
    assignees: [alice._id],
    listId: backlog._id,
    boardId: board._id,
    position: pos = nextPosition(pos)
  });
  await Card.create({
    title: 'Design ERD',
    description: 'Draw entities and relations',
    labels: ['design'],
    assignees: [bob._id],
    listId: backlog._id,
    boardId: board._id,
    position: pos = nextPosition(pos)
  });

  console.log('Seeded successfully.');
  await mongoose.disconnect();
};

run().catch(async (e) => { console.error(e); await mongoose.disconnect(); process.exit(1); });
