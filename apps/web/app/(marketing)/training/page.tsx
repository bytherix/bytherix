import { Suspense } from 'react'
import type { Metadata } from 'next'
import { TrainingHero } from '@/components/courses/TrainingHero'
import { CourseGrid } from '@/components/courses/CourseGrid'

export const metadata: Metadata = {
  title: 'Training & Courses',
  description: 'Browse 100+ expert-led courses in AI, Ethical Hacking, Web Development, Robotics and more.',
  alternates: { canonical: 'https://bytherix.com/training' },
}

type Props = { searchParams: Promise<{ q?: string; category?: string; level?: string }> }

async function CourseGridLoader({ searchParams }: Props) {
  const filters = await searchParams
  return <CourseGrid filters={filters} />
}

export default function TrainingPage({ searchParams }: Props) {
  return (
    <>
      <TrainingHero />
      <Suspense fallback={null}>
        <CourseGridLoader searchParams={searchParams} />
      </Suspense>
    </>
  )
}