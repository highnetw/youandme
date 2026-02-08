import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";

export default async function RoomDetailPage({ params }: { params: { id: string } }) {
  // 1. 주소창의 글자 id를 '숫자'로 강제 변환하여 DB와 매칭합니다.
  const roomId = Number(params.id);

  // 2. Supabase에서 데이터를 가져옵니다.
  const { data: room, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("sort_order", roomId)
    .single();

  // 데이터를 못 찾았을 때의 처리
  if (!room || error) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold text-red-500">방 정보를 찾을 수 없습니다.</h1>
        <p className="mt-4 text-gray-600">찾으려는 번호: {params.id}</p>
        <Link href="/" className="mt-6 inline-block text-blue-500 underline">홈으로 돌아가기</Link>
      </div>
    );
  }

  // 3. 정상적으로 데이터를 가져왔을 때의 화면
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">{room.title}</h1>
      
      <div className="relative w-full h-[500px] mb-10">
        <Image 
          src={room.image_url} 
          alt={room.title} 
          fill 
          className="object-cover rounded-3xl shadow-2xl"
          priority
        />
      </div>

      <div className="bg-white border border-gray-100 p-10 rounded-3xl shadow-sm mb-10">
        <div className="flex justify-between items-center mb-8">
          <span className="text-3xl font-extrabold text-blue-600">{room.price}</span>
          <span className="bg-green-100 text-green-700 px-5 py-2 rounded-full text-sm font-bold">
            예약 가능
          </span>
        </div>
        
        <div className="border-t border-gray-100 pt-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">숙소 설명</h2>
          <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-wrap">
            {room.description}
          </p>
        </div>
      </div>

      <div className="text-center pb-10">
        <Link href="/" className="inline-block bg-gray-900 text-white px-12 py-4 rounded-full font-bold text-lg">
          ← 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
