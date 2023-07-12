import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [messages, setMessages] = useState('');
  const [errorMessages, setErrorMessages] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/api/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // アカウント作成成功の処理
        console.log('アカウントが作成されました。');
        setMessages('アカウントが作成されました。');
      } else if (response.status === 500) {
        // アカウント作成失敗（すでに存在する場合）の処理
        console.error('アカウント作成に失敗しました。すでにアカウントが存在しています。');
        setErrorMessages('アカウント作成に失敗しました。すでにアカウントが存在しています。');
      } else {
        // アカウント作成失敗の処理
        console.error('アカウント作成に失敗しました。');
        setErrorMessages('アカウント作成に失敗しました。ユーザ名、パスワードを入力してください。');
      }
    } catch (error) {
      console.error('エラーが発生しました:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div> 
        <title>アカウント作成</title>
        <div className='flex flex-col items-center justify-center h-32'>
            <h1 className=" text-3xl">SNS アカウント作成</h1>
        </div>
        <div className='flex justify-center'>
            <p>ログイン画面に<a href='/auth/login'className='border-b-4 border-double border-black hover:text-gray-400'>戻る</a></p>
        </div>
        <div className="flex flex-col items-center h-screen mt-10">
            <form onSubmit={handleSubmit}>
                <label>
                ユーザ名
                <br />
                  <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-64 border border-gray-500 rounded mb-5"
                  />
                </label>
                <br />
                <div className="relative">
                  <label>
                  パスワード
                  <br />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-64 border border-gray-500 rounded mb-5"
                    />
                  </label>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={togglePasswordVisibility}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
                <br />
                <button 
                    type="submit"
                    className="w-20 border border-gray-500 bg-gray-300 hover:bg-gray-400 active:bg-gray-200 rounded-md mb-5">作成
                </button>
            </form>
            {messages && <p>{messages}  ログイン画面に戻って<a href='/auth/login'className='border-b-4 border-double border-black hover:text-gray-400'>ログイン</a>しましょう。</p>}
            {errorMessages && <p className="text-red-500">{errorMessages}</p>}
        </div>
    </div>
  );
};

export default SignupPage;
