'use client';

import { useState } from 'react';
import Link from 'next/link'; // 1. Link 컴포넌트 추가
import { supabase } from '@/lib/supabase';

export default function CheckReservationPage() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [reservation, setReservation] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleCheck = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setReservation(null);

        const { data, error } = await supabase
            .from('reservations')
            .select('*, rooms(title)')
            .eq('customer_name', name)
            .eq('simple_pwd', password)
            .single();

        if (error || !data) {
            alert('일치하는 예약 정보가 없습니다. 이름과 비밀번호를 확인해 주세요.');
        } else {
            setReservation(data);
        }
        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">예약 확인</h1>

            <form onSubmit={handleCheck} className="space-y-4 mb-10">
                <input
                    type="text" placeholder="성함" value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required
                />
                <input
                    type="password" placeholder="비밀번호 (4자리)" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" maxLength={4} required
                />
                <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                    {loading ? '조회 중...' : '예약 조회하기'}
                </button>
            </form>

            {reservation && (
                <div className="mt-8 p-6 bg-white border-2 border-blue-500 rounded-3xl shadow-lg">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
                        {reservation.customer_name}님의 예약 내역
                    </h2>

                    <div className="space-y-3">
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">객실</span>
                            <span className="font-bold text-blue-600">{reservation.rooms?.title}</span>
                        </div>

                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">일정</span>
                            <span className="font-medium">
                                {String(reservation.check_in).slice(5)} ~ {String(reservation.check_out).slice(5)}
                            </span>
                        </div>

                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">결제 금액</span>
                            <span className="font-bold">₩{reservation.total_price?.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between pt-2">
                            <span className="text-gray-500">예약 상태</span>
                            <span className={`font-bold ${reservation.status === 'confirmed' ? 'text-green-600' : 'text-orange-500'}`}>
                                {reservation.status === 'confirmed' ? '입금 확인(완료)' : '입금 대기 중'}
                            </span>
                        </div>
                    </div>

                    <p className="mt-6 text-xs text-gray-400 text-center">
                        문의사항이 있으시면 관리자에게 연락 바랍니다.(031-100-1111)
                    </p>
                </div>
            )}

            {/* 2. 메인으로 돌아가기 버튼 (예약 조회 여부와 상관없이 항상 하단에 배치) */}
            <div className="mt-12">
                <Link
                    href="/"
                    className="block w-full bg-blue-600 text-white p-4 rounded-2xl text-center font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all"
                >
                    홈으로 돌아가기
                </Link>
            </div>
        </div >
    );
}