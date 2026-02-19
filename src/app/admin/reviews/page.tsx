import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const revalidate = 0;

export default async function AdminReviewPage() {
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select(`
      id,
      user_name,
      rating,
      content,
      created_at,
      rooms (
        title
      )
    `)
    .order('created_at', { ascending: false });

  if (error) return <div className="p-10 text-red-500">데이터 로드 실패: {error.message}</div>;

  return (
    <div className="p-4 md:p-8 bg-[#FDFCF8] min-h-screen pb-20">
      <div className="max-w-4xl mx-auto">
        
        {/* 🚀 [추가] 어드민 통합 네비게이션 - 예약 관리 페이지와 똑같은 디자인 */}
        <nav className="flex gap-2 mb-10 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
          <Link href="/admin" className="flex-1 text-center py-3.5 rounded-xl bg-white text-gray-400 font-bold text-sm hover:bg-gray-50 transition-all">
            📅 예약 관리
          </Link>
          <Link href="/admin/reviews" className="flex-1 text-center py-3.5 rounded-xl bg-gray-900 text-white font-bold text-sm shadow-md">
            ✍️ 리뷰 관리
          </Link>
        </nav>

        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif text-gray-800 italic font-bold">
              Review <span className="text-[#B8860B]">Master</span>
            </h1>
            <p className="text-gray-500 mt-1 text-xs italic">회장님, 고객님들의 소중한 한마디입니다.</p>
          </div>
          <div className="bg-white px-5 py-2 rounded-2xl shadow-sm border border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Total Reviews: {reviews?.length || 0}
          </div>
        </header>

        {/* 📋 리뷰 목록 (기존의 웹/앱 반응형 코드 유지) */}
        <div className="bg-white rounded-[32px] shadow-xl border border-gray-100 overflow-hidden">
          
          {/* 🖥️ 웹용 표 */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-400 text-[11px] uppercase tracking-widest border-b">
                <tr>
                  <th className="px-8 py-5">방 이름 / 작성자</th>
                  <th className="px-8 py-5">평점</th>
                  <th className="px-8 py-5">리뷰 내용</th>
                  <th className="px-8 py-5 text-right">작성일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reviews?.map((review: any) => (
                  <tr key={review.id} className="hover:bg-amber-50/20 transition-all">
                    <td className="px-8 py-6">
                      <div className="font-bold text-gray-900">{review.rooms?.title}</div>
                      <div className="text-xs text-gray-400">{review.user_name || '익명'}</div>
                    </td>
                    <td className="px-8 py-6 text-amber-400 text-xs">
                      {"★".repeat(review.rating || 0)}{"☆".repeat(5 - (review.rating || 0))}
                    </td>
                    <td className="px-8 py-6 text-gray-600 text-sm italic italic leading-relaxed">
                      "{review.content}"
                    </td>
                    <td className="px-8 py-6 text-gray-400 text-[10px] font-mono text-right">
                      {new Date(review.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 📱 앱용 카드 */}
          <div className="md:hidden divide-y divide-gray-50">
            {reviews?.map((review: any) => (
              <div key={review.id} className="p-6 active:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-[#B8860B] font-bold text-[10px] uppercase block mb-1">
                      {review.rooms?.title}
                    </span>
                    <h3 className="text-gray-900 font-bold">{review.user_name || '익명'} 님</h3>
                  </div>
                  <div className="text-amber-400 text-[10px]">
                    {"★".repeat(review.rating || 0)}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl text-gray-600 text-sm italic mb-2">
                  "{review.content}"
                </div>
                <div className="text-right text-[10px] text-gray-300 font-mono">
                  {new Date(review.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}