import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      navigate('/list');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 50%, #1a8a7a 100%)',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        margin: '1rem',
        background: 'rgba(255,255,255,0.97)',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        overflow: 'hidden',
      }}>
        {/* Header band */}
        <div style={{
          background: 'linear-gradient(90deg, #1e3a5f, #2d6a9f)',
          padding: '2rem 2rem 1.5rem',
          textAlign: 'center',
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '1.6rem',
          }}>
            👤
          </div>
          <h1 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>
            Employee Insights
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
            Sign in to your dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate style={{ padding: '2rem' }}>

          {/* Username */}
          <div style={{ marginBottom: '1.2rem' }}>
            <label htmlFor="username" style={{
              display: 'block',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.4rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              placeholder="Enter your username"
              style={{
                width: '100%',
                padding: '0.7rem 1rem',
                border: '1.5px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.95rem',
                color: '#111827',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={e => (e.target.style.borderColor = '#2d6a9f')}
              onBlur={e => (e.target.style.borderColor = '#d1d5db')}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.2rem' }}>
            <label htmlFor="password" style={{
              display: 'block',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.4rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  padding: '0.7rem 2.8rem 0.7rem 1rem',
                  border: '1.5px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  color: '#111827',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={e => (e.target.style.borderColor = '#2d6a9f')}
                onBlur={e => (e.target.style.borderColor = '#d1d5db')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  color: '#6b7280',
                  padding: 0,
                  lineHeight: 1,
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div role="alert" style={{
              background: '#fef2f2',
              border: '1px solid #fca5a5',
              borderRadius: '8px',
              padding: '0.6rem 0.9rem',
              color: '#dc2626',
              fontSize: '0.85rem',
              marginBottom: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.8rem',
              background: 'linear-gradient(90deg, #1e3a5f, #2d6a9f)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.03em',
            }}
            onMouseEnter={e => ((e.target as HTMLButtonElement).style.opacity = '0.85')}
            onMouseLeave={e => ((e.target as HTMLButtonElement).style.opacity = '1')}
          >
            Sign In →
          </button>

        </form>
      </div>
    </div>
  );
}

export default LoginPage;
