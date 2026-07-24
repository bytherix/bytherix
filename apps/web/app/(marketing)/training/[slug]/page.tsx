import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseDetail } from "@/components/courses/CourseDetail";


type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    title: `${title} Course`,
    description: `Learn ${title} with hands-on projects at Bytherix.`,
    alternates: { canonical: `https://bytherix.com/training/${slug}` },
  };
}

async function CourseDetailLoader({ params }: Props) {
  const { slug } = await params;
  if (!slug) notFound();
  return <CourseDetail slug={slug} />;
}

export default function CourseDetailPage({ params }: Props) {
  return (
    <Suspense fallback={null}>
      <CourseDetailLoader params={params} />
    </Suspense>
  );
}