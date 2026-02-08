import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";

export default async function RoomDetailPage({ params }: { params: { id: string } }) {
  // 1. 주소창에서 [id] 번호(우리의 sort_order)를 가져옵니다.
  const { id } = params;

  // 2. Supabase에서 sort_order가 이 번호와 일치하는 방 하나만 가져옵니다.
  const { data: room, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("sort_order", parseInt(id)) // id를 숫자로 바꿔서 비교합니다.
    .single(); // 딱 하나만 가져오라는 뜻입니다.

  if (error || !room) {
    return <div className="p-10 text-center">방 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link href="/" className="text-blue-500 mb-4 inline-block">← 목록으로 돌아가기</Link>
      
      <div className="rounded-2xl overflow-hidden shadow-xl mb-8">
        <Image 
          src={room.image_url} 
          alt={room.name} 
          width={1200} 
          height={800} 
          className="w-full h-auto object-cover"
        />
      </div>

      <h1 className="text-3xl font-bold mb-4">{room.name}</h1>
      <p className="text-xl text-blue-600 font-semibold mb-6">₩ {room.price?.toLocaleString()} / 1박</p>
      
      <div className="bg-gray-50 p-8 rounded-xl leading-relaxed text-gray-700 whitespace-pre-wrap">
        {room.description}
      </div>
    </div>
  );
}