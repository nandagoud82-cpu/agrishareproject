import { Bell, Search } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getInitials, capitalize } from '../../utils/helpers';

export default function Navbar({ title = '', subtitle = '' }) {
  const { user } = useAuth();

  return (
    <header className="top-header">
      <div>
        {title && (
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--green-900)', lineHeight: 1.2 }}>
            {title}
          </h1>
        )}
        {subtitle && (
          <p style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>{subtitle}</p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Notification bell */}
        <button
          style={{
            background: 'var(--gray-100)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            width: 38,
            height: 38,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--gray-600)',
            transition: 'var(--transition)',
            position: 'relative',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--green-100)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--gray-100)'}
        >
          <Bell size={16} />
          <span style={{
            position: 'absolute', top: 7, right: 7,
            width: 7, height: 7,
            background: 'var(--green-500)',
            borderRadius: '50%',
            border: '1.5px solid white',
          }} />
        </button>

        {/* User pill */}
        {user && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'var(--green-50)',
            border: '1.5px solid var(--green-200)',
            borderRadius: 'var(--radius-full)',
            padding: '5px 14px 5px 6px',
            cursor: 'pointer',
          }}>
            <div style={{
              width: 30, height: 30,
              background: 'var(--green-600)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: 12,
              flexShrink: 0,
            }}>
              {getInitials(user.name)}
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-800)', lineHeight: 1.2 }}>
                {user.name.split(' ')[0]}
              </p>
              <p style={{ fontSize: 11, color: 'var(--green-600)', textTransform: 'capitalize' }}>
                {user.role}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
