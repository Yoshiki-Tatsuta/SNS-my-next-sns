import { useState, useEffect } from "react";
import { NextApiRequest, NextApiResponse, GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Cookies from "js-cookie"; 
import axios from "axios";
import isAuthenticated from "../middleware/isAuthenticated";

const CreatePage = () => {
    const [postContent, setPostContent] = useState('');
    const [loggedInUsername, setLoggedInUsername] = useState('');
    const [loggedInUserId, setLoggedInUserId] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [postError, setPostError] = useState('');
    const router = useRouter();

    useEffect(() => {
        // Cookieからログインユーザー名を取得
        const storedUsername = Cookies.get('loggedInUsername');
        if (storedUsername) {
            const parsedUsername = JSON.parse(storedUsername);
            const username = parsedUsername.username;
            setLoggedInUsername(username);
          };
    }, []);

    useEffect(() => {
        const storedUserId = Cookies.get('loggedInUsername');
        if (storedUserId) {
            const parsedUserId = JSON.parse(storedUserId);
            const userId = parsedUserId.user_id;
            setLoggedInUserId(userId);
        };
    }, []);

    const handleLogoutCookieDelete = () => {
        Cookies.remove('loggedInUsername');
        router.push('/auth/login');
      }

    const handlePostSubmit = async () => {
        try {
            await createPost();
            router.push('/');
        } catch (error) {
            console.log('Failed to create post:', error);
            setPostError('投稿内容を入力してください');
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
          setSelectedImage(e.target.files[0]);
        }
      };

      const createPost = async () => {
        const formData = new FormData();
      
        formData.append('content', postContent);
      
        if (selectedImage) {
          formData.append('image', selectedImage);
        }
      
        formData.append('user', loggedInUserId);
      
        await axios.post('http://127.0.0.1:8000/snsposts/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      };

    return (
        <div>
            <title>SNS 新規投稿</title>
            <div className="flex justify-between items-center">
                <div className="flex flex-col justify-center h-32">
                    <h1 className="text-3xl border-b-4 border-gray-300 mx-auto hover:text-gray-300 active:text-black"><a href="/">新規作成</a></h1>
                </div>
                <div className="flex justify-end items-center text-xl mr-5 flex">
                    <div className="rounded-full bg-gray-200 w-20 h-20 flex items-center justify-center mr-3">
                        <p><a href="#" className="hover:text-white">{loggedInUsername}</a></p>
                    </div>
                    <div className="rounded-full bg-gray-200 w-20 h-20 flex items-center justify-center">
                        <p><a href="#" onClick={handleLogoutCookieDelete} className="hover:text-white">ログアウト</a></p>
                    </div>
                </div>
            </div>
            <div className="flex  flex-col items-center justify-center">
                <textarea 
                    value={postContent} 
                    onChange={(e) => setPostContent(e.target.value)} 
                    className="border border-gray-500 w-6/12 h-40 rounded" placeholder="投稿内容を入力してみよう" 
                />
                <br />
                <input type="file" onChange={handleImageChange} accept="image/*" />
                <br />
                <button 
                    onClick={handlePostSubmit} 
                    className="w-20 border border-gray-500 bg-gray-200 hover:bg-gray-300 active:bg-gray-200 rounded">投稿する
                </button>
                {postError && <p className="text-red-500 mt-5">{postError}</p>}
            </div>
        </div>
    );
};

export default CreatePage;

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