'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useParams } from 'next/navigation';

export default function ReservePage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;

    // 1. 임시 메모장들 (State)
    const [customerName, setCustomerName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [simplePwd, setSimplePwd] = useState('');

    // 2. [예약 완료] 버튼을 눌렀을 때 실행될 함수
    const handleSubmit = async () => {
        // 1. 빈 칸이 있는지 확인 (방어 운전!)
        if (!customerName || !phoneNumber || !simplePwd) {
            alert('모든 정보를 입력해 주세요.');
            return;
        }

        try {
            // 2. Supabase 장부에 기록하기
            const { error } = await supabase
                .from('reservations')
                .insert([
                    {
                        room_id: Number(Array.isArray(id) ? id[0] : id),             // 어느 방인지
                        customer_name: customerName, // 예약자 이름
                        phone_number: phoneNumber,   // 전화번호
                        simple_pwd: simplePwd,       // 비밀번호
                        check_in: '2026-05-04',      // (임시) 입실일 - 나중에 달력으로 바꿀게요!
                        check_out: '2026-05-05',     // (임시) 퇴실일
                        status: '대기'                // 예약 상태
                    }
                ]);

            if (error) throw error;

            // 3. 성공 시 알림 및 이동
            alert('예약 신청이 완료되었습니다!');
            router.push(`/room/${id}`); // 다시 방 상세페이지로 돌아갑니다.

        } catch (error) {
            console.error('Error:', error);
            alert('예약 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCF8] p-6">
            <div className="max-w-xl mx-auto pt-10">
                <h1 className="text-2xl font-bold text-gray-900 mb-8 font-serif italic">Reservation</h1>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                    {/* 이름 입력 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">예약자 성함</label>
                        <input
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#B8860B]"
                            placeholder="성함을 입력해주세요"
                        />
                    </div>

                    {/* 전화번호 입력 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">휴대전화</label>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#B8860B]"
                            placeholder="010-0000-0000"
                        />
                    </div>

                    {/* 비밀번호 입력 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">예약 확인용 비밀번호 (4자리)</label>
                        <input
                            type="password"
                            maxLength={4}
                            value={simplePwd}
                            onChange={(e) => setSimplePwd(e.target.value)}
                            className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#B8860B]"
                            placeholder="숫자 4자리"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold mt-4"
                    >
                        예약 신청하기
                    </button>

                    <button
                        onClick={() => router.back()}
                        className="w-full py-2 text-gray-400 text-sm"
                    >
                        뒤로 가기
                    </button>
                </div>
            </div>
        </div>
    );
}