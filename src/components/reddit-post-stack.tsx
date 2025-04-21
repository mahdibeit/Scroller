"use client";

import { useState, useEffect, useRef } from "react";
import RedditPost from "./reddit-post";

// Sample Reddit post data
const POSTS = [
  {
    id: 1,
    title: "Just adopted this little guy today!",
    author: "pet_lover42",
    subreddit: "r/aww",
    upvotes: 15243,
    comments: 342,
    timeAgo: "5 hours ago",
    content:
      "After months of waiting, I finally got to bring home this adorable rescue pup. He's already made himself at home!",
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: 2,
    title: "My attempt at making homemade ramen",
    author: "amateur_chef",
    subreddit: "r/food",
    upvotes: 8721,
    comments: 156,
    timeAgo: "8 hours ago",
    content:
      "First time making ramen from scratch, including the noodles. It took all day but was totally worth it!",
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: 3,
    title: "This view from my morning hike",
    author: "nature_enthusiast",
    subreddit: "r/EarthPorn",
    upvotes: 12567,
    comments: 231,
    timeAgo: "12 hours ago",
    content:
      "Woke up at 4am to catch the sunrise from this spot. The early wake-up was definitely worth it!",
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: 4,
    title: "My workspace setup for 2023",
    author: "tech_geek99",
    subreddit: "r/battlestations",
    upvotes: 5432,
    comments: 198,
    timeAgo: "1 day ago",
    content:
      "Finally completed my dream setup. Cable management was a nightmare but I'm happy with how it turned out.",
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: 5,
    title: "I painted this landscape during lockdown",
    author: "aspiring_artist",
    subreddit: "r/Art",
    upvotes: 9876,
    comments: 312,
    timeAgo: "2 days ago",
    content:
      "I've been teaching myself to paint during the pandemic. This is my latest piece - oil on canvas.",
    image: "/placeholder.svg?height=300&width=500",
  },
];

export default function RedditPostStack() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle mouse wheel scrolling
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        // Scroll down - show next post
        setActiveIndex((prev) => Math.min(prev + 1, POSTS.length - 1));
      } else {
        // Scroll up - show previous post
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  // Calculate positions for all posts
  const getPostStyles = (index: number) => {
    // Calculate the relative position from the active index
    const relativePosition = index - activeIndex;

    // Determine if the post should be visible
    const visible = relativePosition >= -2 && relativePosition <= 2;

    if (!visible) return { display: "none" };

    // Calculate transform properties based on position
    const zIndex = 100 - Math.abs(relativePosition) * 10;
    const opacity = 1 - Math.abs(relativePosition) * 0.4; // Increased fade for non-active cards
    const scale = 1 - Math.abs(relativePosition) * 0.12;

    // Calculate vertical position and rotation
    // Significantly reduced spacing by using a much smaller multiplier (10% instead of 30%)
    const translateY = relativePosition * 10;
    const translateZ = -Math.abs(relativePosition) * 150; // Increased depth
    const rotateX = -relativePosition * 6; // Slightly reduced rotation

    return {
      zIndex,
      opacity,
      transform: `translateY(${translateY}%) translateZ(${translateZ}px) rotateX(${rotateX}deg) scale(${scale})`,
      transition: "all 0.5s ease-out",
    };
  };

  return (
    <div className="mx-auto w-full max-w-4xl" ref={containerRef}>
      <div
        className="perspective relative h-[600px] w-full"
        style={{ perspective: "1000px", perspectiveOrigin: "center" }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {POSTS.map((post, index) => (
            <div
              key={post.id}
              className="absolute w-full max-w-2xl"
              style={getPostStyles(index)}
            >
              <RedditPost post={post} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
