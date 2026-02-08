// 1. 캐시를 무효화하고 매번 서버에서 데이터를 새로 가져오도록 설정 (핵심!)
export const revalidate = 0;

import { supabase } from '@/lib/supabase';

export default async function Home() {
  
// sort_order 숫자가 작은 것부터(ascending) 정렬해서 가져오라는 뜻입니다.
const { data: rooms, error } = await supabase.from('rooms').select('*').order('sort_order', { ascending: true });
  if (error) {
    return <div className="p-10 text-red-500">에러 발생: {error.message}</div>;
  }

  return (
    <main className="p-10 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">
        🏠 YouAndMe 펜션 객실 안내
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms && rooms.length > 0 ? (
          rooms.map((room) => (
            <div key={room.id} className="bg-white overflow-hidden rounded-xl shadow-md border border-slate-200">
              {/* 이미지 영역 */}
              {room.image_url ? (
                <img src={room.image_url} alt={room.name} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-slate-200 flex items-center justify-center text-slate-400">이미지 준비중</div>
              )}
              
              {/* 텍스트 영역 */}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-slate-800">{room.name}</h2>
                <p className="text-blue-600 font-bold mb-4">₩{room.price?.toLocaleString()}</p>
                <p className="text-slate-600 text-sm leading-relaxed">{room.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-slate-500">등록된 객실 정보가 없습니다.</p>
        )}
      </div>
    </main>
  );
}