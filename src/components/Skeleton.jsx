import { useState } from 'react';

export default function Skeleton({ className = '', ...props }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} {...props} />
  );
}

export function SkeletonCard({ className = '' }) {
  return (
    <article className={`bg-white rounded-xl border border-gray-100 p-5 animate-pulse space-y-3 ${className}`}>
      <Skeleton className="h-48 w-full rounded-lg" />
      <Skeleton className="h-6 w-3/4 rounded" />
      <Skeleton className="h-4 w-full rounded" />
      <Skeleton className="h-4 w-5/6 rounded" />
      <Skeleton className="h-4 w-1/2 rounded" />
    </article>
  );
}

export function SkeletonEventCard({ className = '' }) {
  return (
    <article className={`bg-white rounded-xl overflow-hidden border border-gray-100 animate-pulse ${className}`}>
      <Skeleton className="h-48 w-full" />
      <div className="p-5 space-y-3 animate-pulse">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-6 w-3/4 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>
    </article>
  );
}

export function SkeletonOpportunityCard({ className = '' }) {
  return (
    <article className={`bg-white rounded-xl border border-gray-100 p-5 animate-pulse space-y-3 ${className}`}>
      <div className="flex gap-2">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="h-6 w-3/4 rounded" />
      <Skeleton className="h-4 w-full rounded" />
      <Skeleton className="h-4 w-5/6 rounded" />
      <Skeleton className="h-4 w-1/2 rounded" />
      <Skeleton className="h-8 w-24 rounded-lg" />
    </article>
  );
}

export function SkeletonList({ count = 6, Item }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Carregando...">
      {Array.from({ length: count }).map((_, i) => (
        <Item key={i} />
      ))}
    </div>
  );
}

export function SkeletonDetail({ className = '' }) {
  return (
    <article className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse ${className}`}>
      <Skeleton className="h-80 sm:h-96 w-full" />
      <div className="p-6 sm:p-8 space-y-4 animate-pulse">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-8 w-3/4 rounded" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-8 w-32 rounded-lg" />
          <Skeleton className="h-8 w-32 rounded-lg" />
          <Skeleton className="h-8 w-32 rounded-lg" />
        </div>
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-12 w-full rounded" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-12 w-full rounded" />
          </div>
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </article>
  );
}