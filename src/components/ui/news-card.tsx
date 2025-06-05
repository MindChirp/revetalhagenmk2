import { ShieldCheckIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Badge } from "./badge";
import { Card, CardDescription, CardHeader, CardTitle } from "./card";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

interface NewsCardProps {
  author: {
    image: string;
    name: string;
    email: string;
    role: string;
  };
  title: string;
  description: string;
}
function NewsCard({ author, title, description }: NewsCardProps) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="h-full">
      <div className="flex w-auto items-start gap-5 px-10">
        <div
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onClick={(e) => e.stopPropagation()}
        >
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger className="cursor-pointer">
              <Avatar className="shadow-md">
                <AvatarImage className="shadow-2xl" src={author.image} />
                <AvatarFallback />
              </Avatar>
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex flex-row items-start gap-2.5">
                <Avatar className="shadow-md">
                  <AvatarImage className="shadow-2xl" src={author.image} />
                  <AvatarFallback />
                </Avatar>
                <div className="flex flex-col">
                  <div className="flex flex-row items-center gap-2.5">
                    <span className="leading-none font-semibold whitespace-nowrap">
                      {author.name}
                    </span>
                    {author.role === "admin" && (
                      <Tooltip defaultOpen={false}>
                        <TooltipTrigger>
                          <Badge>
                            <ShieldCheckIcon />
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <span>Administrator</span>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  <Link href={`mailto:${author.email}`} className="text-sm">
                    {author.email}
                  </Link>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <CardHeader className="w-full px-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription className="line-clamp-3">
            {description}
          </CardDescription>
        </CardHeader>
      </div>
    </Card>
  );
}

export default NewsCard;
