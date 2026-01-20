import { useForm } from '@tanstack/react-form'
import { domToPng } from 'modern-screenshot'
import { useRef, useState } from 'react'

const FUAZ_GREEN = '#006837'
const FUAZ_GOLD = '#d4af37'
const FUAZ_DARK = '#0f2b1d'

interface StudentData {
  name: string
  id: string
  dept: string
  nok: string
  blood: string
  valid: string
  photoSeed: string
  photoFile: string | null
  signature: string
}

interface StaffData {
  name: string
  id: string
  status: string
  dept: string
  nok: string
  blood: string
  photoSeed: string
  photoFile: string | null
  signature: string
}

type CardData = StudentData | StaffData

export function FUAZIDCardSuite() {
  const [activeForm, setActiveForm] = useState<'student' | 'staff'>('student')
  const [studentData, setStudentData] = useState<StudentData>({
    name: 'FATIMA A. USMAN',
    id: 'FUAZ/23/AGR/0567',
    dept: 'AGRONOMY',
    nok: '0803 123 4567',
    blood: 'O+',
    valid: '06/2027',
    photoSeed: 'Fatima',
    photoFile: null,
    signature: 'Fatima.U',
  })

  const [staffData, setStaffData] = useState<StaffData>({
    name: 'DR. AMINU M. BELLO',
    id: 'FUAZ/STF/00123',
    status: 'SENIOR LECTURER',
    dept: 'AGRIC ECONOMICS',
    nok: '0803 555 9988',
    blood: 'B+',
    photoSeed: 'DrAminu',
    photoFile: null,
    signature: 'A.M. Bello',
  })

  const studentFrontRef = useRef<HTMLDivElement>(null)
  const studentBackRef = useRef<HTMLDivElement>(null)
  const staffFrontRef = useRef<HTMLDivElement>(null)
  const staffBackRef = useRef<HTMLDivElement>(null)

  const studentForm = useForm({
    defaultValues: studentData,
    onSubmit: ({ value }) => {
      setStudentData(value)
    },
  })

  const staffForm = useForm({
    defaultValues: staffData,
    onSubmit: ({ value }) => {
      setStaffData(value)
    },
  })

  const handleFileChange = (file: File | undefined, isStudent: boolean) => {
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (isStudent) {
          setStudentData((prev) => ({ ...prev, photoFile: result }))
        } else {
          setStaffData((prev) => ({ ...prev, photoFile: result }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const captureCard = async (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return null
    try {
      return await domToPng(ref.current, {
        scale: 2,
        backgroundColor: '#ffffff',
      })
    } catch (err) {
      console.error('Capture failed:', err)
      throw err
    }
  }

  const downloadCard = async (
    ref: React.RefObject<HTMLDivElement | null>,
    filename: string,
  ) => {
    try {
      console.log(`Starting capture for ${filename}...`)
      const dataUrl = await captureCard(ref)
      if (!dataUrl) {
        throw new Error('Failed to capture card image')
      }

      console.log(`Triggering download for ${filename}...`)
      const link = document.createElement('a')
      link.download = filename
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      console.log(`Download triggered successfully for ${filename}`)
    } catch (err) {
      console.error(`Download failed for ${filename}:`, err)
      alert(
        `Failed to download card: ${err instanceof Error ? err.message : 'Unknown error'}`,
      )
    }
  }

  const printCard = async (ref: React.RefObject<HTMLDivElement | null>) => {
    try {
      const dataUrl = await captureCard(ref)
      if (!dataUrl) throw new Error('Failed to capture card image')

      const printWindow = window.open('', '_blank')
      if (!printWindow) throw new Error('Could not open print window')

      printWindow.document.write(`
        <html>
          <head><title>Print Preview</title></head>
          <body style="margin:0; padding:0; display:flex; justify-content:center; align-items:center; min-height:100vh; background:#f0f0f0;">
            <img src="${dataUrl}" style="max-width:100%; height:auto; box-shadow: 0 0 20px rgba(0,0,0,0.2);" onload="window.print();window.close();" />
          </body>
        </html>
      `)
      printWindow.document.close()
    } catch (err) {
      console.error('Print failed:', err)
      alert(
        `Failed to print: ${err instanceof Error ? err.message : 'Unknown error'}`,
      )
    }
  }


  const getPhotoUrl = (data: CardData) => {
    if (data.photoFile) return data.photoFile
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.photoSeed}${'status' in data ? '&clothing=blazerAndShirt' : ''
      }`
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 font-sans">
      <h1
        className="text-3xl font-bold text-center mb-2"
        style={{ color: FUAZ_DARK }}
      >
        FUAZ Identity Card Design Suite
      </h1>
      <p className="text-center text-gray-600 mb-10 text-sm">
        Student (Portrait) • Staff (Landscape)
      </p>

      {/* Form Container */}
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg p-8 mb-10 border border-gray-200">
        <div className="flex justify-between items-center mb-6 border-b-2 border-gray-100 pb-4">
          <h2 className="text-2xl font-bold m-0" style={{ color: FUAZ_GREEN }}>
            ID Card Information
          </h2>
          <div className="flex bg-gray-100 p-1.5 rounded-xl gap-1.5">
            <button
              onClick={() => setActiveForm('student')}
              className={`px-5 py-2 rounded-lg font-bold transition-all ${activeForm === 'student'
                ? 'bg-white shadow-md text-green-800'
                : 'bg-transparent text-gray-600'
                }`}
            >
              Student
            </button>
            <button
              onClick={() => setActiveForm('staff')}
              className={`px-5 py-2 rounded-lg font-bold transition-all ${activeForm === 'staff'
                ? 'bg-white shadow-md text-green-800'
                : 'bg-transparent text-gray-600'
                }`}
            >
              Staff
            </button>
          </div>
        </div>

        {/* Student Form */}
        {activeForm === 'student' && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              studentForm.handleSubmit()
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fadeIn"
          >
            <studentForm.Field name="name">
              {(field) => (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value)
                      setStudentData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }}
                    placeholder="FATIMA A. USMAN"
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl font-medium text-base transition-all focus:outline-none focus:border-green-700 focus:bg-green-50"
                  />
                </div>
              )}
            </studentForm.Field>

            <studentForm.Field name="id">
              {(field) => (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Matrix Number
                  </label>
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value)
                      setStudentData((prev) => ({
                        ...prev,
                        id: e.target.value,
                      }))
                    }}
                    placeholder="FUAZ/23/AGR/0567"
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl font-medium text-base transition-all focus:outline-none focus:border-green-700 focus:bg-green-50"
                  />
                </div>
              )}
            </studentForm.Field>

            <studentForm.Field name="dept">
              {(field) => (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Department
                  </label>
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value)
                      setStudentData((prev) => ({
                        ...prev,
                        dept: e.target.value,
                      }))
                    }}
                    placeholder="AGRONOMY"
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl font-medium text-base transition-all focus:outline-none focus:border-green-700 focus:bg-green-50"
                  />
                </div>
              )}
            </studentForm.Field>

            <studentForm.Field name="nok">
              {(field) => (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Next of Kin Number
                  </label>
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value)
                      setStudentData((prev) => ({
                        ...prev,
                        nok: e.target.value,
                      }))
                    }}
                    placeholder="0803 123 4567"
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl font-medium text-base transition-all focus:outline-none focus:border-green-700 focus:bg-green-50"
                  />
                </div>
              )}
            </studentForm.Field>

            <studentForm.Field name="blood">
              {(field) => (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Blood Group
                  </label>
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value)
                      setStudentData((prev) => ({
                        ...prev,
                        blood: e.target.value,
                      }))
                    }}
                    placeholder="O+"
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl font-medium text-base transition-all focus:outline-none focus:border-green-700 focus:bg-green-50"
                  />
                </div>
              )}
            </studentForm.Field>

            <studentForm.Field name="valid">
              {(field) => (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Valid Thru
                  </label>
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value)
                      setStudentData((prev) => ({
                        ...prev,
                        valid: e.target.value,
                      }))
                    }}
                    placeholder="06/2027"
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl font-medium text-base transition-all focus:outline-none focus:border-green-700 focus:bg-green-50"
                  />
                </div>
              )}
            </studentForm.Field>

            <studentForm.Field name="photoSeed">
              {(field) => (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Avatar Seed (DiceBear)
                  </label>
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value)
                      setStudentData((prev) => ({
                        ...prev,
                        photoSeed: e.target.value,
                      }))
                    }}
                    placeholder="Fatima"
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl font-medium text-base transition-all focus:outline-none focus:border-green-700 focus:bg-green-50"
                  />
                </div>
              )}
            </studentForm.Field>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-600 uppercase">
                Upload Passport Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files?.[0], true)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl font-medium text-base transition-all focus:outline-none focus:border-green-700"
              />
            </div>

            <studentForm.Field name="signature">
              {(field) => (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Signature Name
                  </label>
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value)
                      setStudentData((prev) => ({
                        ...prev,
                        signature: e.target.value,
                      }))
                    }}
                    placeholder="Fatima.U"
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl font-medium text-base transition-all focus:outline-none focus:border-green-700 focus:bg-green-50"
                  />
                </div>
              )}
            </studentForm.Field>
          </form>
        )}

        {/* Staff Form */}
        {activeForm === 'staff' && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              staffForm.handleSubmit()
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fadeIn"
          >
            <staffForm.Field name="name">
              {(field) => (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value)
                      setStaffData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }}
                    placeholder="DR. AMINU M. BELLO"
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl font-medium text-base transition-all focus:outline-none focus:border-green-700 focus:bg-green-50"
                  />
                </div>
              )}
            </staffForm.Field>

            <staffForm.Field name="id">
              {(field) => (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Staff ID
                  </label>
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value)
                      setStaffData((prev) => ({ ...prev, id: e.target.value }))
                    }}
                    placeholder="FUAZ/STF/00123"
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl font-medium text-base transition-all focus:outline-none focus:border-green-700 focus:bg-green-50"
                  />
                </div>
              )}
            </staffForm.Field>

            <staffForm.Field name="status">
              {(field) => (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Status / Designation
                  </label>
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value)
                      setStaffData((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }}
                    placeholder="SENIOR LECTURER"
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl font-medium text-base transition-all focus:outline-none focus:border-green-700 focus:bg-green-50"
                  />
                </div>
              )}
            </staffForm.Field>

            <staffForm.Field name="dept">
              {(field) => (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Department / Unit
                  </label>
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value)
                      setStaffData((prev) => ({
                        ...prev,
                        dept: e.target.value,
                      }))
                    }}
                    placeholder="AGRIC ECONOMICS"
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl font-medium text-base transition-all focus:outline-none focus:border-green-700 focus:bg-green-50"
                  />
                </div>
              )}
            </staffForm.Field>

            <staffForm.Field name="nok">
              {(field) => (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Next of Kin Number
                  </label>
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value)
                      setStaffData((prev) => ({ ...prev, nok: e.target.value }))
                    }}
                    placeholder="0803 555 9988"
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl font-medium text-base transition-all focus:outline-none focus:border-green-700 focus:bg-green-50"
                  />
                </div>
              )}
            </staffForm.Field>

            <staffForm.Field name="blood">
              {(field) => (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Blood Group
                  </label>
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value)
                      setStaffData((prev) => ({
                        ...prev,
                        blood: e.target.value,
                      }))
                    }}
                    placeholder="B+"
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl font-medium text-base transition-all focus:outline-none focus:border-green-700 focus:bg-green-50"
                  />
                </div>
              )}
            </staffForm.Field>

            <staffForm.Field name="photoSeed">
              {(field) => (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Avatar Seed (DiceBear)
                  </label>
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value)
                      setStaffData((prev) => ({
                        ...prev,
                        photoSeed: e.target.value,
                      }))
                    }}
                    placeholder="DrAminu"
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl font-medium text-base transition-all focus:outline-none focus:border-green-700 focus:bg-green-50"
                  />
                </div>
              )}
            </staffForm.Field>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-600 uppercase">
                Upload Passport Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files?.[0], false)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl font-medium text-base transition-all focus:outline-none focus:border-green-700"
              />
            </div>

            <staffForm.Field name="signature">
              {(field) => (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Signature Name
                  </label>
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value)
                      setStaffData((prev) => ({
                        ...prev,
                        signature: e.target.value,
                      }))
                    }}
                    placeholder="A.M. Bello"
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl font-medium text-base transition-all focus:outline-none focus:border-green-700 focus:bg-green-50"
                  />
                </div>
              )}
            </staffForm.Field>
          </form>
        )}
      </div>


      {/* Cards Grid */}
      <div className="flex flex-col gap-10">
        {/* Student Card */}
        {activeForm === 'student' && (
          <StudentCard
            data={studentData}
            frontRef={studentFrontRef}
            backRef={studentBackRef}
            getPhotoUrl={getPhotoUrl}
            downloadCard={downloadCard}
            printCard={printCard}
          />
        )}

        {/* Staff Card */}
        {activeForm === 'staff' && (
          <StaffCard
            data={staffData}
            frontRef={staffFrontRef}
            backRef={staffBackRef}
            getPhotoUrl={getPhotoUrl}
            downloadCard={downloadCard}
            printCard={printCard}
          />
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Great+Vibes&display=swap');
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease;
        }
      `}</style>
    </div>
  )
}

interface IDCardProps<T> {
  data: T
  frontRef: React.RefObject<HTMLDivElement | null>
  backRef: React.RefObject<HTMLDivElement | null>
  getPhotoUrl: (data: T) => string
  downloadCard: (
    ref: React.RefObject<HTMLDivElement | null>,
    filename: string,
  ) => Promise<void>
  printCard: (ref: React.RefObject<HTMLDivElement | null>) => Promise<void>
}

function DownloadButton({
  onClick,
  label,
}: {
  onClick: () => Promise<void>
  label: string
}) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      await onClick()
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="mt-4 px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all shadow-md hover:shadow-lg bg-green-700 hover:bg-green-800 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Capturing...
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          {label}
        </>
      )}
    </button>
  )
}

function PrintButton({
  onClick,
  label,
}: {
  onClick: () => Promise<void>
  label: string
}) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      await onClick()
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="mt-4 px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all shadow-md hover:shadow-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Preparing...
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          {label}
        </>
      )}
    </button>
  )
}

function StudentCard({
  data,
  frontRef,
  backRef,
  getPhotoUrl,
  downloadCard,
  printCard,
}: IDCardProps<StudentData>) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-10 p-5 bg-white rounded-3xl shadow-lg mx-auto max-w-7xl">
      {/* Front */}
      <div className="flex flex-col items-center ">
        <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-widest text-center">
          Front View (Portrait)
        </div>
        <div
          ref={frontRef}
          className="relative bg-white overflow-hidden flex flex-col shadow-2xl"
          style={{
            width: '318.75px',
            height: '506.25px',
            borderRadius: '18.75px',
          }}
        >
          {/* Security Background */}
          <div
            className="absolute inset-0 opacity-[0.07] z-0"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, ${FUAZ_GREEN} 0, ${FUAZ_GREEN} 1px, transparent 0, transparent 50%)`,
              backgroundSize: '20px 20px',
            }}
          />

          {/* Watermark */}
          <img
            src="/fuaz.jpeg"
            className="absolute opacity-[0.065] z-0 grayscale"
            style={{
              top: '60%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '60%',
            }}
            alt="Watermark"
          />

          {/* Header */}
          <div
            className="text-white py-0.5 relative z-10 flex flex-col items-center"
            style={{
              backgroundColor: FUAZ_DARK,
              borderBottom: `2.5px solid ${FUAZ_GOLD}`,
            }}
          >
            <img
              src="/fuaz.jpeg"
              alt="FUAZ Logo"
              className="w-7 h-7 bg-white rounded-full p-0.5 mb-0.5 object-contain"
            />
            <div className="flex flex-col items-center whitespace-nowrap">
              <div className="text-[11px] font-extrabold uppercase mb-0 leading-tight">
                FEDERAL UNIVERSITY OF AGRICULTURE ZURU
              </div>
              <div className="text-[8px] opacity-90 font-medium">
                P.M.B 28, ZURU, KEBBI STATE
              </div>
            </div>
          </div>

          {/* Title Banner */}
          <div
            className="py-0.5 text-center text-[13px] font-extrabold tracking-wider relative z-10 whitespace-nowrap"
            style={{ backgroundColor: FUAZ_GOLD }}
          >
            STUDENT ID CARD
          </div>

          {/* Content */}
          <div className="flex flex-col items-center flex-grow relative z-10 px-[18.75px] py-1.5 gap-1">
            {/* Photo Box */}
            <div className="flex flex-col items-center w-[140px]">
              <div
                className="w-[140px] h-[175px] rounded-xl overflow-hidden bg-gray-200 mb-0.5"
                style={{ border: `2px solid ${FUAZ_GREEN}` }}
              >
                <img
                  src={getPhotoUrl(data)}
                  alt="Student"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center w-full pt-1">
                <div
                  className="text-base leading-none mb-0.5"
                  style={{ fontFamily: "'Great Vibes', cursive" }}
                >
                  {data.signature}
                </div>
                <div
                  className="w-full mb-0.5"
                  style={{ borderTop: `1px solid ${FUAZ_GREEN}` }}
                />
                <div className="text-[8px] text-gray-600 font-bold uppercase whitespace-nowrap">
                  HOLDER'S SIGNATURE
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="w-full flex flex-col items-center">
              <div
                className="text-[16px] font-extrabold uppercase border-b border-gray-300 pb-0.5 mb-1 leading-tight text-center w-full whitespace-nowrap overflow-hidden text-ellipsis"
                style={{ color: FUAZ_DARK }}
              >
                {data.name}
              </div>

              <div className="w-full flex flex-col gap-0.5">
                {/* ID Centered */}
                <div className="text-center border-b border-dashed border-gray-200 pb-0.5 mb-0.5">
                  <div
                    className="text-[14px] font-bold whitespace-nowrap"
                    style={{ color: FUAZ_GREEN }}
                  >
                    {data.id}
                  </div>
                </div>

                <div className="text-center w-full">
                  <div className="text-[9px] font-bold text-gray-600 uppercase mb-0 whitespace-nowrap">
                    DEPT/UNIT
                  </div>
                  <div className="text-[11px] font-bold leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                    {data.dept}
                  </div>
                </div>

                <div className="text-center w-full">
                  <div className="text-[9px] font-bold text-gray-600 uppercase mb-0 whitespace-nowrap">
                    NOK Number
                  </div>
                  <div className="text-[11px] font-bold leading-tight whitespace-nowrap">
                    {data.nok}
                  </div>
                </div>

                {/* Split Row */}
                <div className="grid grid-cols-2 gap-2 w-full mt-0.5">
                  <div className="text-center">
                    <div className="text-[9px] font-bold text-gray-600 uppercase mb-0 whitespace-nowrap">
                      BLOOD
                    </div>
                    <div className="text-[11px] font-bold leading-tight text-red-700 whitespace-nowrap">
                      {data.blood}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-[9px] font-bold text-gray-600 uppercase mb-0 whitespace-nowrap">
                      VALID THRU
                    </div>
                    <div className="text-[11px] font-bold leading-tight text-red-700 whitespace-nowrap">
                      {data.valid}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <DownloadButton
            onClick={() => downloadCard(frontRef, 'FUAZ_Student_Front.png')}
            label="Download PNG"
          />
          <PrintButton
            onClick={() => printCard(frontRef)}
            label="Print Front"
          />
        </div>
      </div>

      {/* Back */}
      <div className="flex flex-col items-center">
        <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-widest text-center">
          Back View (Portrait)
        </div>
        <div
          ref={backRef}
          className="relative bg-white overflow-hidden flex flex-col shadow-2xl"
          style={{
            width: '318.75px',
            height: '506.25px',
            borderRadius: '18.75px',
          }}
        >
          <div
            className="h-8 w-full relative z-10 mt-4"
            style={{ backgroundColor: '#1a1a1a' }}
          />

          <div
            className="absolute inset-0 opacity-[0.07] z-0"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, ${FUAZ_GREEN} 0, ${FUAZ_GREEN} 1px, transparent 0, transparent 50%)`,
              backgroundSize: '20px 20px',
            }}
          />

          <div className="px-[18.75px] py-4 flex flex-col flex-grow relative z-10">
            <div className="text-[16.5px] font-extrabold leading-snug text-justify mb-4 mt-3">
              <p className="mb-2">
                This identity is not transferable. It must be produced at any
                time if requested by any office of the University or authorized
                person(s)
              </p>
              <p className="mb-0">
                Loss of this card must be reported immediately to the Registrar,
                FUAZ, P.M.B 28, Kebbi State, or to the nearest Police Station.
              </p>
            </div>

            <div className="mt-auto text-center pb-4">
              <div className="inline-block text-center whitespace-nowrap">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Signature_sample.svg/1200px-Signature_sample.svg.png"
                  alt="Registrar's Signature"
                  className="h-[35px] opacity-90 mx-auto"
                />
                <div
                  className="w-[100px] mx-auto my-1"
                  style={{ borderTop: `1px solid ${FUAZ_GREEN}` }}
                />
                <div className="text-[11px] text-gray-700 font-extrabold uppercase">
                  REGISTRAR'S SIGNATURE
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <DownloadButton
            onClick={() => downloadCard(backRef, 'FUAZ_Student_Back.png')}
            label="Download PNG"
          />
          <PrintButton onClick={() => printCard(backRef)} label="Print Back" />
        </div>
      </div>
    </div>
  )
}

function StaffCard({
  data,
  frontRef,
  backRef,
  getPhotoUrl,
  downloadCard,
  printCard,
}: IDCardProps<StaffData>) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-10 p-5 bg-white rounded-3xl shadow-lg mx-auto max-w-7xl">
      {/* Front */}
      <div className="flex flex-col items-center">
        <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-widest text-center">
          Front View (Landscape)
        </div>
        <div
          ref={frontRef}
          className="relative bg-white overflow-hidden flex flex-col shadow-2xl"
          style={{
            width: '506.25px',
            height: '318.75px',
            borderRadius: '18.75px',
          }}
        >
          {/* Security Background */}
          <div
            className="absolute inset-0 opacity-[0.07] z-0"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, ${FUAZ_GREEN} 0, ${FUAZ_GREEN} 1px, transparent 0, transparent 50%)`,
              backgroundSize: '20px 20px',
            }}
          />

          {/* Watermark */}
          <img
            src="/fuaz.jpeg"
            className="absolute opacity-[0.065] z-0 grayscale"
            style={{
              top: '50%',
              left: '70%',
              transform: 'translate(-50%, -50%)',
              width: '60%',
            }}
            alt="Watermark"
          />

          {/* Header */}
          <div
            className="text-white py-1 px-6 relative z-10 flex items-center justify-center gap-2"
            style={{
              backgroundColor: FUAZ_GREEN,
              borderBottom: `3px solid ${FUAZ_GOLD}`,
            }}
          >
            <img
              src="/fuaz.jpeg"
              alt="FUAZ Logo"
              className="w-9 h-9 bg-white rounded-full p-0.5 object-contain"
            />
            <div className="flex flex-col items-start whitespace-nowrap">
              <div className="text-[13px] font-extrabold uppercase leading-tight">
                FEDERAL UNIVERSITY OF AGRICULTURE ZURU
              </div>
              <div className="text-[10px] opacity-90 font-medium">
                P.M.B 28, ZURU, KEBBI STATE, NIGERIA
              </div>
            </div>
          </div>

          {/* Title Banner */}
          <div
            className="py-0.5 text-center text-[13px] font-extrabold tracking-wider relative z-10 whitespace-nowrap"
            style={{ backgroundColor: FUAZ_GOLD }}
          >
            STAFF ID CARD
          </div>

          {/* Content */}
          <div className="flex items-center flex-grow relative z-10 px-[18.75px] py-2 gap-5 justify-center">
            {/* Photo Box */}
            <div className="flex flex-col items-center w-[130px] flex-shrink-0">
              <div
                className="w-[130px] h-[162.5px] rounded-xl overflow-hidden bg-gray-200 mb-0.5"
                style={{ border: `2px solid ${FUAZ_GREEN}` }}
              >
                <img
                  src={getPhotoUrl(data)}
                  alt="Staff"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center w-full pt-0.5">
                <div
                  className="text-sm leading-none mb-0.5 text-green-900"
                  style={{ fontFamily: "'Great Vibes', cursive" }}
                >
                  {data.signature}
                </div>
                <div
                  className="w-full mb-0.5"
                  style={{ borderTop: `1px solid ${FUAZ_GREEN}` }}
                />
                <div className="text-[8px] text-gray-600 font-bold uppercase whitespace-nowrap">
                  HOLDER'S SIGNATURE
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="flex-grow max-w-[60%] flex flex-col justify-center">
              <div
                className="text-[19px] font-extrabold uppercase border-b-2 border-gray-100 pb-1 mb-1.5 leading-tight text-left whitespace-nowrap overflow-hidden text-ellipsis"
                style={{ color: FUAZ_DARK }}
              >
                {data.name}
              </div>

              <div className="grid grid-cols-2 gap-x-3 gap-y-2 w-full">
                {/* ID Full Width */}
                <div className="col-span-2 border-b border-dashed border-gray-200 pb-0.5 mb-0.5">
                  <div
                    className="text-[17px] font-extrabold whitespace-nowrap"
                    style={{ color: FUAZ_GREEN }}
                  >
                    {data.id}
                  </div>
                </div>

                <div className="text-left">
                  <div className="text-[10px] font-bold text-gray-500 uppercase mb-0 tracking-wide whitespace-nowrap">
                    STATUS
                  </div>
                  <div className="text-[13px] font-bold leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                    {data.status}
                  </div>
                </div>

                <div className="text-left">
                  <div className="text-[10px] font-bold text-gray-500 uppercase mb-0 tracking-wide whitespace-nowrap">
                    BLOOD GROUP
                  </div>
                  <div className="text-[13px] font-bold leading-tight text-red-700 whitespace-nowrap">
                    {data.blood}
                  </div>
                </div>

                <div className="text-left">
                  <div className="text-[10px] font-bold text-gray-500 uppercase mb-0 tracking-wide whitespace-nowrap">
                    DEPT/UNIT
                  </div>
                  <div className="text-[13px] font-bold leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                    {data.dept}
                  </div>
                </div>

                <div className="text-left">
                  <div className="text-[10px] font-bold text-gray-500 uppercase mb-0 tracking-wide whitespace-nowrap">
                    NOK Number
                  </div>
                  <div className="text-[13px] font-bold leading-tight whitespace-nowrap">
                    {data.nok}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <DownloadButton
            onClick={() => downloadCard(frontRef, 'FUAZ_Staff_Front.png')}
            label="Download PNG"
          />
          <PrintButton
            onClick={() => printCard(frontRef)}
            label="Print Front"
          />
        </div>
      </div>

      {/* Back */}
      <div className="flex flex-col items-center">
        <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-widest text-center">
          Back View (Landscape)
        </div>
        <div
          ref={backRef}
          className="relative bg-white overflow-hidden flex flex-col shadow-2xl"
          style={{
            width: '506.25px',
            height: '318.75px',
            borderRadius: '18.75px',
          }}
        >
          <div
            className="h-10 w-full relative z-10 mt-6"
            style={{ backgroundColor: '#1a1a1a' }}
          />

          <div
            className="absolute inset-0 opacity-[0.07] z-0"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, ${FUAZ_GREEN} 0, ${FUAZ_GREEN} 1px, transparent 0, transparent 50%)`,
              backgroundSize: '20px 20px',
            }}
          />

          <div className="px-[18.75px] py-6 flex flex-col flex-grow relative z-10">
            <div className="text-[13px] font-extrabold leading-relaxed text-justify mb-4 mt-3">
              <p className="mb-2">
                This identity is not transferable. It must be produced at any
                time if requested by any office of the University or authorized
                person(s)
              </p>
              <p className="mb-0">
                Loss of this card must be reported immediately to the Registrar,
                Federal University of Agriculture Zuru, P.M.B 28, Kebbi State
                Nigeria, or to the nearest Police Station.
              </p>
            </div>

            <div className="mt-auto text-left pb-3">
              <div className="inline-block text-center whitespace-nowrap">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Signature_sample.svg/1200px-Signature_sample.svg.png"
                  alt="Registrar's Signature"
                  className="h-[45px] opacity-90 mx-auto"
                />
                <div
                  className="w-[120px] my-1"
                  style={{ borderTop: `1px solid ${FUAZ_GREEN}` }}
                />
                <div className="text-[11px] text-gray-700 font-extrabold uppercase">
                  REGISTRAR'S SIGNATURE
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <DownloadButton
            onClick={() => downloadCard(backRef, 'FUAZ_Staff_Back.png')}
            label="Download PNG"
          />
          <PrintButton onClick={() => printCard(backRef)} label="Print Back" />
        </div>
      </div>
    </div>
  )
}
