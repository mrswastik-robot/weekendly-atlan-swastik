'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Github, Calendar, DollarSign, Heart, Sparkles } from 'lucide-react';
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
              <Heart className="h-4 w-4 text-red-600" />
              Mood-Based Activities
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2 px-3 py-1">
              <Calendar className="h-4 w-4 text-blue-600" />
              Visual Scheduling
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2 px-3 py-1">
              <Sparkles className="h-4 w-4 text-purple-600" />
              40+ Activities
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
                        { name: "Weekend Brunch", cost: "$25", category: "Food" },
                        { name: "Nature Hiking", cost: "Free", category: "Outdoor" },
                        { name: "Movie Marathon", cost: "$15", category: "Indoor" },
                        { name: "Yoga Class", cost: "$18", category: "Wellness" }
                      ].map((activity, i) => (
                        <Card key={i} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-3">
                            <div className="text-sm font-medium">{activity.name}</div>
                            <div className="text-xs text-muted-foreground">{activity.category}</div>
                            <div className="text-sm font-medium text-green-600 mt-1">{activity.cost}</div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Schedule Preview */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold mb-4">📅 Weekend Schedule</h3>
                    <Card>
                      <CardContent className="p-3">
                        <div className="text-sm font-medium mb-2">Saturday</div>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span>Brunch</span>
                            <span className="text-green-600">$25</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Hiking</span>
                            <span className="text-green-600">Free</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-3">
                        <div className="text-sm font-medium mb-2">Budget Summary</div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>Total:</span>
                            <span className="font-medium">$25</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-green-500 h-1.5 rounded-full w-1/4"></div>
                          </div>
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
                description: "Track costs in real-time with visual budget indicators and spending alerts."
              },
              {
                icon: <Heart className="h-8 w-8 text-red-600" />,
                title: "Mood-Based Planning",
                description: "Filter activities by mood - happy, relaxed, energetic, or peaceful."
              },
              {
                icon: <Calendar className="h-8 w-8 text-blue-600" />,
                title: "Visual Scheduling",
                description: "Drag and drop activities into your weekend timeline with time management."
              },
              {
                icon: <Sparkles className="h-8 w-8 text-purple-600" />,
                title: "40+ Activities",
                description: "Curated collection of weekend activities across food, outdoor, indoor, social, and wellness."
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