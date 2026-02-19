'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface BookingFormProps {
  roomId: string;
  pricePerNight: number;
}

export default function BookingForm({ roomId, pricePerNight }: BookingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    phone_number: '',
    check_in: '',
    check_out: '',
    simple_pwd: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // --- [추가된 로직: 숙박 일수 계산] ---
    const start = new Date(formData.check_in);
    const end = new Date(formData.check_out);

    // 날짜 차이 계산 (밀리초 단위 -> 일 단위)
    const diffTime = end.getTime() - start.getTime();
    const stayNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // 예약 유효성 검사: 체크아웃이 체크인보다 빨라선 안됨
    if (stayNights <= 0) {
      alert("체크아웃 날짜는 체크인 이후여야 합니다.");
      setLoading(false);
      return;
    }

    // 총액 계산: 숙박 일수 * 1박 금액
    const total_price = stayNights * pricePerNight;
    // ---------------------------------------
    const { error } = await supabase.from('reservations').insert([
      {
        room_id: roomId,
        customer_name: formData.customer_name,
        phone_number: formData.phone_number,
        check_in: formData.check_in,
        check_out: formData.check_out,
        simple_pwd: formData.simple_pwd,
        total_price: total_price,
        status: '대기',
      },
    ]);

    if (error) {
      alert('오류: ' + error.message);
    } else {
      // ★ 이 부분이 핵심입니다! 
      // 1. 사용자에게 완료를 알리고
      alert(`${formData.customer_name}님, ${stayNights}박 예약 신청이 완료되었습니다!\n총 결제금액: ₩${total_price.toLocaleString()}원`);
      // 2. 예약 확인 페이지로 이동시키되, 브라우저 기록을 교체(replace)하여 
      // 뒤로가기를 눌러도 다시 예약 폼으로 오지 않게 합니다.
      router.replace(`/check-reservation?name=${formData.customer_name}&pwd=${formData.simple_pwd}`);
    }
    setLoading(false);
  };

  return (
    <div className="mt-10 p-8 bg-white rounded-3xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-blue-900 italic">Reservation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text" placeholder="성함" required
          className="w-full p-3 border rounded-xl outline-none focus:border-blue-500"
          onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
        />
        <input
          type="text" placeholder="연락처" required
          className="w-full p-3 border rounded-xl outline-none focus:border-blue-500"
          onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
        />
        <div className="flex gap-2">
          <input type="date" required className="flex-1 p-3 border rounded-xl"
            onChange={(e) => setFormData({ ...formData, check_in: e.target.value })} />
          <input type="date" required className="flex-1 p-3 border rounded-xl"
            onChange={(e) => setFormData({ ...formData, check_out: e.target.value })} />
        </div>
        <input
          type="password" placeholder="비밀번호 4자리" maxLength={4} required
          className="w-full p-3 border rounded-xl outline-none focus:border-blue-500"
          onChange={(e) => setFormData({ ...formData, simple_pwd: e.target.value })}
        />
        <button
          disabled={loading}
          className="w-full bg-[#0056b3] text-white p-4 rounded-2xl font-bold hover:bg-blue-800 transition-all shadow-md"
        >
          {loading ? '신청 중...' : '예약 신청하기'}
        </button>
      </form>
    </div>
  );
}