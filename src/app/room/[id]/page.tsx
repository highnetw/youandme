export const revalidate = 0;

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import BookingForm from './BookingForm';

export default async function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. 방 정보 가져오기
  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', id)
    .single();

  // 2. 해당 방의 리뷰 가져오기 (마케팅의 핵심!)
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('room_id', id)
    .order('created_at', { ascending: false });

  if (roomError || !room) {
    return <div className="p-10 text-center text-gray-500">객실 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="w-full min-h-screen bg-[#FDFCF8] overflow-x-hidden pb-20">
      {/* --- 상단 이미지 영역 --- */}
      <section className="relative w-full h-[45vh]">
        <Image src={room.image_url} alt={room.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/10" />
        <Link href="/" className="absolute top-6 left-6 bg-white/80 p-2 rounded-full shadow-md z-20">
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </Link>
      </section>

      <main className="relative -mt-6 z-10 bg-[#FDFCF8] rounded-t-[32px] px-6 pt-8">
        <div className="max-w-xl mx-auto">
          {/* 제목 및 가격 */}
          <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
            <div className="flex-1">
              <span className="text-[#B8860B] text-[14px] font-bold tracking-widest uppercase block mb-1">Premium Stay</span>
              <h1 className="text-2xl font-serif text-gray-900 leading-tight">{room.title}</h1>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-gray-900">₩{room.price?.toLocaleString()}</span>
              <p className="text-gray-400 text-[12px]">1박 기준</p>
            </div>
          </div>

          {/* 객실 특징 */}
          <div className="grid grid-cols-2 gap-3 mb-12">
            {room.features?.map((f: string) => (
              <div key={f} className="flex items-center space-x-2 text-gray-600 text-[14px] bg-white border border-gray-50 p-3 rounded-xl shadow-sm">
                <span className="text-[#B8860B]">✓</span>
                <span>{f}</span>
              </div>
            ))}
          </div>

          {/* 객실 상세 설명 */}
          <article className="mb-16">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-[#B8860B] rounded-full"></span>
              객실 소개
            </h2>
            <p className="text-gray-600 leading-relaxed text-[16px] whitespace-pre-wrap">{room.description}</p>
          </article>

          {/* ⭐ 핵심: 리뷰 섹션 (마케팅 영역) ⭐ */}
          <section className="mb-20 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-gray-900 font-serif italic flex items-center gap-2">
                Guest Experience
              </h2>
              <span className="text-xs font-bold text-[#B8860B] bg-[#B8860B]/10 px-3 py-1 rounded-full">
                Review {reviews?.length || 0}
              </span>
            </div>

            {reviews && reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-gray-800 text-[15px]">{review.user_name} 님</span>
                      <div className="flex text-[#B8860B] text-[10px] gap-0.5">
                        {"★".repeat(review.rating)}
                      </div>
                    </div>
                    <p className="text-gray-600 text-[15px] leading-relaxed italic">"{review.content}"</p>
                    <p className="text-gray-300 text-[11px] mt-2 font-light">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-300 text-sm italic italic">아직 작성된 후기가 없습니다. 첫 번째 주인공이 되어보세요!</p>
              </div>
            )}
            
            {/* 후기 쓰기 버튼 - 별도 페이지로 이동하거나 폼 연결 가능 */}
            <div className="mt-8 text-center">
              <Link href={`/room/${id}/write`} className="text-sm font-bold text-gray-400 hover:text-[#B8860B] transition-colors border-b border-gray-200 pb-1">
                솔직한 후기 남기기 →
              </Link>
            </div>
          </section>

          {/* 예약 신청 섹션 (마지막 단계) */}
          <section className="mb-20">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-1 h-5 bg-[#B8860B] rounded-full"></span>
              지금 바로 예약하기
            </h2>
            <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/40 overflow-hidden border border-gray-100">
              <BookingForm roomId={room.id} pricePerNight={room.price} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}