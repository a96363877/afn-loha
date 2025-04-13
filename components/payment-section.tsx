"use client";

import { Button } from "@/components/ui/button";
import { Router } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PaymentSectionProps {
  totalAmount: number;
  onPaymentSubmit: () => void;
}

export function PaymentSection({
  totalAmount,
  onPaymentSubmit,
}: PaymentSectionProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const route=useRouter()
  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
    route.push('/knet')

      onPaymentSubmit();
    }, 2000);
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-sm mx-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <div className="font-bold text-lg">إجمالي القيمة المختارة:</div>
        <div className="font-bold text-xl text-[#0a2463]">
          {totalAmount} د.ك
        </div>
      </div>

      <p className="text-sm text-center mb-4 text-gray-700">
        بعد إجراء عملية الدفع، يرجى عدم محاولة الدفع مرة أخرى حيث يجري تحديث
        البيانات خلال 15 دقيقة
      </p>

      <Button
        onClick={handlePayment}
        disabled={isProcessing || totalAmount <= 0}
        className="w-full bg-[#0a2463] hover:bg-[#0a2463]/90 text-white py-2 mb-4"
      >
        {isProcessing ? "جاري المعالجة..." : "إدفع"}
      </Button>

      <div className="flex justify-center gap-2 mt-2">
        <Button className="bg-red-600 hover:bg-[#d62b39] text-white text-xs px-3 py-1 h-auto rounded">
          غير قابلة للدفع الكترونيا
        </Button>
        <Button className="bg-green-600 hover:bg-[#238b7e] text-white text-xs px-3 py-1 h-auto rounded">
          قابلة للدفع الكترونيا
        </Button>
      </div>
    </div>
  );
}
