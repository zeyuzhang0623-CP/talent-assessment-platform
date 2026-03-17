const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 配置CORS（允许你的前端访问，替换成你的GitHub用户名）
const corsOptions = {
  origin: [
    'http://localhost:3000',
    // 替换成：https://zeyuzhang0623-CP.github.io
    'https://zeyuzhang0623-CP.github.io'
  ],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// 连接MongoDB数据库
mongoose.connect(mongodb+srv://zeyuzhang0623_db_user:zzy880623@cluster0.fq4v4vl.mongodb.net/?appName=Cluster0)
  .then(() => console.log('MongoDB连接成功 ✅'))
  .catch(err => console.error('MongoDB连接失败 ❌:', err));

// 1. 定义数据模型
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

const QuestionBankSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  questions: [{
    id: { type: Number, required: true },
    content: { type: String, required: true },
    options: [{ type: String, required: true }],
    score: { type: Array }
  }]
});

const AssessmentResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assessmentType: { type: String, required: true },
  answers: [{ questionId: Number, selectedOption: String, score: Number }],
  finalResult: { type: String },
  analysis: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// 创建模型
const User = mongoose.model('User', UserSchema);
const QuestionBank = mongoose.model('QuestionBank', QuestionBankSchema);
const AssessmentResult = mongoose.model('AssessmentResult', AssessmentResultSchema);

// 2. 初始化默认数据
async function initDefaultData() {
  // 创建默认管理员账号（你可以改用户名/密码）
  const adminUser = await User.findOne({ username: 'admin' });
  if (!adminUser) {
    await User.create({
      username: 'admin',       // 管理员用户名（可改）
      password: 'admin123',    // 管理员密码（可改）
      role: 'admin'
    });
    console.log('默认管理员账号：admin/admin123');
  }

  // 创建默认普通用户
  const normalUser = await User.findOne({ username: 'user1' });
  if (!normalUser) {
    await User.create({
      username: 'user1',       // 普通用户用户名（可改）
      password: 'user123',     // 普通用户密码（可改）
      role: 'user'
    });
    console.log('默认普通用户：user1/user123');
  }

  // 创建MBTI题库
  const mbtiBank = await QuestionBank.findOne({ name: 'MBTI性格测评' });
  if (!mbtiBank) {
    await QuestionBank.create({
      name: 'MBTI性格测评',
      description: '16型人格测评（简化版）',
      questions: [
        { id: 1, content: '你更倾向于？', options: ['独处充电', '社交充电'], score: [1, 3] },
        { id: 2, content: '你获取信息的方式？', options: ['关注具体事实', '关注抽象概念'], score: [1, 3] },
        { id: 3, content: '你做决策的依据？', options: ['逻辑分析', '情感感受'], score: [1, 3] },
        { id: 4, content: '你喜欢的生活方式？', options: ['计划有序', '灵活随性'], score: [1, 3] }
      ]
    });
    console.log('MBTI题库创建成功');
  }
}

// 3. 核心接口
// 登录接口
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: '用户不存在' });
    if (password !== user.password) return res.status(401).json({ message: '密码错误' });
    res.json({ 
      token: 'mock_token_' + user._id, 
      user: { id: user._id, username: user.username, role: user.role } 
    });
  } catch (err) {
    res.status(500).json({ message: '登录失败', error: err.message });
  }
});

// 获取题库
app.get('/api/question-banks', async (req, res) => {
  try {
    const banks = await QuestionBank.find();
    res.json(banks);
  } catch (err) {
    res.status(500).json({ message: '获取题库失败', error: err.message });
  }
});

// 提交测评
app.post('/api/assessments/submit', async (req, res) => {
  try {
    const { userId, assessmentType, answers } = req.body;
    // MBTI计算逻辑
    const dimensions = { E:0,I:0,S:0,N:0,T:0,F:0,J:0,P:0 };
    answers.forEach(ans => {
      switch(ans.questionId % 4) {
        case 1: ans.score > 2 ? dimensions.E++ : dimensions.I++; break;
        case 2: ans.score > 2 ? dimensions.S++ : dimensions.N++; break;
        case 3: ans.score > 2 ? dimensions.T++ : dimensions.F++; break;
        case 0: ans.score > 2 ? dimensions.J++ : dimensions.P++; break;
      }
    });
    const finalResult = (dimensions.E > dimensions.I?'E':'I') + (dimensions.S > dimensions.N?'S':'N') + (dimensions.T > dimensions.F?'T':'F') + (dimensions.J > dimensions.P?'J':'P');
    // MBTI分析
    const analysisMap = {
      'INTJ': '建筑师型：逻辑强，专注目标',
      'ENFP': '竞选者型：热情，富有创造力',
      'ISFJ': '守卫者型：负责，乐于助人',
      'ESTP': '企业家型：务实，适应力强'
    };
    const analysis = analysisMap[finalResult] || '你的性格均衡，综合特质明显';
    // 保存结果
    const result = await AssessmentResult.create({
      userId, assessmentType, answers, finalResult, analysis
    });
    res.json({ finalResult, analysis, id: result._id });
  } catch (err) {
    res.status(500).json({ message: '提交失败', error: err.message });
  }
});

// 4. 启动服务器
(async () => {
  await initDefaultData();
  app.listen(PORT, () => {
    console.log(`后端服务器运行在 http://localhost:${PORT}`);
  });
})();
