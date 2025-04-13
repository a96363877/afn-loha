export default function Loading() {
    return (
      <div className="fixed inset-0 bg-[#0a2463]/80 flex flex-col items-center justify-center z-50" dir="rtl">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-8 border-solid border-[#0a2463] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mb-6"></div>
          
          <h2 className="text-2xl font-bold text-[#0a2463] mb-4">جاري معالجة الدفع</h2>
          
          <p className="text-gray-600 mb-2">يرجى الانتظار بينما نقوم بمعالجة معاملتك</p>
          <p className="text-gray-500 text-sm">لا تقم بإغلاق هذه الصفحة أو تحديثها</p>
          
          <div className="mt-8 flex justify-center space-x-2 rtl:space-x-reverse">
            <div className="h-2 w-2 bg-[#0a2463] rounded-full animate-bounce"></div>
            <div className="h-2 w-2 bg-[#0a2463] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="h-2 w-2 bg-[#0a2463] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
        
        <div className="mt-6 text-white text-sm">
          نحن نعمل على تأمين معاملتك، قد يستغرق ذلك بضع ثوانٍ
        </div>
      </div>
    )
  }
  