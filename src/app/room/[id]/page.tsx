import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";

export default async function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. 주소창의 번호가 도착할 때까지 기다립니다.
  const { id } = await params;

  // 2. 이제 확실한 번호(id)를 들고 창고로 갑니다.
  const { data: room, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("sort_order", id)
    .single();

  if (!room || error) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold text-red-500">방 정보를 찾을 수 없습니다.</h1>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg inline-block text-left">
          <p className="text-gray-600">● 찾는 번호: <span className="font-bold">{id}</span></p>
          {error && <p className="text-red-400 text-xs mt-2">● 에러 원인: {error.message}</p>}
        </div>
        <br />
        <Link href="/" className="mt-6 inline-block text-blue-500 underline font-medium">
          메인 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 tracking-tight">{room.name}</h1>
      
      <div className="relative w-full h-[300px] md:h-[500px] mb-10 overflow-hidden rounded-3xl shadow-xl">
        <Image 
          src={room.image_url || "/next.svg"} 
          alt={room.name} 
          fill 
          className="object-cover"
          priority
        />
      </div>

      <div className="bg-gray-50 p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm mb-10">
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">숙박 요금</p>
            <span className="text-3xl font-black text-blue-600">{room.price}</span>
          </div>
          <span className="bg-green-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-sm">
            예약 가능
          </span>
        </div>
        
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-800">숙소 상세 설명</h2>
          <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-wrap">
            {room.description}
          </p>
        </div>
      </div>

      <div className="text-center pb-20">
        <Link href="/" className="inline-block bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg">
          ← 다른 방 더 보기
        </Link>
      </div>
    </div>
  );
}