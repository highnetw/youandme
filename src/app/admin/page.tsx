'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

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

  // 2. 예약 상태 업데이트 (대기 -> 확정 / 확정 -> 취소 등)
  const updateStatus = async (id: string, newStatus: string) => {
    // 사용자에게 한 번 더 물어보는 센스!
    if (!confirm(`예약 상태를 [${newStatus}] 상태로 변경하시겠습니까?`)) return;

    const { error } = await supabase
      .from('reservations')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert('상태 업데이트 실패: ' + error.message);
    } else {
      fetchReservations(); // DB 변경 후 목록 새로고침
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">데이터를 불러오는 중입니다...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-serif italic">Admin Console</h1>
            <p className="text-xs text-gray-500 mt-1">Stay YouandMe 예약 관리 시스템</p>
          </div>
          <button 
            onClick={fetchReservations}
            className="text-sm bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            새로고침
          </button>
        </header>

        <div className="space-y-4">
          {reservations.length === 0 ? (
            <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-300">
              <p className="text-gray-500">아직 예약 내역이 없습니다.</p>
            </div>
          ) : (
            reservations.map((res) => (
              <div key={res.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-6 transition-all hover:shadow-md">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      res.status === '대기' ? 'bg-amber-100 text-amber-700' : 
                      res.status === '확정' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-50 text-red-600'
                    }`}>
                      {res.status}
                    </span>
                    <h3 className="font-bold text-lg text-gray-900">{res.customer_name} 님</h3>
                  </div>
                  
                  <div className="text-gray-800">
                    <p className="text-sm">
                      <span className="font-bold text-lg text-[#0056b3]">[{res.rooms?.title}]</span>
                      <span className="mx-2 text-gray-300">|</span>
                      <span className="font-medium text-gray-600">
                        {String(res.check_in).slice(2)} ~ {String(res.check_out).slice(2)}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">연락처: {res.phone_number}</p>
                    <p className="font-bold text-gray-900 mt-2">
                      결제금액: <span className="text-blue-600">₩{res.total_price?.toLocaleString()}</span>
                    </p>
                  </div>
                </div>

                {/* 🛠️ 상태 변경 버튼 섹션 */}
                <div className="flex items-center gap-2 self-end md:self-center">
                  {/* 대기 상태일 때만 확정 버튼 노출 */}
                  {res.status === '대기' && (
                    <button 
                      onClick={() => updateStatus(res.id, '확정')}
                      className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all hover:bg-black active:scale-95 shadow-sm"
                    >
                      입금확인 (확정)
                    </button>
                  )}

                  {/* 확정 상태일 때 대기로 되돌리는 버튼 (실수 방지용) */}
                  {res.status === '확정' && (
                    <button 
                      onClick={() => updateStatus(res.id, '대기')}
                      className="bg-white border border-gray-200 text-gray-500 px-5 py-2.5 rounded-xl text-xs font-bold transition-all hover:bg-gray-50 active:scale-95"
                    >
                      확정취소 (대기)
                    </button>
                  )}

                  {/* 취소 상태가 아닐 때만 취소 버튼 노출 */}
                  {res.status !== '취소' && (
                    <button 
                      onClick={() => updateStatus(res.id, '취소')}
                      className="bg-white border border-red-100 text-red-400 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-red-50 hover:text-red-600 transition-all active:scale-95"
                    >
                      예약취소
                    </button>
                  )}
                  
                  {/* 취소된 예약은 다시 대기로 살릴 수 있게 추가 */}
                  {res.status === '취소' && (
                    <button 
                      onClick={() => updateStatus(res.id, '대기')}
                      className="bg-blue-50 text-blue-600 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-100 transition-all"
                    >
                      예약복구 (대기)
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