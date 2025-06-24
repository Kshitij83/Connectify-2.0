import React, { useEffect, useState } from 'react';
import Profiletile from './ProfileTile';
import axios from 'axios';

function AddFriend() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const response = await axios.get('http://localhost:5000/api/user/getusers', {
          headers: {
            Authorization: `Bearer ${token}`,
            userId: userId
          }
        });
        setUsers(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSearch = async (e) => {
    const searchValue = e.target.value;
    setSearch(searchValue);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      let response;
      if (searchValue === "") {
        response = await axios.get('http://localhost:5000/api/user/getusers', {
          headers: {
            Authorization: `Bearer ${token}`,
            userId: userId
          }
        });
      } else {
        response = await axios.get('http://localhost:5000/api/user/searchuser', {
          params: { search: searchValue },
          headers: {
            Authorization: `Bearer ${token}`,
            userId: userId
          }
        });
      }

      setUsers(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }



  if (error) {
    return <div>{error}</div>
  }

  return (
    <div className="p-4">
      <h1 className='font-bold text-3xl p-2'>Search for people:</h1>
      <div className='p-2'>
        <input
          className='w-[100%] bg-gray-600 rounded-xl p-2'
          placeholder='Search....'
          value={search}
          onChange={handleSearch}
        />
      </div>
      <div className='grid grid-cols-1 gap-5'>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : users.length > 0 ? (
        <div className='grid grid-cols-1 gap-5'>
          {users.map(user => (
            <Profiletile key={user._id} user={user} />
          ))}
        </div>
      ) : (
        <div>No user found</div>
      )}
      </div>
    </div>
  )
}

export default AddFriend;