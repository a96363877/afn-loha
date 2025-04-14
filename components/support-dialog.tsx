"use client"

import React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertCircle, HelpCircle, MessageSquare, Phone } from "lucide-react"
import { useForm, ValidationError } from "@formspree/react"

export function SupportDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [supportTab, setSupportTab] = useState("message")
  const [formSubmitted, setFormSubmitted] = useState(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] text-right" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-[#0a2463] text-center text-xl">مركز المساعدة</DialogTitle>
          <DialogDescription className="text-center text-sm">
            يمكنك الحصول على المساعدة من خلال عدة طرق
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="contact" value={supportTab} onValueChange={setSupportTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="contact" className="text-xs">
              <Phone className="h-4 w-4 ml-1" />
              اتصل بنا
            </TabsTrigger>
            <TabsTrigger value="faq" className="text-xs">
              <HelpCircle className="h-4 w-4 ml-1" />
              الأسئلة الشائعة
            </TabsTrigger>
            <TabsTrigger value="message" className="text-xs">
              <MessageSquare className="h-4 w-4 ml-1" />
              أرسل رسالة
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contact" className="space-y-3">
            <div className="bg-[#f5f5f5] p-3 rounded-md">
              <h4 className="font-bold text-sm mb-2 flex items-center">
                <Phone className="h-4 w-4 ml-1 text-[#0a2463]" />
                مراكز خدمة العملاء
              </h4>
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-white rounded border">
                  <div className="flex justify-between">
                    <span className="font-bold">المركز الرئيسي:</span>
                    <span className="text-[#0a2463] font-bold">1889988</span>
                  </div>
                  <div className="text-gray-500 mt-1">العاصمة - شارع الخليج العربي</div>
                </div>
                <div className="p-2 bg-white rounded border">
                  <div className="flex justify-between">
                    <span className="font-bold">مركز حولي:</span>
                    <span className="text-[#0a2463] font-bold">1885522</span>
                  </div>
                  <div className="text-gray-500 mt-1">حولي - شارع تونس</div>
                </div>
                <div className="p-2 bg-white rounded border">
                  <div className="flex justify-between">
                    <span className="font-bold">مركز الأحمدي:</span>
                    <span className="text-[#0a2463] font-bold">1886633</span>
                  </div>
                  <div className="text-gray-500 mt-1">الأحمدي - شارع الملك فهد</div>
                </div>
              </div>
            </div>

            <div className="bg-[#f5f5f5] p-3 rounded-md">
              <h4 className="font-bold text-sm mb-2">ساعات العمل</h4>
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-white rounded border flex justify-between">
                  <span>الأحد - الخميس:</span>
                  <span>8:00 صباحاً - 2:00 مساءً</span>
                </div>
                <div className="p-2 bg-white rounded border flex justify-between">
                  <span>الجمعة:</span>
                  <span>مغلق</span>
                </div>
                <div className="p-2 bg-white rounded border flex justify-between">
                  <span>السبت:</span>
                  <span>9:00 صباحاً - 1:00 مساءً</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="faq" className="space-y-3">
            <div className="bg-[#f5f5f5] p-3 rounded-md">
              <h4 className="font-bold text-sm mb-2 flex items-center">
                <HelpCircle className="h-4 w-4 ml-1 text-[#0a2463]" />
                الأسئلة الأكثر شيوعاً
              </h4>
              <div className="space-y-3 text-xs">
                <div className="p-2 bg-white rounded border">
                  <p className="font-bold mb-1">ما هي طرق الدفع المتاحة؟</p>
                  <p>
                    يمكن دفع المخالفات المرورية عبر البطاقات البنكية (كي نت، فيزا، ماستركارد) أو من خلال التطبيق
                    الإلكتروني للوزارة أو عبر مراكز الخدمة.
                  </p>
                </div>
                <div className="p-2 bg-white rounded border">
                  <p className="font-bold mb-1">كيف يمكنني الاستعلام عن مخالفاتي المرورية؟</p>
                  <p>
                    يمكنك الاستعلام عن المخالفات المرورية من خلال إدخال الرقم المدني في صفحة الاستعلام الرئيسية، أو من
                    خلال تطبيق وزارة الداخلية، أو عبر الاتصال بمركز خدمة العملاء.
                  </p>
                </div>
                <div className="p-2 bg-white rounded border">
                  <p className="font-bold mb-1">هل يمكن تقسيط دفع المخالفات؟</p>
                  <p>
                    نعم، يمكن تقسيط دفع المخالفات للمواطنين الكويتيين فقط من خلال مراجعة الإدارة العامة للمرور وتقديم
                    طلب التقسيط مع إثبات الحالة المادية.
                  </p>
                </div>
                <div className="p-2 bg-white rounded border">
                  <p className="font-bold mb-1">ماذا يحدث إذا لم أدفع المخالفات المرورية؟</p>
                  <p>
                    عدم دفع المخالفات المرورية قد يؤدي إلى منع تجديد رخصة القيادة أو استكمال معاملات المركبة، وقد يتم
                    حجز المركبة في بعض الحالات.
                  </p>
                </div>
                <div className="p-2 bg-white rounded border">
                  <p className="font-bold mb-1">هل يمكنني الاعتراض على مخالفة مرورية؟</p>
                  <p>
                    نعم، يمكن الاعتراض على المخالفة المرورية خلال 30 يوماً من تاريخ تحريرها من خلال تقديم طلب اعتراض في
                    الإدارة العامة للمرور مع تقديم الأدلة الداعمة.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="message">
            <div className="bg-[#f5f5f5] p-3 rounded-md">
              <h4 className="font-bold text-sm mb-3 flex items-center">
                <MessageSquare className="h-4 w-4 ml-1 text-[#0a2463]" />
                أرسل استفسارك
              </h4>

              {formSubmitted ? (
                <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-md text-center">
                  <p className="font-bold mb-1">تم إرسال رسالتك بنجاح</p>
                  <p className="text-xs">سيتم الرد عليك في أقرب وقت ممكن. شكراً لتواصلك معنا.</p>
                </div>
              ) : (
                <FormspreeContactForm onSuccess={() => setFormSubmitted(true)} />
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="sm:justify-center">
          <div className="flex items-center justify-center text-xs text-gray-500 w-full">
            <AlertCircle className="h-3 w-3 ml-1" />
            للحالات الطارئة، يرجى الاتصال بالرقم المباشر: 112
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function FormspreeContactForm({ onSuccess }: { onSuccess: () => void }) {
  const [state, handleSubmit] = useForm("mdkebvqk")

  React.useEffect(() => {
    if (state.succeeded) {
      onSuccess()
    }
  }, [state.succeeded, onSuccess])

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-xs" dir="rtl" >
      <div className="grid grid-cols-1 gap-3 ">
        <div className="space-y-1">
        <input className="p-3  w-full" id="name" name="name" placeholder="أدخل اسمك الكامل" required />

        </div>
        <div className="space-y-1">
          <input className="p-3  w-full" id="phone" name="phone" placeholder="أدخل رقم هاتفك" required />

        </div>
      </div>
      <div className="space-y-1">
        <input className="p-3   w-full"  id="email" name="email" type="email" placeholder="أدخل بريدك الإلكتروني" required />

        <ValidationError
          prefix="البريد الإلكتروني"
          field="email"
          errors={state.errors}
          className="text-red-500 text-[10px] mt-1"
        />
      </div>
      <div className="space-y-1">
        <textarea className="w-full p-2"
         id="message" name="message" placeholder="اكتب استفسارك أو مشكلتك هنا" rows={4} required />
        <ValidationError
          prefix="الرسالة"
          field="message"
          errors={state.errors}
          className="text-red-500 text-[10px] mt-1"
        />
      </div>
      <Button type="submit" className="w-full bg-[#0a2463]" disabled={state.submitting}>
        {state.submitting ? "جاري الإرسال..." : "إرسال"}
      </Button>
    </form>
  )
}
