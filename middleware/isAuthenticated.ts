import { NextApiRequest, NextApiResponse } from 'next';

const isAuthenticated = (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
  const loggedInUsername = req.cookies.loggedInUsername; // クッキーからログインユーザー名を取得
  if (loggedInUsername) {
    next(); // ログイン状態なので次のミドルウェアまたはハンドラを呼び出す
  } else {
    res.writeHead(302, { Location: '/auth/login' }); // ログインしていないのでログインページにリダイレクト
    res.end();
  }
};

export default isAuthenticated;