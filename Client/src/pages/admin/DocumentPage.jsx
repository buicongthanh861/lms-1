import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { Trash, PlusCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const DocumentPage = () => {
  const navigate = useNavigate()
  const { courseId: paramCourseId } = useParams()
  const { course } = useSelector(store => store.course) // lấy course từ redux (mảng)
  
  // ưu tiên lấy courseId từ URL params, nếu không thì lấy course đầu tiên trong redux (tùy use case)
  const courseId = paramCourseId || (course && course.length > 0 ? course[0]._id : null)

  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchDocuments = async () => {
    if (!courseId) return
    setLoading(true)
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/v1/document/${courseId}/document`,
        { withCredentials: true }  // <-- thêm vào đây
      )
      if (data.success) {
        setDocuments(data.documents)
      } else {
        setError('Failed to fetch documents')
      }
    } catch (err) {
      setError(err.message || 'Error fetching documents')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchDocuments()
  }, [courseId])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure to delete this document?')) return
    try {
      const { data } = await axios.delete(
        `http://localhost:8000/api/v1/document/document/${id}`,
        { withCredentials: true }  // <-- thêm vào đây
      )
      if (data.success) {
        setDocuments(prev => prev.filter(doc => doc._id !== id))
      } else {
        alert('Failed to delete document')
      }
    } catch (error) {
      alert('Error deleting document')
    }
  }

  return (
    <div className='md:p-10 p-4 w-full min-h-screen'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Documents</h1>
        {courseId && (
          <Button
            className="bg-blue-500 flex items-center gap-2"
            onClick={() => navigate(`/admin/course/${courseId}/document/create`)}
          >
            <PlusCircle size={18} />
            Create Document
          </Button>
        )}
      </div>

      {loading && <p>Loading documents...</p>}
      {error && <p className='text-red-600'>{error}</p>}

      {!loading && !error && (
        <Table>
          <TableCaption>List of documents for the course.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>File</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className='text-center p-4'>No documents found.</TableCell>
              </TableRow>
            )}
            {documents.map(doc => (
              <TableRow key={doc._id}>
                <TableCell>{doc.doctitle}</TableCell>
                <TableCell>{doc.description || '-'}</TableCell>
                <TableCell>
                  <a href={doc.fileUrl} target="_blank" rel="noreferrer" className='text-blue-600 underline'>
                    View File
                  </a>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant='destructive' size="sm" onClick={() => handleDelete(doc._id)}>
                    <Trash size={16} />
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

export default DocumentPage

