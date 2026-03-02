import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import logo from '../public/images/g.gif'

const navLinkStyles =
  'inline-flex items-center justify-center px-3 font-medium transition-colors border rounded-md whitespace-nowrap text-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-input bg-background hover:bg-slate-100 h-9'

export default function Navbar () {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <nav className='flex justify-between items-center mb-11'>
        <div className='flex gap-4'>
          {isAuthenticated && (
            <>
              <NavLink className={navLinkStyles} to='/'>
                <img alt='MongoDB logo' src={logo} style={{ maxHeight: '30px' }} />
                See Employees
              </NavLink>
              <NavLink className={navLinkStyles} to='/create'>
                <img alt='MongoDB logo' src={logo} style={{ maxHeight: '30px' }} />
                Create Employee
              </NavLink>
            </>
          )}
        </div>
        
        <div className='flex items-center gap-4'>
          {isAuthenticated ? (
            <>
              <span className='text-gray-600 text-sm'>
                Welcome, {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className='inline-flex justify-center items-center bg-background hover:bg-slate-100 disabled:opacity-50 px-3 border border-input rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-background focus-visible:ring-offset-2 h-9 font-medium text-md whitespace-nowrap transition-colors disabled:pointer-events-none'
              >
                Logout
              </button>
            </>
          ) : (
            <div className='flex gap-2'>
              <NavLink className={navLinkStyles} to='/login'>
                Login
              </NavLink>
              <NavLink className={navLinkStyles} to='/register'>
                Register
              </NavLink>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}
