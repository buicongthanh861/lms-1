import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'

const RichTextEditor = ({ input, setInput }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: input.description,
    onUpdate: ({ editor }) => {
      setInput({...input, description: editor.getHTML()})
    },
  })

  // Cập nhật nội dung editor khi input.description thay đổi từ bên ngoài
  useEffect(() => {
    if (editor && input.description !== editor.getHTML()) {
      editor.commands.setContent(input.description)
    }
  }, [input.description])

  return (
    <EditorContent 
      editor={editor} 
      className="min-h-[150px] border rounded-md p-2 bg-white" 
    />
  )
}

export default RichTextEditor