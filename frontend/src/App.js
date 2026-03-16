import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';

// 全局样式
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  }
  
  body {
    background-color: #F4F7FC;
    color: #2D3748;
    line-height: 1.6;
  }
  
  a {
    text-decoration: none;
    color: inherit;
  }
  
  button {
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .loading {
    text-align: center;
    padding: 50px;
    color: #0A2463;
  }
  
  .error {
    color: #e53e3e;
    padding: 10px;
    margin: 10px 0;
    border-radius: 4px;
    background: #fef2f2;
  }
`;

// 主题配置
const theme = {
  colors: {
    primary: '#0A2463',
    secondary: '#D4AF37',
    light: '#F4F7FC',
    dark: '#2D3748',
    white: '#FFFFFF',
    success: '#38A169',
    border: '#E2E8F0',
  },
  spacing: {
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
  boxShadow: {
    soft: '0 2px 8px rgba(0, 0, 0, 0.08)',
    medium: '0 4px 12px rgba(0, 0, 0, 0.12)',
    hard: '0 8px 24px rgba(0, 0, 0, 0.15)',
  }
};

// 导航栏组件
const Navbar = ({ user, onLogout }) => {
  return (
    <div style={{
      backgroundColor: '#0A2463',
      color: 'white',
      padding: '16px 0',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '24px', fontWeight: '700', color: '#D4AF37' }}>TalentPro</span>
          <span style={{ fontSize: '12px', opacity: '0.8' }}>人才测评智能平台</span>
        </div>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '14px' }}>您好，{user.username}</span>
            <span style={{
              backgroundColor: user.role === 'admin' ? '#D4AF37' : '#38A169',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '500'
            }}>{user.role === 'admin' ? '管理员' : '测评用户'}</span>
            <button onClick={onLogout} style={{
              backgroundColor: 'transparent',
              color: 'white',
              border: '1px solid white',
              padding: '6px 12px',
              borderRadius: '4px'
            }}>退出</button>
          </div>
        )}
      </div>
    </div>
  );
};

// 登录页面
const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!username || !password) {
      setError('请输入用户名和密码');
      setLoading(false);
      return;
    }

    try {
      // 替换成你的Vercel后端地址（后面部署完再填）
      const res = await axios.post('https://talent-assessment-platform.vercel.app/api/auth/login', { 
        username, 
        password 
      });
      onLogin(res.data.user);
      setLoading(false);
      alert('登录成功！');
      res.data.user.role === 'admin' ? navigate('/admin') : navigate('/assessment');
    } catch (err) {
      setError(err.response?.data?.message || '登录失败，请检查账号密码');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        padding: '40px',
        width: '100%',
        maxWidth: '450px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ color: '#0A2463', fontSize: '32px', marginBottom: '8px' }}>TalentPro</h1>
          <p style={{ color: '#2D3748', opacity: '0.7' }}>专业人才测评智能平台</p>
        </div>
        
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#2D3748' }}>用户名</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名（如admin/user1）"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #E2E8F0',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#2D3748' }}>密码</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码（如admin123/user123）"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #E2E8F0',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#0A2463',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            {loading ? '登录中...' : '登录'}
          </button>
          
          <div style={{
            textAlign: 'center',
            fontSize: '12px',
            color: '#2D3748',
            opacity: '0.7',
            marginTop: '20px'
          }}>
            <p>默认账号：</p>
            <p>管理员：admin / admin123</p>
            <p>普通用户：user1 / user123</p>
          </div>
        </form>
      </div>
    </div>
  );
};

// 测评页面
const AssessmentPage = ({ user }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // 替换成你的Vercel后端地址（后面部署完再填）
        const res = await axios.get('https://talent-assessment-platform.vercel.app/api/question-banks');
        const mbtiBank = res.data.find(b => b.name === 'MBTI性格测评');
        setQuestions(mbtiBank?.questions || []);
      } catch (err) {
        console.error('获取题库失败:', err);
        alert('获取测评题库失败，请刷新重试');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      alert('请回答所有问题后提交！');
      return;
    }

    setSubmitting(true);
    try {
      const answerList = questions.map(q => ({
        questionId: q.id,
        selectedOption: answers[q.id],
        score: q.score[q.options.indexOf(answers[q.id])]
      }));

      // 替换成你的Vercel后端地址（后面部署完再填）
      const res = await axios.post('https://talent-assessment-platform.vercel.app/api/assessments/submit', {
        userId: user.id,
        assessmentType: 'MBTI',
        answers: answerList
      });

      setResult(res.data);
      alert('测评完成！请查看您的分析报告');
    } catch (err) {
      alert('提交失败：' + (err.response?.data?.message || '服务器错误'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">加载测评题库中...</div>;

  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ color: '#0A2463', fontSize: '28px', marginBottom: '8px' }}>MBTI性格测评</h2>
          <p style={{ color: '#2D3748', opacity: '0.7', maxWidth: '600px', margin: '0 auto' }}>基于荣格理论的专业16型人格测评，帮助您深入了解自我</p>
        </div>

        {!result ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
              {questions.map(q => (
                <div key={q.id} style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  padding: '24px',
                  borderLeft: '4px solid #0A2463'
                }}>
                  <h4 style={{ color: '#2D3748', marginBottom: '16px', fontSize: '16px' }}>{q.id}. {q.content}</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {q.options.map((opt, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input
                          type="radio"
                          id={`q${q.id}-${idx}`}
                          name={`q${q.id}`}
                          checked={answers[q.id] === opt}
                          onChange={() => setAnswers({ ...answers, [q.id]: opt })}
                          style={{ width: '18px', height: '18px', accentColor: '#0A2463' }}
                        />
                        <label htmlFor={`q${q.id}-${idx}`} style={{ fontSize: '14px', color: '#2D3748', cursor: 'pointer' }}>{opt}</label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting || Object.keys(answers).length !== questions.length}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#0A2463',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              {submitting ? '提交中...' : '提交测评'}
            </button>
          </>
        ) : (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
            padding: '32px',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: '#0A2463', fontSize: '20px', marginBottom: '16px' }}>您的MBTI测评结果</h3>
              <div style={{ fontSize: '36px', fontWeight: '700', color: '#D4AF37', marginBottom: '8px' }}>{result.finalResult}</div>
            </div>
            <div style={{ marginBottom: '24px', textAlign: 'left' }}>
              <h4 style={{ color: '#0A2463', marginBottom: '8px', fontSize: '16px' }}>性格分析：</h4>
              <p style={{ lineHeight: '1.8', color: '#2D3748' }}>{result.analysis}</p>
            </div>
            <div style={{
              fontSize: '12px',
              color: '#2D3748',
              opacity: '0.7',
              marginBottom: '24px',
              fontStyle: 'italic'
            }}>
              此测评结果仅供参考，如需深入解读，可联系专业顾问团队
            </div>
            <button onClick={() => setResult(null)} style={{
              padding: '10px 24px',
              backgroundColor: 'transparent',
              color: '#0A2463',
              border: '1px solid #0A2463',
              borderRadius: '4px',
              fontSize: '14px'
            }}>重新测评</button>
          </div>
        )}
      </div>
    </div>
  );
};

// 管理员页面
const AdminPage = ({ user }) => {
  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ color: '#0A2463', fontSize: '28px', marginBottom: '8px' }}>管理员控制台</h2>
          <p style={{ color: '#2D3748', opacity: '0.7', maxWidth: '600px', margin: '0 auto' }}>TalentPro 人才测评平台管理系统</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginTop: '40px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            padding: '32px',
            textAlign: 'center',
            transition: 'transform 0.3s ease'
          }} onMouseOver={(e) => e.target.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <h3 style={{ color: '#0A2463', fontSize: '18px', marginBottom: '8px' }}>题库管理</h3>
            <p style={{ color: '#2D3748', opacity: '0.7', fontSize: '14px', marginBottom: '24px', lineHeight: '1.6' }}>添加/编辑/删除测评题库，支持MBTI、领导力等测评类型</p>
            <button style={{
              padding: '8px 20px',
              backgroundColor: '#0A2463',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px'
            }}>进入管理</button>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            padding: '32px',
            textAlign: 'center',
            transition: 'transform 0.3s ease'
          }} onMouseOver={(e) => e.target.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
            <h3 style={{ color: '#0A2463', fontSize: '18px', marginBottom: '8px' }}>测评结果</h3>
            <p style={{ color: '#2D3748', opacity: '0.7', fontSize: '14px', marginBottom: '24px', lineHeight: '1.6' }}>查看所有用户的测评记录和结果分析，支持数据导出</p>
            <button style={{
              padding: '8px 20px',
              backgroundColor: '#0A2463',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px'
            }}>查看数据</button>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            padding: '32px',
            textAlign: 'center',
            transition: 'transform 0.3s ease'
          }} onMouseOver={(e) => e.target.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
            <h3 style={{ color: '#0A2463', fontSize: '18px', marginBottom: '8px' }}>用户管理</h3>
            <p style={{ color: '#2D3748', opacity: '0.7', fontSize: '14px', marginBottom: '24px', lineHeight: '1.6' }}>管理平台用户账号，分配角色权限，重置密码</p>
            <button style={{
              padding: '8px 20px',
              backgroundColor: '#0A2463',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px'
            }}>用户列表</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 主应用
const App = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
    alert('已成功退出登录');
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/login" element={
          user ? (
            <Navigate to={user.role === 'admin' ? '/admin' : '/assessment'} />
          ) : (
            <LoginPage onLogin={handleLogin} />
          )
        } />
        
        <Route path="/assessment" element={
          user ? <AssessmentPage user={user} /> : <Navigate to="/login" />
        } />
        
        <Route path="/admin" element={
          user?.role === 'admin' ? <AdminPage user={user} /> : <Navigate to="/login" />
        } />
        
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
};

// 主应用包装
const AppWrapper = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default AppWrapper;