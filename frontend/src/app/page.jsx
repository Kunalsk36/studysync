"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ListTodo,
  CalendarDays,
  Timer,
  BarChart3,
  Trophy,
  Sparkles,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/landing/FadeIn";
import { ProductPreview } from "@/components/landing/ProductPreview";

const FEATURES = [
  {
    icon: ListTodo,
    title: "Task Management",
    description:
      "Organize work by subject, priority, and deadline — with subtasks and tags built in.",
  },
  {
    icon: CalendarDays,
    title: "Calendar",
    description: "See exams, interviews, deadlines, and study sessions on one unified timeline.",
  },
  {
    icon: Timer,
    title: "Pomodoro Timer",
    description:
      "Focused work sessions with short and long breaks that log your study hours automatically.",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description: "Daily, weekly, and monthly insights into your study habits and streaks.",
  },
  {
    icon: Trophy,
    title: "Achievements",
    description: "Stay motivated with streaks, badges, and milestones that reward consistency.",
  },
  {
    icon: Sparkles,
    title: "AI Assistant",
    description:
      "Get an optimized study schedule and time estimates — you stay in control of every change.",
  },
];

const STEPS = [
  { title: "Plan", description: "Add tasks, exams, and goals into one workspace." },
  { title: "Focus", description: "Run Pomodoro sessions to make real progress every day." },
  { title: "Track", description: "Watch your streaks and analytics build up over time." },
];

const FAQS = [
  {
    q: "Is StudySync free to use?",
    a: "Yes. StudySync is a free productivity platform with no subscriptions or paid plans.",
  },
  {
    q: "Do I need to install anything?",
    a: "No — StudySync runs entirely in your browser and works across desktop, tablet, and mobile.",
  },
  {
    q: "Can I use StudySync without the AI features?",
    a: "Absolutely. AI suggestions are optional and never change your data without your confirmation.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Your tasks, schedule, and progress are visible only to you.",
  },
];

function FaqItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-md border border-[var(--border)] bg-[var(--surface)]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="font-medium text-[var(--fg)]">{faq.q}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[var(--fg-muted)] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <p className="px-5 pb-4 text-sm text-[var(--fg-muted)]">{faq.a}</p>
      </motion.div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[500px] bg-primary/10 blur-3xl"
            style={{ clipPath: "ellipse(60% 40% at 50% 0%)" }}
          />
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium text-[var(--fg-muted)]"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Built for students, learners &amp; job seekers
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-bold tracking-tight text-[var(--fg)] sm:text-5xl"
            >
              Your learning, <span className="text-primary">organized</span> in one place
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mt-5 max-w-xl text-lg text-[var(--fg-muted)]"
            >
              StudySync brings task management, calendar, Pomodoro sessions, and progress analytics
              into a single focused workspace — so you spend less time managing tools and more time
              learning.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Button href="/register" size="lg" className="w-full sm:w-auto">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href="#features" variant="secondary" size="lg" className="w-full sm:w-auto">
                See Features
              </Button>
            </motion.div>
          </div>

          <div className="mt-16">
            <ProductPreview />
          </div>
        </section>

        {/* Features */}
        <section id="features" className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <FadeIn className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-[var(--fg)]">
                Everything you need to stay consistent
              </h2>
              <p className="mt-3 text-[var(--fg-muted)]">
                One workspace instead of six disconnected apps.
              </p>
            </FadeIn>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature, i) => (
                <FadeIn key={feature.title} delay={i * 0.06}>
                  <div className="h-full rounded-md border border-[var(--border)] bg-[var(--surface)] p-6 transition-shadow hover:shadow-md">
                    <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-primary/10">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="mt-4 font-semibold text-[var(--fg)]">{feature.title}</h3>
                    <p className="mt-1.5 text-sm text-[var(--fg-muted)]">{feature.description}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="bg-[var(--surface)] px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <FadeIn className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-[var(--fg)]">How StudySync works</h2>
            </FadeIn>
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              {STEPS.map((step, i) => (
                <FadeIn key={step.title} delay={i * 0.1} className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                    {i + 1}
                  </div>
                  <h3 className="mt-4 font-semibold text-[var(--fg)]">{step.title}</h3>
                  <p className="mt-1.5 text-sm text-[var(--fg-muted)]">{step.description}</p>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-20 sm:px-6">
          <FadeIn className="mx-auto max-w-3xl rounded-lg bg-primary px-8 py-14 text-center shadow-xl shadow-primary/20">
            <h2 className="text-3xl font-bold text-white">
              Start building consistent study habits today
            </h2>
            <p className="mx-auto mt-3 max-w-md text-primary-foreground/80">
              Free to use. No credit card required.
            </p>
            <Button
              href="/register"
              size="lg"
              variant="secondary"
              className="mx-auto mt-7 w-fit border-0 bg-white text-primary hover:bg-white/90"
            >
              Create your account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </FadeIn>
        </section>

        {/* FAQ */}
        <section id="faq" className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl">
            <FadeIn className="text-center">
              <h2 className="text-3xl font-bold text-[var(--fg)]">Frequently asked questions</h2>
            </FadeIn>
            <div className="mt-10 space-y-3">
              {FAQS.map((faq) => (
                <FaqItem key={faq.q} faq={faq} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
