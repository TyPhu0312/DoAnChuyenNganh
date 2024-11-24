import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return <div className="flex items-center justify-center flex-col gap-10 ">
  <SignUp 
  appearance={{
    elements: {
      footer: { display: 'none' }, // Ẩn phần chân trang
    },
  }}
  />
</div>;
}