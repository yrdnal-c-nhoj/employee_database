import { NavLink } from 'react-router-dom'
import logo from '../public/images/g.gif'

const navLinkStyles =
  'inline-flex items-center justify-center px-3 font-medium transition-colors border rounded-md whitespace-nowrap text-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-input bg-background hover:bg-slate-100 h-9'

export default function Navbar () {
  return (
    <div>
      <nav className='inline justify-between items-center mb-11'>
        <NavLink className={navLinkStyles} to='/create'>
          <img alt='MongoDB logo' src={logo} style={{ maxHeight: '30px' }} />
          Create E mployee
        </NavLink>
        <br />
        <NavLink className={navLinkStyles} to='/'>
          <img alt='MongoDB logo' src={logo} style={{ maxHeight: '30px' }} />
          See Employees{' '}
        </NavLink>
      </nav>
    </div>
  )
}
