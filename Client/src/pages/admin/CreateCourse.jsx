import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const CreateCourse = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [courseTitle, setCourseTitle] = useState("")
    const [category, setCategory] = useState("")

    const getSelectedCategory = (value)=> {
        setCategory(value)
    }
    const createCourseHandler = async ()=> {
        console.log(courseTitle, category);
        
        try {
            setLoading(true)
            const res = await axios.post('http://localhost:8000/api/v1/course/', {courseTitle,category}, {
                headers: {
                    "Content-Type":"application/json"
                },
                withCredentials:true
            })
            if(res.data.success){
               navigate('/admin/course')
               toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error);
            
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className='p-10 md:pr-20 h-screen'>
            <h1 className='text-2xl font-bold'> Thêm mới <span className='text-blue-500'>khóa học</span></h1>
            <p> Nhập thông tin bên dưới để tạo khóa học mới.</p>
            <div className='mt-10'>
                <div>
                    <Label>Tiêu đề khóa học</Label>
                    <Input 
                    type="text" 
                    value={courseTitle} 
                    onChange={(e)=>setCourseTitle(e.target.value)} 
                    placeholder="Nhập tên khóa học"
                    className="bg-white" 
                    />
                </div>
                <div className='mt-4 mb-5'>
                    <Label>Danh mục</Label>
                    <Select onValueChange={getSelectedCategory}>
                        <SelectTrigger className="w-[180px] bg-white">
                            <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Danh mục</SelectLabel>
                                <SelectItem value="Next Js">Next Js</SelectItem>
                                <SelectItem value="Data Science">Khoa học dữ liệu</SelectItem>
                                <SelectItem value="Frontend Development">Lập trình Frontend</SelectItem>
                                <SelectItem value="Backend Development">Lập trình Backend</SelectItem>
                                <SelectItem value="MernStack Development">Phát triển MERN Stack</SelectItem>
                                <SelectItem value="Javascript">Javascript</SelectItem>
                                <SelectItem value="Python">Python</SelectItem>
                                <SelectItem value="Docker">Docker</SelectItem>
                                <SelectItem value="MongoDB">MongoDB</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex gap-2'>
                    <Button onClick={()=>navigate('/admin/course')} variant="outline">Cancel</Button>
                    <Button className="bg-blue-500 hover:bg-blue-600 " disabled={loading} onClick={createCourseHandler}>
                    {
                        loading ? <><Loader2 className='animate-spin mr-1 h-4 w-4 '/>Vui lòng đợi...</> :  "Tạo khóa học"
                    }
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CreateCourse