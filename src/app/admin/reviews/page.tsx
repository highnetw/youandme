import { supabase } from '@/lib/supabase';

export const revalidate = 0;

export default async function AdminReviewPage() {
  // 회장님이 주신 명세서의 컬럼명(user_name, rating 등)을 정확히 반영했습니다.
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
      {/* 헤더 섹션 */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-gray-800">
            Review <span className="text-[#B8860B]">Management</span>
          </h1>
          <p className="text-gray-500 mt-1 text-sm italic text-balance">회장님 전용 펜션 리뷰 관리 장부입니다.</p>
        </div>
        <div className="bg-white px-5 py-2 rounded-2xl shadow-sm border border-gray-100 text-xs font-bold text-gray-600">
          전체 리뷰 <span className="text-[#B8860B] ml-1">{reviews?.length || 0}</span>건
        </div>
      </header>

      {/* 메인 컨텐츠 영역 */}
      <div className="bg-white rounded-[24px] shadow-xl border border-gray-100 overflow-hidden">
        
        {/* 🖥️ [웹 버전] 화면이 넓을 때 (PC/태블릿 가로) */}
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
                    <div className="font-semibold text-gray-900">{review.rooms?.title || '정보없음'}</div>
                    <div className="text-xs text-gray-400">{review.user_name || '익명'}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex text-amber-400 text-xs">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < (review.rating || 0) ? "opacity-100" : "opacity-20"}>★</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-gray-600 max-w-lg leading-relaxed text-sm">
                    {review.content}
                  </td>
                  <td className="px-8 py-6 text-gray-400 text-xs font-mono text-right">
                    {new Date(review.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 📱 [앱 버전] 화면이 좁을 때 (스마트폰) */}
        <div className="md:hidden divide-y divide-gray-50">
          {reviews?.map((review: any) => (
            <div key={review.id} className="p-6 active:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-[#B8860B] font-bold text-xs tracking-tighter uppercase mb-1 block">
                    {review.rooms?.title}
                  </span>
                  <h3 className="text-gray-900 font-bold text-base">{review.user_name || '익명'} 님</h3>
                </div>
                <div className="flex text-amber-400 text-[10px]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < (review.rating || 0) ? "opacity-100" : "opacity-20"}>★</span>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-2xl text-gray-700 text-sm leading-relaxed mb-3 italic shadow-inner">
                "{review.content}"
              </div>
              
              <div className="text-right text-[10px] text-gray-400 font-mono">
                {new Date(review.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
          
          {/* 리뷰가 없을 때 표시 */}
          {(!reviews || reviews.length === 0) && (
            <div className="p-20 text-center text-gray-400 italic">
              아직 작성된 리뷰가 없습니다.
            </div>
          )}
        </div>
      </div>
      
      {/* 하단 여백용 (PWA 바에 가려지지 않게) */}
      <div className="h-10"></div>
    </div>
  );
}