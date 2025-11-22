import { Routes, Route } from 'react-router-dom'
import SyncUserPage from '../pages/SyncUserPage'
import SyncRepoPage from '../pages/SyncRepoPage'
import UserReposPage from '../pages/UserReposPage'
import SearchPage from '../pages/SearchPage'
import StatsPage from '../pages/StatsPage'
import NotFoundPage from '../pages/NotFoundPage'
import HomePage from '../pages/HomePage'

export default function RoutesProvider(){
    return( 
        <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/sync-user" element={<SyncUserPage />} />
            <Route path="/sync-repo" element={<SyncRepoPage />} />
            <Route path="/user-repos" element={<UserReposPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="*" element={<NotFoundPage />} />
      </Routes>
    )
}
