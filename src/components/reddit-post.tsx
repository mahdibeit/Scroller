import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  Share2,
  Bookmark,
} from "lucide-react";
import Image from "next/image";

interface RedditPostProps {
  post: {
    id: number;
    title: string;
    author: string;
    subreddit: string;
    upvotes: number;
    comments: number;
    timeAgo: string;
    content: string;
    image?: string;
  };
}

export default function RedditPost({ post }: RedditPostProps) {
  return (
    <Card className="w-full overflow-hidden border-gray-200 shadow-lg dark:border-gray-800">
      <CardHeader className="flex flex-row items-start gap-3 p-4 pb-2">
        <div className="mr-1 flex flex-col items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-gray-500 hover:text-orange-500"
          >
            <ArrowBigUp className="h-5 w-5" />
          </Button>
          <span className="text-sm font-medium">
            {post.upvotes.toLocaleString()}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-gray-500 hover:text-blue-500"
          >
            <ArrowBigDown className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1">
          <div className="mb-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium text-blue-600 dark:text-blue-400">
              {post.subreddit}
            </span>
            <span className="mx-1">•</span>
            <span>Posted by u/{post.author}</span>
            <span className="mx-1">•</span>
            <span>{post.timeAgo}</span>
          </div>
          <h3 className="mb-2 text-xl leading-tight font-bold">{post.title}</h3>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <p className="mb-4 text-gray-700 dark:text-gray-300">{post.content}</p>
        {post.image && (
          <div className="relative h-64 w-full overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
            <Image
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center gap-2 border-t border-gray-100 p-3 text-gray-500 dark:border-gray-800">
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <MessageSquare className="h-4 w-4" />
          <span>{post.comments} Comments</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Bookmark className="h-4 w-4" />
          <span>Save</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
