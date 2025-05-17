import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const CourseDocuments = () => {
  const { courseId } = useParams();
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/document/${courseId}/document`,
          { withCredentials: true }
        );
        if (res.data.success) {
          setDocuments(res.data.documents);
        }
      } catch (err) {
        console.error("Failed to fetch documents:", err);
      }
    };
    fetchDocuments();
  }, [courseId]);

  return (
    <div className="bg-gray-100 min-h-screen p-6 md:p-10 flex justify-center">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Course Documents</h1>
        </div>

        {/* Content */}
        {documents.length === 0 ? (
          <p className="text-center text-gray-500 mt-10 text-lg">
            No documents found for this course.
          </p>
        ) : (
          <div className="space-y-5">
            {documents.map((doc) => (
              <Card key={doc._id} className="shadow-md hover:shadow-lg transition p-5">
                <CardContent>
                  <h2 className="text-xl font-semibold text-gray-800">{doc.title || doc.doctitle}</h2>
                  <p className="text-gray-600 mt-2">{doc.description || "No description available."}</p>
                  <a
                    href={doc.documentUrl || doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline mt-3 inline-block"
                  >
                    View Document
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDocuments;

