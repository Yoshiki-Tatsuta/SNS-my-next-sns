import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     // ログイン成功時の処理
  //     // ログイン状態を維持し、ルートページにリダイレクト
  //     // ログイン成功時にのみリダイレクトするため、useEffect内で処理します
  //     Cookies.set('loggedInUsername', loggedInUsername, { expires: 1, path: '/' }); // ログインユーザ名をCookieに保存
  //     router.push('/');
  //   }
  // }, [isAuthenticated, loggedInUsername, router]);

  return (
    <div>
      <title>SNS ログインフォーム</title>
      <div className="flex  flex-col items-center justify-center text-3xl h-32">
        <h1>ログインしましょう</h1>
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
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-64 border border-gray-500 rounded"
        />
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
