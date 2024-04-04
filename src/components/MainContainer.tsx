import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { closeSidebarMenu } from "../redux/sidebarSlice";
import { youtubeVideosUrl } from "../constants";
import { VideoCardType } from "../interfaces";
import VideoCard from "./VideoCard";
import Shimmer from "../layout/Shimmer";

const MainContainer = () => {
  const [videos, setVideos] = useState<VideoCardType[]>([]);
  const isSidebarOpen = useSelector((store: RootState) => store.sidebar.isMenuOpen);
  const dispatch = useDispatch();

  useEffect(() => {
    getVideos();
    if (window.innerWidth < 840) {
      dispatch(closeSidebarMenu());
    }
  }, []);

  const getVideos = async () => {
    try {
      const response = await fetch(`${youtubeVideosUrl}&key=${import.meta.env.VITE_API_KEY}`);
      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to fetch videos");
      }

      const json = await response.json();
      setVideos(json.items);
    } catch (error) {
      console.error("Error fetching videos:", error);
      // Handle error, show error message, etc.
    }

  };

  const style = {
    display: window.innerWidth < 640 && isSidebarOpen ? "none" : "flex",
  };

  return videos.length === 0 ? (
    <Shimmer />
  ) : (
    <div className="col-span-11 p-6 flex flex-wrap gap-x-5 justify-evenly" style={style}>
      {videos.map((video) => (
        <VideoCard key={video.id} videoInfo={video} />
      ))}
    </div>
  );
};

export default MainContainer;
