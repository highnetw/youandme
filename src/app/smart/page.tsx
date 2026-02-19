'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminPage() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [password, setPassword] = useState('');
    const [reservations, setReservations] = useState<any[]>([]);
    const [sortByRoom, setSortByRoom] = useState(false); // 방이름순 정렬 여부
    // 회장님 전용 마스터 비밀번호 (예: 9999 - 나중에 원하는 번호로 바꾸세요!)
    const MASTER_KEY = "9999";

    // 1. 관리자 인증 함수
    const loginAdmin = () => {
        if (password === MASTER_KEY) {
            setIsAdmin(true);
            fetchReservations();
        } else {
            alert("비밀번호가 틀렸습니다.");
        }
    };

    // 2. 전체 예약 목록 가져오기
    const fetchReservations = async () => {
        let query = supabase
            .from('reservations')
            .select('*, rooms(title)');

        if (sortByRoom) {
            // 1. 방 ID 순서로 먼저 모으고, 그 안에서 최신순 정렬
            query = query.order('room_id').order('check_in', { ascending: true });
        } else {
            // 2. 기본값: 신청한 순서대로 (최신순)
            query = query.order('created_at', { ascending: false });
        }

        const { data } = await query;
        setReservations(data || []);
    };

    // 정렬 상태가 바뀔 때마다 자동으로 새로고침
    useEffect(() => {
        fetchReservations();
    }, [sortByRoom]);

    // 3. 입금 확인 버튼 (상태 업데이트)
    const confirmReservation = async (id: string) => {
        const { error } = await supabase
            .from('reservations')
            .update({ status: 'confirmed' })
            .eq('id', id);

        if (!error) {
            alert("예약이 확정되었습니다!");
            fetchReservations(); // 목록 새로고침
        }
    };

    if (!isAdmin) {
        return (
            <div className="p-10 text-center max-w-sm mx-auto">
                <h1 className="text-2xl font-bold mb-6">회장님 전용 관리실</h1>
                <input
                    type="password"
                    placeholder="마스터 번호 입력"
                    className="w-full p-4 border-2 rounded-2xl mb-4 text-center text-2xl tracking-widest"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={loginAdmin} className="w-full bg-black text-white p-4 rounded-2xl font-bold">
                    관리자 접속
                </button>
            </div>

        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto pb-20">
            {/* <h1 className="text-2xl font-bold mb-8 flex justify-between items-center"> */}
            {/* 📊 현황판 */}
            {/* <button onClick={() => window.location.reload()} className="text-sm bg-gray-100 p-2 rounded-lg font-normal">새로고침</button> */}
            {/* </h1> */}
            <h1 className="text-2xl font-bold mb-8 flex justify-between items-center">
                📊 예약목록
                <div className="flex gap-2">
                    <button
                        onClick={() => setSortByRoom(!sortByRoom)} // 클릭할 때마다 true/false가 바뀜
                        className={`text-sm p-2 rounded-lg font-bold transition-all ${sortByRoom 
                            ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                             : 'bg-gray-800 text-white'
                            }`}
                    >
                        {/* 상태에 따라 버튼 글자를 바꿔줍니다 */}
                        {sortByRoom ? '🏠 방이름순' : '🕒 최신순'}
                    </button>
                        <button onClick={fetchReservations} className="text-lg bg-gray-100 p-2 rounded-lg">🔄</button>
                </div>
            </h1>
            <div className="space-y-4">
                {reservations.map(res => (
                    <div key={res.id} className="bg-white border p-6 rounded-[28px] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="bg-blue-50 text-blue-600 text-bs px-2 py-1 rounded font-bold">{res.rooms?.title}</span>
                                <span className="text-gray-800 text-sm">{new Date(res.created_at).toLocaleDateString()} 신청</span>
                            </div>
                            <h3 className="text-xl font-bold">{res.customer_name} <span className="text-sm font-normal text-gray-500">({res.phone_number})</span></h3>
                            <p className="text-gray-600">{res.check_in} ~ {res.check_out} ({res.total_price?.toLocaleString()}원)</p>
                        </div>

                        {res.status === 'confirmed' ? (
                            <span className="bg-green-100 text-green-700 px-6 py-3 rounded-full font-bold">예약확정 완료</span>
                        ) : (
                            <button
                                onClick={() => confirmReservation(res.id)}
                                className="bg-orange-500 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200"
                            >
                                입금 확인 처리
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}