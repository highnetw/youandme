export const revalidate = 0;

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase'; // Supabase 불러오기

export default async function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. Supabase에서 해당 id(sort_order)를 가진 방 정보 하나만 가져오기
  const { data: room, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('sort_order', id)
    .single(); // 데이터 하나만 가져오라는 명령

  if (error || !room) {
    return <div className="p-10 text-center">객실 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCF8]">
      
      {/* 1. 상단 이미지 */}
      <section className="relative w-full h-[45vh] overflow-hidden">
        <Image
          src={room.image_url} // DB의 image_url 사용
          alt={room.title}
          fill
          className="object-cover transition-transform duration-700 hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-black/10" />
        
        <Link href="/" className="absolute top-6 left-6 bg-white/80 p-2 rounded-full shadow-md z-20">
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
      </section>

      {/* 2. 객실 정보 (박스 크기를 줄이고 압축적으로 변경) */}
      <main className="flex-1 -mt-5 relative z-10 bg-[#FDFCF8] rounded-t-[24px] px-5 pt-6 pb-24">
        <div className="max-w-xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1">
              <span className="text-[#B8860B] text-[18px] font-bold tracking-widest uppercase">Premium Stay</span>
              <h1 className="text-2xl font-serif text-gray-900 leading-tight">{room.title}</h1>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-gray-900">₩{room.price?.toLocaleString()}</span>
              <p className="text-gray-400 text-[12px]">1박 기준</p>
            </div>
          </div>

          {/* 특징 아이콘: DB에 features 배열이 있다면 출력 */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {room.features && room.features.map((f: string) => (
              <div key={f} className="flex items-center space-x-2 text-gray-600 text-[16px] bg-white border border-gray-100 p-2 rounded-lg shadow-sm">
                <span className="text-[#B8860B]">✓</span>
                <span>{f}</span>
              </div>
            ))}
          </div>

          <hr className="my-5 border-gray-200/50" />

          <article>
            <h2 className="text-md font-bold text-gray-800 mb-2">객실 소개</h2>
            <p className="text-gray-600 leading-snug text-[18px]">
              {room.description}
            </p>
          </article>
        </div>
      </main>

      {/* 3. 하단 고정 예약 바 */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 p-5 z-50">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <div className="flex-1">
             <p className="text-[10px] text-[#B8860B] font-bold uppercase tracking-widest">Available Now</p>
             <p className="text-sm font-medium text-gray-500">날짜를 선택해 주세요</p>
          </div>
          <button className="bg-gray-900 text-white px-10 py-4 rounded-xl font-bold text-sm tracking-widest hover:bg-[#B8860B] transition-all active:scale-95 shadow-lg">
            RESERVE
          </button>
        </div>
      </footer>
    </div>
  );
}