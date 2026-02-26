import { SkeletonInfographic } from '@/components/ui/SkeletonInfographic'
import { Header } from '@/components/layout/Header'
import { PageWrapper } from '@/components/layout/PageWrapper'

export default function Loading() {
  return (
    <>
      <Header />
      <PageWrapper className="flex flex-col items-center py-6">
        <SkeletonInfographic />
      </PageWrapper>
    </>
  )
}
