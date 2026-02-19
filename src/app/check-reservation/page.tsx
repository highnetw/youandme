'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function CheckReservationPage() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [reservations, setReservations] = useState<any[]>([]); // 단수에서 복수([])로 변경
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false); // 조회 버튼을 눌렀었는지 확인

    const handleCheck = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setHasSearched(true);

        // 🔍 철학 반영: .single()을 빼고 모든 내역을 가져옵니다.
        const { data, error } = await supabase
            .from('reservations')
            .select('*, rooms(title)')
            .eq('customer_name', name)
            .eq('simple_pwd', password)
            .order('check_in', { ascending: true }); // 입실 날짜 순서대로 정렬

        if (error) {
            alert('조회 중 오류가 발생했습니다.');
        } else {
            setReservations(data || []);
        }
        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">예약 내역 조회</h1>

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
                <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold">
                    {loading ? '조회 중...' : '나의 예약 확인하기'}
                </button>
            </form>

            {/* 📋 예약 내역 리스트 출력 부분 */}
            {hasSearched && reservations.length > 0 ? (
                <div className="space-y-4">
                    <p className="text-sm text-gray-500 font-bold ml-1">총 {reservations.length}건의 예약이 있습니다.</p>
                    {reservations.map((item) => (
                        <div key={item.id} className="p-5 bg-white border-2 border-blue-100 rounded-2xl shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-bold mb-1 inline-block">
                                        {item.rooms?.title}
                                    </span>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {String(item.check_in).slice(5)} ~ {String(item.check_out).slice(5)}
                                    </h3>
                                </div>
                                <span className={`text-sm font-bold ${item.status === 'confirmed' ? 'text-green-600' : 'text-orange-500'}`}>
                                    {item.status === 'confirmed' ? '예약확정' : '입금대기'}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600 border-t pt-2">
                                <span>결제 금액</span>
                                <span className="font-bold text-gray-900">₩{item.total_price?.toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                hasSearched && !loading && (
                    <p className="text-center text-gray-400 py-10">일치하는 예약 정보가 없습니다.</p>
                )
            )}

            <div className="mt-12">
                <Link href="/" className="block w-full bg-gray-100 text-gray-600 p-4 rounded-2xl text-center font-bold">
                    홈으로 돌아가기
                </Link>
            </div>
        </div>
    );
}