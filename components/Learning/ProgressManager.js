import React, { useEffect, useState } from "react";
import axios from "axios";
import baseUrl from "@/utils/baseUrl";

const ProgressManager = ({ userId, courseId, videos_count = 0, selectedVideo, progressCount }) => {
    const [pro, setPro] = useState(0);
    const [watched, setWatched] = useState([]);
    const [initialized, setInitialized] = useState(false);




    useEffect(() => {
        if (courseId && !initialized) {
            const fetchProgress = async () => {
                try {
                    const payload = {
                        params: { userId, courseId },
                    };
                    const url = `${baseUrl}/api/learnings/progress`;
                    const response = await axios.get(url, payload);

                    const { courseProgress } = response.data;
                    const finishedVideos = courseProgress
                        .filter((progress) => progress.finished === true)
                        .map((progress) => progress.videoId);

                    setWatched(finishedVideos);
                    setPro(finishedVideos.length);
                    setInitialized(true);
                } catch (error) {
                    console.error("Error fetching progress:", error);
                }
            };
            fetchProgress();
        }
    }, [courseId, userId, initialized]);

    useEffect(() => {
        console.log("selectedVideo && !watched", selectedVideo, watched)
        if (selectedVideo && !watched.includes(selectedVideo)) {
            const updateProgress = async () => {
                try {
                    const url = `${baseUrl}/api/learnings/progress`;
                    await axios.post(url, {
                        userId,
                        courseId,
                        videoId: selectedVideo,
                        finished: true,
                    });

                    setPro((prev) => prev + 1);
                    setWatched((prevWatched) => [...prevWatched.filter((x) => x !== selectedVideo), selectedVideo]);
                } catch (error) {
                    console.error("Error updating progress:", error);
                }
            };
            updateProgress();
        }
    }, [selectedVideo, watched, courseId, userId]);

    const progressPercentage = Math.round((progressCount / (videos_count || 1)) * 100);
    const cappedProgressPercentage = Math.min(progressPercentage, 100);
    // const progressPercentage = Math.round((progressCount / (videos_count || 1)) * 100);
    // const cappedProgressPercentage = Math.min(progressPercentage, 100);
    console.log("progress%", cappedProgressPercentage, progressCount, videos_count)

    return (
        <div className="mb-3">
            <p className="mb-2">
                Your progress{" "}
                <strong>
                    {cappedProgressPercentage}% of {videos_count} complete
                </strong>
                .
            </p>
            <div className="progress">
                <div
                    className="progress-bar bg-color-0f6c76"
                    role="progressbar"
                    style={{
                        width: `${cappedProgressPercentage}%`,
                    }}
                    aria-valuenow={cappedProgressPercentage}
                    aria-valuemin="0"
                    aria-valuemax="100"
                >
                    {cappedProgressPercentage}%
                </div>
            </div>
        </div>
    );
};

export default ProgressManager;
