// ตอนเรียกใช้ต้องมี <div> อยู่ข้างในอีกชั้นเพราะ Card ทำงานเป็นแค่ background, shadow, border-radius

export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className='shadow-[20px_20px_35px_#DCDCDC,-20px_-20px_35px_#FAFAFA] rounded-xl bg-white w-full z-[-1]'>
      {children}
    </div>
  )
}
