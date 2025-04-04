import baseUrl from "@/utils/baseUrl";
import React, { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { Document, 	Page, pdfjs} from "react-pdf";
 




pdfjs.GlobalWorkerOptions.workerSrc = `unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs;`

const CourseAssets = ({ 
    id: assetId,
    lecture_name,
    onDelete,
}) => {
    const { edmy_users_token } = parseCookies();
    const [pdfFileUrl, setPdfFileUrl] = useState('');

    useEffect(() => {
        const fetchPdfFile = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/download?id=${assetId}`, {
                    headers: {
                        Authorization: edmy_users_token,
                    },
                });
                if (response.ok) {
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    setPdfFileUrl(url);
                } else {
                    console.error("Failed to fetch file");
                }
            } catch (error) {
                console.error("Fetch failed", error);
            }
        };

        fetchPdfFile(); 
    }, [edmy_users_token, assetId]);

    const handleView = () => {
        if (pdfFileUrl) {
            window.open(pdfFileUrl, '_blank');
        } else {
            console.error("PDF file URL is not available.");
        }
    };

    return (
        <div className="col-lg-3 col-md-6">
            <div className="card mt-4" style={{ width: "18rem" }}>
                {/* <i
                    className="bx bx-file"
                    style={{ textAlign: "center", fontSize: "100px" }}
                ></i> */}
                <div className="card-body">
                    <h5 className="card-title">{lecture_name}</h5>
                    {pdfFileUrl && (
                        <embed
                            src={pdfFileUrl + "#toolbar=0"}
                            type="application/pdf"
                            height={300}
                            width={250}
                            onContextMenu={(e) => e.preventDefault()}
                        />
                    )}
                    <button
                        className="btn btn-success me-3"
                        onClick={handleView}
                    >
                        View <i className="bx bx-down-arrow-circle"></i>
                    </button>
                    <button
                        onClick={() => onDelete(assetId)}
                        className="btn btn-danger mt-2"
                    >
                        Delete <i className="bx bx-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseAssets;
