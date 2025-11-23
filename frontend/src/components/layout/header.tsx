import { Link, NavLink } from 'react-router-dom'
import { Button } from '../ui/button'

export default function Header() {
  return (
    <header className="shadow-md flex justify-between align-center w-full">
      <div className="flex items-center justify-between h-14 w-screen px-2">
        <Link to="/" className="font-semibold flex justify-center align-center">
          <img className="pl-15 h-10 aspect-auto rounded-full" src="/blueotter.png" alt="blueotter logo" />
        </Link>
        <nav className="flex justify-between align-center gap-3 w-1/2 text-sm py-4">
          <NavLink to="/sync-user" className={({ isActive }) => isActive ? 'text-[#1ab7ea]' : ''}>Sync User</NavLink>
          <NavLink to="/sync-repo" className={({ isActive }) => isActive ? 'text-[#1ab7ea]' : ''}>Sync Repo</NavLink>
          <NavLink to="/user-repos" className={({ isActive }) => isActive ? 'text-[#1ab7ea]' : ''}>User Repos</NavLink>
          <NavLink to="/search" className={({ isActive }) => isActive ? 'text-[#1ab7ea]' : ''}>Search</NavLink>
          <NavLink to="/stats" className={({ isActive }) => isActive ? 'text-[#1ab7ea]' : ''}>Stats</NavLink>
        </nav>
        <div className="ml-15">
          <Button variant="outline">
            <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
          </Button>
        </div>
      </div>
    </header>
  )
}
