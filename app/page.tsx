'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Github, DollarSign, Sparkles, Share2, Zap, MousePointer2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="relative w-full overflow-hidden min-h-screen">
      {/* Subtle accent elements */}
      <div className="absolute inset-0 z-0">
        <div className="bg-primary/3 absolute top-0 left-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 rounded-full blur-3xl"></div>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27262640_1px,transparent_1px),linear-gradient(to_bottom,#27262640_1px,transparent_1px)] bg-[size:16px_16px] opacity-15"></div>

      <div className="relative z-10 container mx-auto px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-5xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-6 flex justify-center"
          >
            <div className="border-border bg-background/80 inline-flex items-center rounded-full border px-3 py-1 text-sm backdrop-blur-sm">
              <span className="bg-primary mr-2 rounded-full px-2 py-0.5 text-xs font-semibold text-white">
                New
              </span>
              <span className="text-muted-foreground">
                Introducing weekend planning with budget tracking
              </span>
              <ChevronRight className="text-muted-foreground ml-1 h-4 w-4" />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="from-primary/10 via-foreground/85 to-foreground/50 bg-gradient-to-tl bg-clip-text text-center text-4xl tracking-tighter text-balance text-transparent sm:text-5xl md:text-6xl lg:text-7xl pb-1"
          >
            Plan Beautiful Weekends with Smart Budgeting
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground mx-auto mt-6 max-w-2xl text-center text-lg"
          >
            A modern weekend planning app designed to help you create memorable experiences 
            while staying within budget. Fully customizable, responsive, and shareable with friends.
          </motion.p>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <Badge variant="outline" className="flex items-center gap-2 px-3 py-1">
              <DollarSign className="h-4 w-4 text-green-600" />
              Smart Budget Tracking
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2 px-3 py-1">
              <MousePointer2 className="h-4 w-4 text-blue-600" />
              Drag & Drop Planning
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2 px-3 py-1">
              <Share2 className="h-4 w-4 text-purple-600" />
              Timeline & Export
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2 px-3 py-1">
              <Sparkles className="h-4 w-4 text-orange-600" />
              59+ Activities
            </Badge>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/planner">
              <Button
                size="lg"
                className="group bg-primary text-primary-foreground hover:shadow-primary/30 relative overflow-hidden rounded-full px-6 shadow-lg transition-all duration-300"
              >
                <span className="relative z-10 flex items-center">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <span className="from-primary via-primary/90 to-primary/80 absolute inset-0 z-0 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
              </Button>
            </Link>
            <Link href="https://github.com/mrswastik-robot/weekendly-atlan-swastik">
            <Button
              variant="outline"
              size="lg"
              className="border-border bg-background/50 flex items-center gap-2 rounded-full backdrop-blur-sm"
            >
              <Github className="h-4 w-4" />
              View Source
            </Button>
            </Link>
          </motion.div>

          {/* Feature Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              type: 'spring',
              stiffness: 50,
            }}
            className="relative mx-auto mt-16 max-w-4xl"
          >
            <div className="border-border/40 bg-background/50 overflow-hidden rounded-xl border shadow-xl backdrop-blur-sm">
              <div className="border-border/40 bg-muted/50 flex h-10 items-center border-b px-4">
                <div className="flex space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <div className="bg-background/50 text-muted-foreground mx-auto flex items-center rounded-md px-3 py-1 text-xs">
                  weekendly.app/planner
                </div>
              </div>
              
              {/* Mock preview of the app */}
              <div className="p-8 bg-gradient-to-br from-background to-muted/20">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Activity Browser Preview */}
                  <div className="md:col-span-2 space-y-4">
                    <h3 className="text-lg font-semibold mb-4">🎯 Browse Activities</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { name: "Wine & Cheese Tasting", cost: "$45", category: "Food", mood: "😌" },
                        { name: "Geocaching Adventure", cost: "Free", category: "Outdoor", mood: "⚡" },
                        { name: "VR Gaming", cost: "$25", category: "Indoor", mood: "🎮" },
                        { name: "Sound Healing", cost: "$30", category: "Wellness", mood: "🧘" },
                        { name: "Community Volunteer", cost: "Free", category: "Social", mood: "❤️" },
                        { name: "Cold Water Therapy", cost: "$20", category: "Wellness", mood: "💪" }
                      ].map((activity, i) => (
                        <Card key={i} className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-primary/20">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="text-sm font-semibold">{activity.name}</div>
                              <div className="text-lg">{activity.mood}</div>
                            </div>
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                                {activity.category}
                              </Badge>
                              <div className="text-sm font-bold text-green-600">{activity.cost}</div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Schedule Preview */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold mb-4">📅 Weekend Schedule</h3>
                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                      <CardContent className="p-4">
                        <div className="text-sm font-bold mb-3 text-blue-800">📅 Saturday Schedule</div>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between items-center p-2 bg-white/60 rounded-md">
                            <span className="font-medium">Wine Tasting</span>
                            <span className="text-blue-600 font-bold">$45</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-white/60 rounded-md">
                            <span className="font-medium">VR Gaming</span>
                            <span className="text-blue-600 font-bold">$25</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                      <CardContent className="p-4">
                        <div className="text-sm font-bold mb-3 text-green-800">💰 Budget Tracker</div>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span>Spent:</span>
                            <span className="font-bold text-green-700">$70 / $150</span>
                          </div>
                          <div className="w-full bg-green-200 rounded-full h-2">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full w-[47%]"></div>
                          </div>
                          <div className="text-center text-green-600 font-medium">✅ On Budget</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                      <CardContent className="p-4">
                        <div className="text-sm font-bold mb-2 text-purple-800">🚀 Timeline Ready</div>
                        <div className="flex items-center justify-center space-x-2 text-xs">
                          <Share2 className="h-3 w-3 text-purple-600" />
                          <span className="text-purple-700 font-medium">Export & Share</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements for visual interest */}
            <div className="border-border/40 bg-background/80 absolute -top-6 -right-6 h-12 w-12 rounded-lg border p-3 shadow-lg backdrop-blur-md">
              <div className="bg-primary/20 h-full w-full rounded-md"></div>
            </div>
            <div className="border-border/40 bg-background/80 absolute -bottom-4 -left-4 h-8 w-8 rounded-full border shadow-lg backdrop-blur-md"></div>
            <div className="border-border/40 bg-background/80 absolute right-12 -bottom-6 h-10 w-10 rounded-lg border p-2 shadow-lg backdrop-blur-md">
              <div className="h-full w-full rounded-md bg-green-500/20"></div>
            </div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-24 grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                icon: <DollarSign className="h-8 w-8 text-green-600" />,
                title: "Smart Budget Tracking",
                description: "Real-time cost tracking with visual progress bars, budget alerts, and spending analytics."
              },
              {
                icon: <MousePointer2 className="h-8 w-8 text-blue-600" />,
                title: "Professional Drag & Drop",
                description: "Advanced @dnd-kit integration with cross-day dragging, mobile touch support, and accessibility."
              },
              {
                icon: <Share2 className="h-8 w-8 text-purple-600" />,
                title: "Timeline Generation & Export",
                description: "Create beautiful shareable timelines with PNG, PDF, clipboard export and social sharing."
              },
              {
                icon: <Zap className="h-8 w-8 text-orange-600" />,
                title: "59+ Activities & Performance",
                description: "Extensive activity collection with 60fps smooth performance, smart time management, and persistence."
              }
            ].map((feature, i) => (
              <Card key={i} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="space-y-4">
                  <div className="flex justify-center">{feature.icon}</div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}