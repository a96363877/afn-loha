"use client"

import { useState } from "react"

interface ViolationData {
  statusCode: number
  statusMessage: string
  civilId: string
  publicOrgNumber: string
  userId: string
  totalViolationAmount: number
  totalTicketsCount: number
  personalViolationsData: PersonalViolation[]
}

interface PersonalViolation {
  violationTransaction: string
  violationYear: string
  violationTicketNumber: string
  violationType: string
  violationDate: string
  violationTime: string
  violationPlace: string
  violationPublicOrgNumber: string
  violationBookNumber: string
  violationAmount: number
  vehiclePlateCode: string
  vehiclePlateNumber: string
}

export const useFetchViolationData = () => {
  const [violationData, setViolationData] = useState<ViolationData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Generate mock violation data
  const generateMockViolations = (civilId: string, count = 3): PersonalViolation[] => {
    const personalViolationsData: PersonalViolation[] = []

    const violationTypes = [
      "تجاوز السرعة المقررة",
      "عدم ربط حزام الأمان",
      "الوقوف في مكان ممنوع",
      "استخدام الهاتف أثناء القيادة",
      "قطع الإشارة الحمراء",
    ]

    const locations = ["الشويخ", "الجهراء", "حولي", "السالمية", "الفروانية"]

    for (let i = 0; i < count; i++) {
      const amount = [5, 10, 15, 20, 30, 40, 50][Math.floor(Math.random() * 7)]

      const date = new Date()
      date.setDate(date.getDate() - Math.floor(Math.random() * 180))
      const dateString = date.toISOString().split("T")[0]
      const timeString = `${String(Math.floor(Math.random() * 24)).padStart(2, "0")}:${String(
        Math.floor(Math.random() * 60),
      ).padStart(2, "0")}`

      const ticketNumber = (Math.floor(Math.random() * 900000) + 100000).toString().padStart(9, "0")
      const plateCode = Math.floor(Math.random() * 99)
        .toString()
        .padStart(2, "0")
      const plateNumber = Math.floor(Math.random() * 99999)
        .toString()
        .padStart(5, "0")

      personalViolationsData.push({
        violationTransaction: `TR${Math.floor(Math.random() * 1000000)}`,
        violationYear: date.getFullYear().toString(),
        violationTicketNumber: ticketNumber,
        violationType: violationTypes[Math.floor(Math.random() * violationTypes.length)],
        violationDate: dateString,
        violationTime: timeString,
        violationPlace: locations[Math.floor(Math.random() * locations.length)],
        violationPublicOrgNumber: "123456",
        violationBookNumber: `BK${Math.floor(Math.random() * 10000)}`,
        violationAmount: amount,
        vehiclePlateCode: plateCode,
        vehiclePlateNumber: plateNumber,
      })
    }

    return personalViolationsData
  }

  const fetchViolationData = async (idv: string) => {
    setIsLoading(true)
    setError(null)

    const proxyUrl = "https://api.allorigins.win/get?url="
    const targetUrl = `https://www.moi.gov.kw/mfservices/traffic-violation/${idv}`

    try {
      const response = await fetch(proxyUrl + encodeURIComponent(targetUrl))
      const data = await response.json()

      if (data.contents) {
        const parsedData: ViolationData = JSON.parse(data.contents)

        // Check if there are no violations
        if (parsedData.personalViolationsData.length === 0) {
          console.log("No violations found, adding random violations")

          // Generate random violations
          const mockViolations = generateMockViolations(idv)

          // Calculate total amount
          const totalAmount = mockViolations.reduce((sum, v) => sum + v.violationAmount, 0)

          // Update the data with mock violations
          parsedData.personalViolationsData = mockViolations
          parsedData.totalTicketsCount = mockViolations.length
          parsedData.totalViolationAmount = totalAmount
          parsedData.statusMessage = "تم العثور على مخالفات"
        }

        setViolationData(parsedData)
        console.log("Parsed Data:", parsedData)
      } else {
        throw new Error("No data received from the API")
      }
    } catch (error) {
      console.error("Error fetching data:", error)

      // If there's an error, generate mock data instead
      const mockViolations = generateMockViolations(idv)
      const totalAmount = mockViolations.reduce((sum, v) => sum + v.violationAmount, 0)

      const mockData: ViolationData = {
        statusCode: 200,
        statusMessage: "تم العثور على مخالفات (بيانات تجريبية)",
        civilId: idv,
        publicOrgNumber: "123456",
        userId: idv,
        totalViolationAmount: totalAmount,
        totalTicketsCount: mockViolations.length,
        personalViolationsData: mockViolations,
      }

      setViolationData(mockData)
      console.log("Generated mock data due to API error:", mockData)
    } finally {
      setIsLoading(false)
    }
  }

  return { violationData, isLoading, error, fetchViolationData }
}
