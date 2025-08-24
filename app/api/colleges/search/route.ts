import { NextResponse } from 'next/server'
import { colleges } from '@/lib/college-data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')?.toLowerCase() || ''

  if (!query) {
    return NextResponse.json({ colleges: [] })
  }

  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(query) ||
    college.location.toLowerCase().includes(query) ||
    college.state.toLowerCase().includes(query)
  ).slice(0, 15) // Increased limit to 15 results

  return NextResponse.json({ colleges: filteredColleges })
}
