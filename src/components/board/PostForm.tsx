'use client';

import { useState } from 'react';
import { useCreatePost } from '@/hooks/board/useBoards';
import { Board } from '@/types/board';
import { User } from '@/types/user';

interface PostFormProps {
  board: Board;
  onSuccess: () => void;
  user: User | null;
}

export default function PostForm({ board, onSuccess, user }: PostFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    authorName: '',
    password: '',
  });

  const createPost = useCreatePost(onSuccess);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPost.mutate({
      ...formData,
      boardId: board.id,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">제목</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300"
          required
        />
      </div>

      {board.isAnonymous && !user && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              작성자명
            </label>
            <input
              type="text"
              value={formData.authorName}
              onChange={(e) =>
                setFormData({ ...formData, authorName: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300"
              required
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">내용</label>
        <textarea
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          rows={6}
          className="mt-1 block w-full rounded-md border-gray-300"
          required
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="submit"
          disabled={createPost.isPending}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {createPost.isPending ? '등록 중...' : '등록'}
        </button>
      </div>
    </form>
  );
} 