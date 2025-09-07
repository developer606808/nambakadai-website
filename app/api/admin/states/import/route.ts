import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/data/prisma'
import { parse } from 'csv-parse/sync'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'

interface ImportState {
  name_en: string
  name_ta: string
  name_hi?: string
  stateCode: string
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
    const records: ImportState[] = parse(csvContent, {
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
        if (!record.name_en?.trim() || !record.name_ta?.trim() || !record.stateCode?.trim()) {
          results.errors.push(`Row ${rowNumber}: Missing required fields (name_en, name_ta, stateCode)`)
          results.failed++
          continue
        }

        // Check for duplicate state code
        const existingState = await prisma.state.findFirst({
          where: { stateCode: record.stateCode.trim().toUpperCase() }
        })

        if (existingState) {
          results.duplicates.push(`Row ${rowNumber}: State with code '${record.stateCode}' already exists`)
          results.failed++
          continue
        }

        // Create state
        await prisma.state.create({
          data: {
            name_en: record.name_en.trim(),
            name_ta: record.name_ta.trim(),
            name_hi: record.name_hi?.trim() || '',
            stateCode: record.stateCode.trim().toUpperCase(),
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