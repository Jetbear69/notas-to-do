import React, { useState } from 'react'
import ProfileInfo from '../Cards/ProfileInfo'
import { useNavigate, useLocation } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';

const Navbar = ({ userInfo, onSearchNote, handleClearSearch, getAllNotes }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    } else {
      getAllNotes();
    }
  };

  const onClearSearch = () => {
    setSearchQuery('');
    handleClearSearch();
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow'>
        <div className='flex items-center justify-center'>
        <img src='./src/assets/images/icon.svg' alt='logo' className='w-6 h-6 mr-4' />
        <h2 className='text-2xl flex justify-center font-medium text-black py-2'>Notas</h2><h6 className='text-primary ml-1 flex justify-center py-2 font-medium text-xs'>TO-DO</h6></div>

        {!isAuthPage && (
          <SearchBar 
            value={searchQuery}
            onChange={({ target }) => {
              setSearchQuery(target.value);
            }}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />
        )}

        <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
    </div>
  );
};

export default Navbar;