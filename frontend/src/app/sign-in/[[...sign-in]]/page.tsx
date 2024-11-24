import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <>
            <div className="flex items-center justify-center flex-col gap-10 ">
                <SignIn 
                appearance={{
                    elements: {
                      footer: { display: 'none' }, // Ẩn phần chân trang
                    },
                  }}
                />
            </div>
        </>

    );
}