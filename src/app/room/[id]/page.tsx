import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";

export default async function RoomDetailPage({ params }: { params: { id: string } }) {
  // 주소창의 id를 데이터베이스의 sort_order와 직접 비교합니다.
  const { data: room, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("sort_order", params.id)
    .single();

  // 1. 데이터를 못 찾거나 에러가 난 경우 보여줄 화면
  if (!room || error) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold text-red-500">방 정보를 찾을 수 없습니다.</h1>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg inline-block text-left">
          <p className="text-gray-600">● 찾는 번호: <span className="font-bold">{params.id}</span></p>
          {error && <p className="text-red-400 text-xs mt-2">● 에러 원인: {error.message}</p>}
        </div>
        <br />
        <Link href="/" className="mt-6 inline-block text-blue-500 underline font-medium">
          메인 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  // 2. 데이터를 성공적으로 가져왔을 때 보여줄 화면
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      {/* 제목: room.name 사용 */}
      <h1 className="text-4xl font-bold mb-8 text-gray-900 tracking-tight">{room.name}</h1>
      
      {/* 이미지 섹션 */}
      <div className="relative w-full h-[300px] md:h-[500px] mb-10 overflow-hidden rounded-3xl shadow-xl">
        <Image 
          src={room.image_url || "/next.svg"} 
          alt={room.name} 
          fill 
          className="object-cover"
          priority
        />
      </div>

      {/* 정보 카드 */}
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

      {/* 하단 버튼 */}
      <div className="text-center pb-20">
        <Link href="/" className="inline-block bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg">
          ← 다른 방 더 보기
        </Link>
      </div>
    </div>
  );
}