import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const navLinkStyles = 'inline-flex justify-center items-center bg-gray-100 hover:bg-gray-200 hover:border-gray-400 disabled:opacity-50 px-3 border border-gray-300 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 h-9 font-label font-medium text-sm whitespace-nowrap transition-colors disabled:pointer-events-none'

export default function Navbar () {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <nav className='flex justify-between items-start mb-11'>
        <div className='flex gap-4'>
          {isAuthenticated && (
            <div className='flex flex-col gap-2'>
              <NavLink className={navLinkStyles} to='/create'>
                <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span className="uppercase">Create Employee</span>
              </NavLink>
              <NavLink className={navLinkStyles} to='/'>
                <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="uppercase">See Employees</span>
              </NavLink>
            </div>
          )}
        </div>
        
        <div className='flex flex-col items-end gap-2'>
          {isAuthenticated ? (
            <>
              <span className='text-gray-600 text-sm italic'>
                Welcome, {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className='bg-white hover:bg-slate-100 disabled:opacity-50 px-3 border border-gray-300 hover:border-gray-400 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 h-9 font-label font-medium text-sm whitespace-nowrap transition-colors disabled:pointer-events-none'
              >
                <span className="uppercase">Logout</span>
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
