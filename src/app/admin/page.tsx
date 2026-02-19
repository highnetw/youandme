'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link'; // ⬅️ 분기를 위한 연결 통로

interface Reservation {
  id: string;
  customer_name: string;
  phone_number: string;
  check_in: string;
  check_out: string;
  total_price: number;
  status: string;
  created_at: string;
  rooms: { title: string };
}

export default function AdminPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. 모든 예약 목록 가져오기 (최신순)
  const fetchReservations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        rooms ( title )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reservations:', error);
    } else {
      setReservations(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // 2. 예약 상태 업데이트
  const updateStatus = async (id: string, newStatus: string) => {
    if (!confirm(`예약 상태를 [${newStatus}] 상태로 변경하시겠습니까?`)) return;

    const { error } = await supabase
      .from('reservations')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert('상태 업데이트 실패: ' + error.message);
    } else {
      fetchReservations();
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500 font-mono italic">SYSTEM LOADING...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 pb-24">
      <div className="max-w-4xl mx-auto">
        
        {/* 🚀 회장님이 원하신 '분기 메뉴' - 앱의 탭 버튼 역할 */}
        <nav className="flex gap-2 mb-10 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
          <Link href="/admin" className="flex-1 text-center py-3.5 rounded-xl bg-gray-900 text-white font-bold text-sm shadow-md transition-all">
            📅 예약 관리
          </Link>
          <Link href="/admin/reviews" className="flex-1 text-center py-3.5 rounded-xl bg-white text-gray-400 font-bold text-sm hover:bg-gray-50 transition-all">
            ✍️ 리뷰 관리
          </Link>
        </nav>

        <header className="flex justify-between items-center mb-8 px-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-serif italic tracking-tighter">Admin Console</h1>
            <p className="text-[12px] text-gray-400 mt-1 font-mono uppercase tracking-widest">Stay YouandMe Management</p>
          </div>
          <button 
            onClick={fetchReservations}
            className="text-xs font-bold bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            새로고침
          </button>
        </header>

        {/* 📋 예약 내역 리스트 */}
        <div className="space-y-5">
          {reservations.length === 0 ? (
            <div className="bg-white rounded-[40px] p-24 text-center border border-dashed border-gray-200 shadow-inner">
              <p className="text-gray-400 italic">아직 예약 데이터가 없습니다.</p>
            </div>
          ) : (
            reservations.map((res) => (
              <div key={res.id} className="bg-white p-7 rounded-[35px] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-6 transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      res.status === '대기' ? 'bg-amber-100 text-amber-700' : 
                      res.status === '확정' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-50 text-red-600'
                    }`}>
                      {res.status}
                    </span>
                    <h3 className="font-bold text-lg text-gray-900">{res.customer_name} 님</h3>
                  </div>
                  
                  <div className="text-gray-800">
                    <p className="text-sm">
                      <span className="font-black text-xl text-[#0056b3]">{res.rooms?.title}</span>
                      <span className="mx-2 text-gray-200">|</span>
                      <span className="font-bold text-gray-500 font-mono">
                        {String(res.check_in).slice(5)} ~ {String(res.check_out).slice(5)}
                      </span>
                    </p>
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                       <span className="opacity-50">📞</span> {res.phone_number}
                    </p>
                    <p className="font-black text-gray-900 mt-3 text-lg">
                      결제금액: <span className="text-blue-600 underline decoration-blue-100 decoration-4">₩{res.total_price?.toLocaleString()}</span>
                    </p>
                  </div>
                </div>

                {/* 🛠️ 상태 변경 버튼 섹션 */}
                <div className="flex flex-wrap items-center gap-2 self-end md:self-center">
                  {res.status === '대기' && (
                    <button 
                      onClick={() => updateStatus(res.id, '확정')}
                      className="bg-gray-900 text-white px-6 py-3 rounded-2xl text-xs font-bold transition-all hover:bg-black active:scale-95 shadow-lg shadow-gray-200"
                    >
                      입금확인 (확정)
                    </button>
                  )}

                  {res.status === '확정' && (
                    <button 
                      onClick={() => updateStatus(res.id, '대기')}
                      className="bg-white border border-gray-200 text-gray-400 px-6 py-3 rounded-2xl text-xs font-bold transition-all hover:bg-gray-50"
                    >
                      확정취소
                    </button>
                  )}

                  {res.status !== '취소' && (
                    <button 
                      onClick={() => updateStatus(res.id, '취소')}
                      className="bg-red-50 text-red-400 px-6 py-3 rounded-2xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all active:scale-95"
                    >
                      예약취소
                    </button>
                  )}
                  
                  {res.status === '취소' && (
                    <button 
                      onClick={() => updateStatus(res.id, '대기')}
                      className="bg-blue-50 text-blue-600 px-6 py-3 rounded-2xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all"
                    >
                      복구하기
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}