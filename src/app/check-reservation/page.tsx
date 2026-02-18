'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase'; // 설정된 supabase 경로에 맞춰주세요

export default function CheckReservationPage() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [reservation, setReservation] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleCheck = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setReservation(null);

        // 🔍 핵심 로직: 이름과 비밀번호가 동시에 일치하는 데이터를 찾습니다.
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
            <h1 className="text-2xl font-bold mb-6 text-center">예약 확인</h1>

            <form onSubmit={handleCheck} className="space-y-4 mb-10">
                <input
                    type="text" placeholder="성함" value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border rounded-lg" required
                />
                <input
                    type="password" placeholder="비밀번호 (4자리)" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border rounded-lg" maxLength={4} required
                />
                <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold">
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
                            {/* 연도 빼고 시원하게 보여주기 위해 slice(5) 적용! */}
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

                    {/* 안내 문구 추가 */}
                    <p className="mt-6 text-xs text-gray-400 text-center">
                        문의사항이 있으시면 관리자에게 연락 바랍니다.(031-100-1111)
                    </p>
                </div>
            )}
        </div>
    );
}