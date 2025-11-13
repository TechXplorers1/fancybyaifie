
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import type { BlogPost } from './BlogSection';

interface BlogDetailDialogProps {
  post: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BlogDetailDialog({ post, isOpen, onClose }: BlogDetailDialogProps) {
  if (!post) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-full sm:h-[90vh] p-0 flex flex-col sm:rounded-lg">
        <ScrollArea className="flex-1">
          {post.image && (
            <div className="relative w-full aspect-[4/3] sm:aspect-[2/1] bg-muted">
              <Image
                src={post.image.imageUrl}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          <DialogHeader className="p-4 sm:p-8 text-left">
            <DialogTitle className="text-2xl sm:text-4xl font-headline text-primary leading-tight">
              {post.title}
            </DialogTitle>
          </DialogHeader>
          <div
            className="prose dark:prose-invert max-w-none px-4 sm:px-8 pb-10"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
