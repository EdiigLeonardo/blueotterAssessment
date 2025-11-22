import { Link, NavLink } from 'react-router-dom'
import { Button } from '../ui/button'

export default function Header() {
  return (
    <header className="shadow-md flex justify-between align-center w-full">
      <div className="flex items-center justify-between h-14 w-screen px-2">
        <Link to="/" className="font-semibold">BlueOtter</Link>
        <nav className="flex justify-between align-center gap-3 text-sm py-4">
          <NavLink to="/sync-user" className={({ isActive }) => isActive ? 'text-indigo-600' : ''}>Sync User</NavLink>
          <NavLink to="/sync-repo" className={({ isActive }) => isActive ? 'text-indigo-600' : ''}>Sync Repo</NavLink>
          <NavLink to="/user-repos" className={({ isActive }) => isActive ? 'text-indigo-600' : ''}>User Repos</NavLink>
          <NavLink to="/search" className={({ isActive }) => isActive ? 'text-indigo-600' : ''}>Search</NavLink>
          <NavLink to="/stats" className={({ isActive }) => isActive ? 'text-indigo-600' : ''}>Stats</NavLink>
        </nav>
        <Button variant="outline">
          <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
        </Button>
      </div>
    </header>
  )
}