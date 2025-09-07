import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/data/prisma'
import { parse } from 'csv-parse/sync'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'

interface ImportUnit {
  name_en: string
  name_ta: string
  name_hi?: string
  symbol: string
  category_slugs?: string
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { success: false, error: 'Only CSV files are allowed' },
        { status: 400 }
      )
    }

    // Read file content
    const csvContent = await file.text()

    // Parse CSV
    const records: ImportUnit[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })

    if (records.length === 0) {
      return NextResponse.json(
        { success: false, error: 'CSV file is empty' },
        { status: 400 }
      )
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
      duplicates: [] as string[],
    }

    // Process each record
    for (let i = 0; i < records.length; i++) {
      const record = records[i]
      const rowNumber = i + 2 // +2 because of header row and 0-based index

      try {
        // Validate required fields
        if (!record.name_en?.trim() || !record.name_ta?.trim() || !record.symbol?.trim()) {
          results.errors.push(`Row ${rowNumber}: Missing required fields (name_en, name_ta, symbol)`)
          results.failed++
          continue
        }

        // Check for duplicate symbol
        const existingUnit = await prisma.unit.findFirst({
          where: { symbol: record.symbol.trim() }
        })

        if (existingUnit) {
          results.duplicates.push(`Row ${rowNumber}: Unit with symbol '${record.symbol}' already exists`)
          results.failed++
          continue
        }

        // Handle categories if specified
        let categoryIds: number[] = []
        if (record.category_slugs?.trim()) {
          const categorySlugs = record.category_slugs.split(',').map((slug: string) => slug.trim())

          for (const slug of categorySlugs) {
            const category = await prisma.category.findUnique({
              where: { slug }
            })

            if (!category) {
              results.errors.push(`Row ${rowNumber}: Category with slug '${slug}' not found`)
              results.failed++
              continue
            }

            categoryIds.push(category.id)
          }
        }

        // Create unit
        await prisma.unit.create({
          data: {
            name_en: record.name_en.trim(),
            name_ta: record.name_ta.trim(),
            name_hi: record.name_hi?.trim() || '',
            symbol: record.symbol.trim(),
            categories: {
              create: categoryIds.map(categoryId => ({
                categoryId
              }))
            }
          }
        })

        results.success++
      } catch (error) {
        console.error(`Error processing row ${rowNumber}:`, error)
        results.errors.push(`Row ${rowNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        results.failed++
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        total: records.length,
        success: results.success,
        failed: results.failed,
        duplicates: results.duplicates.length,
        errors: results.errors,
        duplicates_list: results.duplicates,
      }
    })

  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process import' },
      { status: 500 }
    )
  }
}