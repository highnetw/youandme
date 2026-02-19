export const revalidate = 0;

import { supabase } from '@/lib/supabase';
import Link from "next/link";

export default async function Home() {
  const { data: rooms, error } = await supabase.from('rooms').select('*').order('sort_order', { ascending: true });
  
  if (error) {
    return <div className="p-10 text-red-500">에러 발생: {error.message}</div>;
  }

  return (
    <main className="p-6 md:p-12 bg-[#FDFCF8] min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 섹션: 사진과 문구가 돋보이는 구간 */}
        <header className="mb-12 text-center md:text-left">
          <span className="text-[#B8860B] text-xs font-bold tracking-[0.3em] uppercase">Private & Nature</span>
          <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mt-3 leading-tight">
            YouAndMe <span className="font-light italic">Rooms</span>
          </h1>
          <p className="text-gray-500 mt-4 text-lg">품격 있는 휴식을 위한 특별한 공간</p>
        </header>
        
        {/* 객실 리스트 섹션 (최대 7개) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {rooms && rooms.length > 0 ? (
            rooms.map((room) => (
              <Link key={room.id} href={`/room/${room.id}`} className="group block">
                <div className="bg-white overflow-hidden rounded-[32px] shadow-sm border border-gray-100 h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                  <div className="relative w-full h-64 overflow-hidden">
                    {room.image_url ? (
                      <img 
                        src={room.image_url} 
                        alt={room.id} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 font-serif italic">
                        Stay youandme
                      </div>
                    )}
                  </div>
                  
                  <div className="p-8">
                    <h2 className="text-2xl font-serif text-gray-900 group-hover:text-[#B8860B] transition-colors mb-2">
                      {room.title}
                    </h2>
                    <p className="text-[#B8860B] text-xl font-bold mb-4">
                      ₩{room.price?.toLocaleString()} <span className="text-gray-400 text-sm font-normal">/ 1박</span>
                    </p>
                    <p className="text-gray-600 text-[16px] leading-relaxed line-clamp-2">
                      {room.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-gray-400 font-serif text-xl italic">멋진 객실의 정보를 불러오는 중입니다...</p>
            </div>
          )}
        </div>

        {/* --- 🚀 회장님의 핵심 요청 반영 구역 --- */}
        {/* 모든 방을 둘러본 후 나타나는 하단 버튼 섹션 */}
        <div className="mt-20 mb-20 text-center border-t border-gray-100 pt-16">
          <p className="text-gray-400 mb-6 font-serif italic text-sm">이미 예약을 마치셨나요?</p>
          <Link 
            href="/check-reservation"
            className="inline-block bg-[#B8860B] text-white px-12 py-5 rounded-full font-bold text-lg shadow-xl hover:bg-[#8B6508] active:scale-95 transition-all"
          >
            나의 예약 확인하기
          </Link>
        </div>
      </div>
    </main>
  );
}