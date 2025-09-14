'use client';

import React, { useState } from 'react';
import { 
  Share2, 
  Facebook, 
  Twitter, 
  MessageCircle, 
  Mail,
  Linkedin,
  Copy,
  ExternalLink,
  QrCode
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '../../../hooks/use-toast';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
  LinkedinShareButton,
} from 'react-share';

interface ShareOptionsProps {
  planId: string;
  timelineImageUrl?: string;
}

export function ShareOptions({ planId, timelineImageUrl }: ShareOptionsProps) {
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const { toast } = useToast();
  
  // Generate share URLs and content
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/timeline/${planId}` 
    : '';
  const shareText = "Check out our epic weekend plan guys! I maade with Weekendly";
  const shareHashtags = ['weekendplanning', 'budgetfriendly', 'timelinemaker', 'weekendly'];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied! 🔗",
        description: "Timeline link has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

  

  const socialButtons = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'hover:bg-blue-50 hover:text-blue-600',
      component: FacebookShareButton,
      props: {
        url: shareUrl,
        quote: shareText,
        hashtag: '#weekendplanning'
      }
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'hover:bg-blue-50 hover:text-blue-400',
      component: TwitterShareButton,
      props: {
        url: shareUrl,
        title: shareText,
        hashtags: shareHashtags
      }
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'hover:bg-green-50 hover:text-green-600',
      component: WhatsappShareButton,
      props: {
        url: shareUrl,
        title: shareText
      }
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'hover:bg-blue-50 hover:text-blue-700',
      component: LinkedinShareButton,
      props: {
        url: shareUrl,
        title: shareText,
        summary: "Discover my perfectly planned weekend with budget tracking and timeline visualization."
      }
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'hover:bg-gray-50 hover:text-gray-600',
      component: EmailShareButton,
      props: {
        url: shareUrl,
        subject: "Check out my weekend plan!",
        body: `${shareText}\n\nView my timeline here: ${shareUrl}`
      }
    }
  ];

  return (
    <div className="space-y-4">
      {/* Social Media Sharing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share on Social Media
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {socialButtons.map(({ name, icon: Icon, color, component: ShareButton, props }) => (
              <ShareButton key={name} {...props}>
                <div className={`
                  flex flex-col items-center p-3 border rounded-lg transition-all cursor-pointer
                  ${color}
                `}>
                  <Icon className="h-6 w-6 mb-1" />
                  <span className="text-xs font-medium">{name}</span>
                </div>
              </ShareButton>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
