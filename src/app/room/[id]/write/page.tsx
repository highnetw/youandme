'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useParams } from 'next/navigation';

export default function ReviewWritePage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.id; // URL에서 방 ID(sort_order)를 가져옵니다.

  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 1. 먼저 해당 sort_order를 가진 방의 실제 'id'를 찾아야 합니다.
    const { data: room } = await supabase
      .from('rooms')
      .select('id')
      .eq('sort_order', roomId)
      .single();

    if (!room) {
      alert('방 정보를 찾을 수 없습니다.');
      setIsSubmitting(false);
      return;
    }

    // 2. 리뷰 테이블에 저장합니다.
    const { error } = await supabase.from('reviews').insert([
      {
        room_id: room.id,
        user_name: userName,
        rating: rating,
        content: content,
      },
    ]);

    if (error) {
      alert('후기 저장 중 에러가 발생했습니다: ' + error.message);
    } else {
      alert('소중한 후기가 등록되었습니다! 감사합니다.');
      router.push(`/room/${roomId}`); // 다시 방 상세페이지로 이동
    }
    setIsSubmitting(false);
  };

  return (
    <main className="p-6 bg-[#FDFCF8] min-h-screen">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-serif mb-8 text-gray-900">후기 작성하기</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 이름 입력 */}
          <div>
            <label className="block text-sm font-bold text-[#B8860B] mb-2">성함</label>
            <input 
              type="text" 
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-200 text-[18px]" 
              placeholder="성함을 입력해주세요"
              required
            />
          </div>

          {/* 별점 선택 */}
          <div>
            <label className="block text-sm font-bold text-[#B8860B] mb-2">만족도 (별점)</label>
            <select 
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full p-4 rounded-xl border border-gray-100 bg-white text-[18px]"
            >
              <option value="5">★★★★★ (아주 좋아요)</option>
              <option value="4">★★★★☆ (좋아요)</option>
              <option value="3">★★★☆☆ (보통이에요)</option>
              <option value="2">★★☆☆☆ (아쉬워요)</option>
              <option value="1">★☆☆☆☆ (별로예요)</option>
            </select>
          </div>

          {/* 후기 내용 */}
          <div>
            <label className="block text-sm font-bold text-[#B8860B] mb-2">내용</label>
            <textarea 
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-200 text-[18px] leading-relaxed"
              placeholder="펜션과 방에 대한 소중한 의견을 들려주세요."
              required
            />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gray-900 text-white py-5 rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-all disabled:bg-gray-400"
          >
            {isSubmitting ? '등록 중...' : '후기 등록 완료'}
          </button>
        </form>
      </div>
    </main>
  );
}