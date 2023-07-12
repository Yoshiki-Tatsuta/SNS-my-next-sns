import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedInUsername, setLoggedInUsername] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', {
        username: username,
        password: password,
      });
  
      if (response.data.is_authenticated) {
        setIsAuthenticated(true);
        const userId = response.data.user_id;
        const loginUser = {
          username: username,
          user_id:userId,
        };
        Cookies.set('loggedInUsername', JSON.stringify(loginUser), { expires: 1, path: '/' }); // ユーザ名をCookieに保存
        router.push('/');
      } else {
        setLoginError('ユーザ名かパスワードが違います');
      }
    } catch (error) {
      console.error('Failed to login:', error);
      setLoginError('ユーザ名かパスワードが違います');
    }
  };

  useEffect(() => {
    const storedUsername = Cookies.get('loggedInUsername');
    if (storedUsername) {
      setLoggedInUsername(storedUsername);
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <title>SNS ログインフォーム</title>
      <div className='flex flex-col items-center justify-center h-32'>
          <h1 className=" text-3xl">ログインしましょう</h1>
      </div>
      <div className='flex justify-center'>
          <p>アカウントがない方は<a href='/auth/signup/' className='border-b-4 border-double border-black hover:text-gray-400'>こちら</a>から作成してください。</p>
      </div>
      <div className="flex flex-col items-center h-screen mt-10">
        <input
          type="text"
          placeholder="ユーザ名"
          value={username}  
          onChange={(e) => setUsername(e.target.value)}
          className="w-64 border border-gray-500 rounded"
        />
        <br />
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-64 border border-gray-500 rounded"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>
        <br />
        <button 
          type="button" 
          onClick={handleLogin} 
          className="w-20 border border-gray-500 bg-gray-300 hover:bg-gray-400 active:bg-gray-200 rounded-md">ログイン
        </button>
        <br />
        {loginError && <p className="text-red-500">{loginError}</p>}
      </div>
    </div>
  );
};

export default LoginForm;
