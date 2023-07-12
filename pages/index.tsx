import { NextApiRequest, NextApiResponse, GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { format } from "date-fns";
import Cookies from "js-cookie"; 
import isAuthenticated from "../middleware/isAuthenticated";
import ConfirmationDialog from "../components/ConfirmationDialog";

interface Post {
  id: number;
  content: string;
  image: string;
  username: string;
  created_at: string;
}

const ListPage: NextPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loggedInUsername, setLoggedInUsername] = useState('');
  const router = useRouter();
  const content = router.query.content as string;
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [postToDeleteId, setPostToDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchUpdates();
  }, []);

  useEffect(() => {
        // Cookieからログインユーザー名を取得
        const storedUsername = Cookies.get('loggedInUsername');
        if (storedUsername) {
          const parsedUsername = JSON.parse(storedUsername);
          const username = parsedUsername.username;
          setLoggedInUsername(username);
        };
  }, []);

  // Cookieをログアウトして削除
  const handleLogoutCookieDelete = () => {
    Cookies.remove('loggedInUsername');
    router.push('/auth/login');
  }

  // 登録されている投稿を取得
  const fetchUpdates = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/snsposts/");
      const fetchedPosts: Post[] = response.data; // レスポンスのデータを投稿情報として取得

      const updatedPosts = fetchedPosts.map((post) => {
        const imagePath = post.image ? `${post.image}` : "";
        return { ...post, image: imagePath };
      });

      setPosts(updatedPosts);

      if (content) {
        setPosts((prevPosts) => [...prevPosts, { id: prevPosts.length + 1, content, image: "", username: "", created_at: "" }]);
      }
    } catch (error) {
      console.error("Failed to fetch updates:", error);
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      setShowConfirmation(false); // ポップアップを閉じる
      // ConfirmationDialogを表示するために、showConfirmationをtrueに設定
      setShowConfirmation(true);
      setPostToDeleteId(postId); // 削除する投稿のIDをセット
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };
  
  const handleConfirmDeletePost = async () => {
    try {
      setShowConfirmation(false); // ポップアップを閉じる
  
      const response = await axios.delete(`http://127.0.0.1:8000/snsposts/${postToDeleteId}/`);
      if (response.status === 204) {
        // 削除成功した場合、投稿を再取得して更新する
        handleCloseConfirmation();
        await fetchUpdates();
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  const formatCreatedAt = (createdAt: string) => {
    const date = new Date(createdAt);
    return format(date, "yyyy年M月d日 HH:mm"); // 例: 2023年6月26日 14:38
  };

  return (
    <div>
      <title>SNS 投稿一覧</title>
      <div className="flex justify-between items-center">
        <div className="flex flex-col justify-center h-32">
          <h1 className="text-3xl border-b-4 border-gray-300 mx-auto hover:text-gray-300 active:text-black"><a href="/">SNS 投稿一覧</a></h1>
        </div>
        <div className="flex justify-end items-center text-xl mr-5">
          <div className="rounded-full bg-gray-200 w-20 h-20 flex items-center justify-center mr-3">
            <div className="grid place-items-center h-full">
              <a href="" className="hover:text-white overflow-hidden text-center">{loggedInUsername}</a>
            </div>
          </div>
          <div className="rounded-full bg-gray-200 w-20 h-20 flex items-center justify-center">
            <p><a href="" onClick={handleLogoutCookieDelete} className="hover:text-white overflow-hidden text-center">ログアウト</a></p>
          </div>
        </div>
      </div>
      <div className="mb-5 border-b-2 border-gray-500 text-2xl">
        <p><a href="/createpage" className="hover:text-gray-300 active:text-black">新しい投稿をする</a></p>
      </div>
      <div className="flex justify-center">
        {posts.length > 0 ? (
          <ul>
            {posts.map((post) => (
              <li key={post.id}>
                <div className="w-screen px-10 border border-gray-500 border-dashed mb-5 rounded">
                  <p className="font-bold mb-3 break-words">{post.username}</p>
                  <p className="break-words whitespace-pre-wrap">{post.content}</p>
                  <div className="aspect-w-16 aspect-h-9">
                    {post.image && <img src={post.image} className="object-contain" />}
                  </div>
                  <p className="mt-2">投稿日時: {formatCreatedAt(post.created_at)}</p>
                  {loggedInUsername === post.username && (
                    <div>
                      <button 
                        onClick={() => handleDeletePost(post.id)} 
                        className="text-red-500 font-bold px-2 py-1 rounded-md mt-2 mb-2 border border-red-400 hover:border-2 active:border">投稿の削除
                      </button>
                        <ConfirmationDialog
                          open={showConfirmation}
                          message="この投稿を削除してもよろしいですか？"
                          onConfirm={() => handleConfirmDeletePost()}
                          onCancel={handleCloseConfirmation}
                        />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>投稿はまだありません。</p>
        )}
      </div>
    </div>
  );
};

export default ListPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const req = ctx.req as NextApiRequest;
  const res = ctx.res as NextApiResponse;
  isAuthenticated(req, res, () => {});
  // ミドルウェアによってログインが必要なページで実行される処理
  // ...

  return {
    props: {
      // ページコンポーネントに渡すプロパティ
      // ...
    },
  };
};