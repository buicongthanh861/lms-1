import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setDocument } from "@/redux/documentSlice";
import axios from "axios";
import { Edit, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CreateDocument = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [doctitle, setDoctitle] = useState("");
  const [loading, setLoading] = useState(false);
  const { document } = useSelector((store) => store.document);

  const createDocumentHandler = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:8000/api/v1/course/${params?.courseId}/document`,
        { doctitle },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        getDocuments();
        setDoctitle("");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getDocuments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/course/${params.courseId}/document`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setDocument(res.data.documents));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDocuments();
  }, []);

  return (
    <div className="p-4 md:p-10 md:pr-20 h-screen">
      <h1 className="text-2xl font-bold mb-2">
        Lets Add <span className="text-blue-600">Documents</span>
      </h1>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex eius necessitatibus fugit vel distinctio architecto, ut ratione eaque?</p>
      <div className="mt-10 space-y-5">
        <Label>Title</Label>
        <Input
          type="text"
          placeholder="Your Document Name"
          className="bg-white"
          value={doctitle}
          onChange={(e) => setDoctitle(e.target.value)}
        />
      </div>
      <div className="flex gap-2 mt-5">
        <Button
          onClick={() => navigate(`/admin/course/${params.courseId}`)}
          variant="outline"
        >
          Back to Course
        </Button>
        <Button
          disabled={loading}
          onClick={createDocumentHandler}
          className="bg-gray-800 hover:bg-gray-800"
        >
          {loading ? (
            <>
              <Loader2 className="mr-1 h-4 animate-spin" /> Please wait
            </>
          ) : (
            "Create Document"
          )}
        </Button>
      </div>
      <div className="mt-10">
        {Array.isArray(document) &&
          document.map((doc, index) => (
            <div
              key={doc._id || index}
              className="flex items-center justify-between bg-[#F7F9FA] px-4 py-2 rounded-md my-2"
            >
              <h1 className="font-bold text-gray-800">
                Document - {index + 1}: {doc.doctitle}
              </h1>
              <Edit
                onClick={() => navigate(`${doc._id}`)}
                size={20}
                className="cursor-pointer text-gray-600 hover:text-blue-600"
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default CreateDocument;
