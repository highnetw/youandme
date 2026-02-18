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

    const { error } = await supabase.from('reservations').insert([
      {
        room_id: roomId,
        customer_name: formData.customer_name,
        phone_number: formData.phone_number,
        check_in: formData.check_in,
        check_out: formData.check_out,
        simple_pwd: formData.simple_pwd,
        total_price: pricePerNight, // 우선 1박 가격으로 세팅
        status: '대기',
      },
    ]);

    if (error) {
      alert('오류 발생: ' + error.message);
    } else {
      alert('예약 신청이 완료되었습니다!');
      // 택시 타고 확인 페이지로 이동!
      router.push(`/check-reservation?name=${formData.customer_name}&pwd=${formData.simple_pwd}`);
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
          onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
        />
        <input 
          type="text" placeholder="연락처" required
          className="w-full p-3 border rounded-xl outline-none focus:border-blue-500"
          onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
        />
        <div className="flex gap-2">
          <input type="date" required className="flex-1 p-3 border rounded-xl"
            onChange={(e) => setFormData({...formData, check_in: e.target.value})} />
          <input type="date" required className="flex-1 p-3 border rounded-xl"
            onChange={(e) => setFormData({...formData, check_out: e.target.value})} />
        </div>
        <input 
          type="password" placeholder="비밀번호 4자리" maxLength={4} required
          className="w-full p-3 border rounded-xl outline-none focus:border-blue-500"
          onChange={(e) => setFormData({...formData, simple_pwd: e.target.value})}
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