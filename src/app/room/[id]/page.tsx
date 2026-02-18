export const revalidate = 0;

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default async function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: room, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !room) {
    return <div className="p-10 text-center">객실 정보를 찾을 수 없습니다.</div>;
  }

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('room_id', room.id)
    .order('created_at', { ascending: false });

  return (
    <div className="w-full min-h-screen bg-[#FDFCF8] overflow-x-hidden">

      {/* 1. 상단 이미지 영역 */}
      <section className="relative w-full h-[45vh]">
        <Image
          src={room.image_url}
          alt={room.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/10" />
        <Link href="/" className="absolute top-6 left-6 bg-white/80 p-2 rounded-full shadow-md z-20">
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
      </section>

      {/* 2. 메인 콘텐츠 영역 */}
      <main className="relative -mt-6 z-10 bg-[#FDFCF8] rounded-t-[32px] px-6 pt-8">
        <div className="max-w-xl mx-auto">
          {/* 제목 및 가격 */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <span className="text-[#B8860B] text-[16px] font-bold tracking-widest uppercase block mb-1">Premium Stay</span>
              <h1 className="text-2xl font-serif text-gray-900 leading-tight">{room.title}</h1>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-gray-900">₩{room.price?.toLocaleString()}</span>
              <p className="text-gray-400 text-[12px]">1박 기준</p>
            </div>
          </div>

          {/* 특징 아이콘 그리드 */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {room.features && room.features.map((f: string) => (
              <div key={f} className="flex items-center space-x-2 text-gray-600 text-[15px] bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
                <span className="text-[#B8860B]">✓</span>
                <span>{f}</span>
              </div>
            ))}
          </div>

          <hr className="mb-8 border-gray-200/50" />

          {/* 객실 상세 설명 */}
          <article className="mb-12">
            <h2 className="text-lg font-bold text-gray-800 mb-4 text-[18px]">객실 소개</h2>
            <p className="text-gray-600 leading-relaxed text-[18px] whitespace-pre-wrap">
              {room.description}
            </p>
          </article>

          <hr className="my-10 border-gray-200/50" />

          {/* 3. 리뷰 섹션 (버튼 삽입 위치!) */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 font-serif italic">Guest Experience</h2>

              {/* ★★★ 이 부분이 추가되었습니다 ★★★ */}
              <Link
                href={`/room/${id}/write`}
                className="text-[#B8860B] border border-[#B8860B] px-4 py-2 rounded-full text-xs font-bold hover:bg-[#B8860B] hover:text-white transition-colors"
              >
                후기 쓰기
              </Link>
            </div>

            {reviews && reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-gray-800 text-[17px]">{review.user_name}</span>
                      <div className="text-[#B8860B] text-[10px] tracking-widest">
                        {"★".repeat(review.rating)}
                      </div>
                    </div>
                    <p className="text-gray-600 text-[18px] leading-relaxed">
                      {review.content}
                    </p>
                    <p className="text-gray-400 text-[12px] mt-4 font-light">
                      {new Date(review.created_at).toLocaleDateString()} 방문
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400 text-[16px] font-serif italic">아직 작성된 후기가 없습니다.</p>
              </div>
            )}
          </section>

          {/* 하단 여백: 버튼에 가려지지 않게 넉넉히! */}
          <div className="h-40 w-full"></div>
        </div>
      </main>

      {/* 4. 하단 고정 예약 바 */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 p-5 z-50">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-[10px] text-[#B8860B] font-bold uppercase tracking-widest">Available Now</p>
            <p className="text-sm font-medium text-gray-500">날짜를 선택해 주세요</p>
          </div>
          {/* 버튼을 클릭하면 예약 페이지로 이동하도록 Link를 감싸줍니다 */}
          <Link href={`/room/${id}/reserve`} className="flex-1">
            <button className="w-full bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold text-[15px] tracking-widest shadow-lg active:scale-95 transition-all">
              RESERVE
            </button>
          </Link>
        </div>
      </footer>
    </div>
  );
}