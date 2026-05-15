import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import diaryRoutes from './routes/diary';
import treeholeRoutes from './routes/treehole';
import analysisRoutes from './routes/analysis';
import partnershipRoutes from './routes/partnership';
import dashboardRoutes from './routes/dashboard';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/diary', diaryRoutes);
app.use('/api/treehole', treeholeRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/partnership', partnershipRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;
