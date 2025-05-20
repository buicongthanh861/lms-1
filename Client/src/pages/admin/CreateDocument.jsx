import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'

const CreateDocument = () => {
  const navigate = useNavigate()
  const { courseId: courseIdParam } = useParams()

  // State courseId có thể chỉnh sửa
  const [courseId, setCourseId] = useState(courseIdParam || '')

  // Các state khác
  const [doctitle, setDoctitle] = useState("")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Nếu route có courseId thì set vào state courseId
    if (courseIdParam) {
      setCourseId(courseIdParam)
    }
  }, [courseIdParam])

  const createDocumentHandler = async () => {
    if (!doctitle || !file || !courseId) {
      toast.error("Please fill in title, upload a file, and enter courseId")
      return
    }

    const formData = new FormData()
    formData.append('doctitle', doctitle)
    formData.append('description', description)
    formData.append('file', file)

    try {
      setLoading(true)
      console.log('Sending create document request for courseId:', courseId)
      const res = await axios.post(
        `http://localhost:8000/api/v1/document/${courseId}/document`,
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      )

      if (res.data.success) {
        toast.success(res.data.message || "tài liệu đã được tạo")
        navigate(`/admin/document/`)
      } else {
        toast.error("tạo tài liệu không thành công")
      }
    } catch (error) {
      console.error('lỗi không tạo được tài liệu :', error)
      toast.error("xảy ra lỗi khi tạo tài liệu")
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className='p-10 md:pr-20 min-h-screen'>
      <h1 className='text-2xl font-bold'>
        Add <span className='text-blue-500'>Document</span>
      </h1>
      <p className='text-muted-foreground mb-6'>Create a new course document by filling the form below.</p>

      <div className='space-y-6'>
        {/* Trường nhập courseId */}
        <div>
          <Label>Course ID</Label>
          <Input
            type="text"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            placeholder="Enter course ID"
            className="bg-white"
          />
        </div>

        <div>
          <Label>Document Title</Label>
          <Input
            type="text"
            value={doctitle}
            onChange={(e) => setDoctitle(e.target.value)}
            placeholder="Enter document title"
            className="bg-white"
          />
        </div>

        <div>
          <Label>Description</Label>
          <Textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
            className="bg-white"
          />
        </div>

        <div>
          <Label>Upload File</Label>
          <Input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="bg-white"
          />
        </div>

        <div className='flex gap-2'>
          <Button onClick={() => navigate(`/admin/document/`)} variant="outline">
            Cancel
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600" disabled={loading} onClick={createDocumentHandler}>
            {
              loading ? <><Loader2 className='animate-spin mr-1 h-4 w-4' />Please wait</> : "Create"
            }
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreateDocument

