'use client';

import React, { useState, useEffect } from 'react'; // useEffect 추가
import { supabase } from '@/lib/supabase';
import { useRouter, useParams } from 'next/navigation';

export default function ReservePage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;

    const [customerName, setCustomerName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [simplePwd, setSimplePwd] = useState('');
    const [checkIn, setCheckIn] = useState('2026-05-04');
    const [checkOut, setCheckOut] = useState('2026-05-05');
    
    // 추가: 방의 기본 가격을 저장할 메모장
    const [roomPrice, setRoomPrice] = useState(0);

    // 추가: 페이지가 열릴 때 DB에서 방 가격을 가져옵니다
    useEffect(() => {
        const fetchPrice = async () => {
            const { data } = await supabase.from('rooms').select('price').eq('id', id).single();
            if (data) setRoomPrice(data.price);
        };
        fetchPrice();
    }, [id]);

    const calculateNights = (start: string, end: string) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = endDate.getTime() - startDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const handleSubmit = async () => {
        if (!customerName || !phoneNumber || !simplePwd || !checkIn || !checkOut) {
            alert('모든 정보를 입력해 주세요.');
            return;
        }

        // 추가: 숙박일수와 총액 계산
        const nights = calculateNights(checkIn, checkOut);
        if (nights <= 0) {
            alert('퇴실일은 입실일보다 나중이어야 합니다.');
            return;
        }
        const totalPrice = nights * roomPrice;

        try {
            const { error } = await supabase
                .from('reservations')
                .insert([
                    {
                        room_id: Number(Array.isArray(id) ? id[0] : id),
                        customer_name: customerName,
                        phone_number: phoneNumber,
                        simple_pwd: simplePwd,
                        check_in: checkIn,
                        check_out: checkOut,
                        total_price: totalPrice, // 이제 금액이 들어갑니다!
                        status: '대기'
                    }
                ]);

            if (error) throw error;
            alert('예약 신청이 완료되었습니다!');
            router.push(`/room/${id}`);

        } catch (error) {
            console.error('Error:', error);
            alert('예약 중 오류가 발생했습니다.');
        }
    };

    // 화면 하단에 보여줄 총액 미리보기 변수
    const currentNights = calculateNights(checkIn, checkOut);

    return (
        <div className="min-h-screen bg-[#FDFCF8] p-6">
            <div className="max-w-xl mx-auto pt-10">
                <h1 className="text-2xl font-bold text-gray-900 mb-8 font-serif italic text-center">Room Reservation</h1>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">

                    {/* [1단계] 날짜 선택 */}
                    <div className="space-y-4">
                        <h2 className="text-sm font-bold text-[#B8860B] uppercase tracking-wider">Step 1. 날짜 선택</h2>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">체크인</label>
                                <input
                                    type="date"
                                    value={checkIn}
                                    onChange={(e) => setCheckIn(e.target.value)}
                                    className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#B8860B] outline-none transition-all text-[16px]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">체크아웃</label>
                                <input
                                    type="date"
                                    value={checkOut}
                                    onChange={(e) => setCheckOut(e.target.value)}
                                    className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#B8860B] outline-none transition-all text-[16px]"
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-50" />

                    {/* [2단계] 개인 정보 입력 */}
                    <div className="space-y-4">
                        <h2 className="text-sm font-bold text-[#B8860B] uppercase tracking-wider">Step 2. 예약자 정보</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="예약자 성함"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#B8860B] outline-none transition-all"
                            />
                            <input
                                type="tel"
                                placeholder="휴대전화 번호 (- 빼고 입력)"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#B8860B] outline-none transition-all"
                            />
                            <input
                                type="password"
                                placeholder="예약 확인용 비번 (숫자 4자리)"
                                maxLength={4}
                                value={simplePwd}
                                onChange={(e) => setSimplePwd(e.target.value)}
                                className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#B8860B] outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* [추가] 숙박료 요약 표시 */}
                    {currentNights > 0 && (
                        <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-gray-100 flex justify-between items-center">
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-tight">Total Stay</p>
                                <p className="font-bold text-gray-700">{currentNights}박 숙박</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400 uppercase tracking-tight">Total Price</p>
                                <p className="font-bold text-xl text-[#B8860B]">
                                    {(currentNights * roomPrice).toLocaleString()}원
                                </p>
                            </div>
                        </div>
                    )}

                    {/* [3단계] 최종 버튼 */}
                    <div className="pt-4">
                        <button
                            onClick={handleSubmit}
                            className="w-full bg-gray-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-black transition-colors shadow-xl active:scale-[0.98]"
                        >
                            예약 확정하기
                        </button>
                        <button
                            onClick={() => router.back()}
                            className="w-full py-4 text-gray-400 text-sm font-medium"
                        >
                            취소하고 돌아가기
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}