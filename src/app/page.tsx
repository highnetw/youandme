export const revalidate = 0;

import { supabase } from '@/lib/supabase';
import Link from "next/link";

export default async function Home() {
  const { data: rooms, error } = await supabase.from('rooms').select('*').order('sort_order', { ascending: true });
  
  if (error) {
    return <div className="p-10 text-red-500">에러 발생: {error.message}</div>;
  }

  return (
    // 배경색을 상세페이지와 같은 부드러운 베이지톤으로 변경
    <main className="p-6 md:p-12 bg-[#FDFCF8] min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 부분: 폰트와 자간 조정으로 품격 상승 */}
        <header className="mb-12 text-center md:text-left">
          <span className="text-[#B8860B] text-xs font-bold tracking-[0.3em] uppercase">Private & Nature</span>
          <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mt-3 leading-tight">
            YouAndMe <span className="font-light italic">Rooms</span>
          </h1>
          <p className="text-gray-500 mt-4 text-lg">품격 있는 휴식을 위한 특별한 공간</p>
        </header>
        
        {/* 그리드 간격 넓힘 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {rooms && rooms.length > 0 ? (
            rooms.map((room) => (
              <Link 
                key={room.id} 
                href={`/room/${room.id}`} 
                className="group block"
              >
                {/* 카드 디자인: 둥근 모서리와 부드러운 그림자 */}
                <div className="bg-white overflow-hidden rounded-[32px] shadow-sm border border-gray-100 h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                  
                  {/* 이미지 영역 */}
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
                    {/* 우측 상단 골드 라벨 */}
                    <div className="absolute top-5 right-5">
                      <div className="bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm">
                        <p className="text-[#B8860B] text-[10px] font-bold tracking-widest uppercase">Select</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* 텍스트 영역: 상세페이지 폰트 사이즈(18px) 감각 반영 */}
                  <div className="p-8">
                    <div className="mb-4">
                      <h2 className="text-2xl font-serif text-gray-900 group-hover:text-[#B8860B] transition-colors mb-2">
                        {room.title}
                      </h2>
                      <div className="w-10 h-[2px] bg-[#B8860B] opacity-30"></div>
                    </div>

                    <p className="text-[#B8860B] text-xl font-bold mb-4">
                      ₩{room.price?.toLocaleString()} <span className="text-gray-400 text-sm font-normal">/ 1박</span>
                    </p>
                    
                    <p className="text-gray-600 text-[16px] leading-relaxed line-clamp-2">
                      {room.description}
                    </p>
                    
                    <div className="mt-6 flex items-center text-[#B8860B] text-xs font-bold tracking-widest">
                      DETAILS VIEW <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-gray-400 font-serif text-xl italic">객실 정보를 불러오는 중입니다...</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}