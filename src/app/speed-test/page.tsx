export default function SpeedTestPage() {
  const now = new Date().toLocaleString('ko-KR');
  return (
    <div style={{ padding: '100px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#0070f3', fontSize: '3rem' }}>🚀 배포 속도 테스트 중</h1>
      <p style={{ fontSize: '1.5rem', marginTop: '20px' }}>
        이 화면이 보인다면 <strong>성공</strong>입니다!
      </p>
      <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '10px', display: 'inline-block', marginTop: '30px' }}>
        <p>최종 배포 확인 시각: <strong>{now}</strong></p>
      </div>
      <p style={{ marginTop: '40px', color: '#666' }}>
        SmartStorm님의 main 브랜치 전송 속도를 측정하고 있습니다.
      </p>
    </div>
  );
}