import { Metadata } from 'next';

// 이 코드가 /admin으로 시작하는 모든 페이지의 '대장' 역할을 합니다.
export const metadata: Metadata = {
  title: "Y&M 관리자",
  manifest: "/manifest-admin.json", // 여기서 한 번만 설정하면 끝!
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* 여기에 나중에 관리자용 상단 바나 메뉴를 넣으시면 됩니다 */}
      {children}
    </section>
  );
}