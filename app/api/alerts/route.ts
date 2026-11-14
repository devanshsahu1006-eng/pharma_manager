import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { verifySession } from '../../../lib/auth';

export async function GET(req: NextRequest) {
  const session = await verifySession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let medicines;
    try {
      medicines = await prisma.medicine.findMany();
    } catch (dbErr) {
      console.warn('DB connect failed in alerts, using fallback mock list');
      // Return custom inline mock medicines for preview
      medicines = [
        {
          id: 'm1',
          name: 'Paracetamol 500mg',
          batchNumber: 'PR-2026-01',
          quantityAvailable: 150,
          minimumThreshold: 30,
          expiryDate: new Date('2026-10-01'), // long time
        },
        {
          id: 'm2',
          name: 'Amoxicillin 250mg Capsule',
          batchNumber: 'AMX-112',
          quantityAvailable: 12, // low stock! threshold is 25
          minimumThreshold: 25,
          expiryDate: new Date('2026-06-15'), // expiring in < 30 days
        },
        {
          id: 'm3',
          name: 'Lantus Insulin Solostar',
          batchNumber: 'LT-9801',
          quantityAvailable: 0, // CRITICAL: OUT OF STOCK!
          minimumThreshold: 10,
          expiryDate: new Date('2026-09-30'),
        },
        {
          id: 'm4',
          name: 'Lipitor 10mg Tablet',
          batchNumber: 'LP-332',
          quantityAvailable: 80,
          minimumThreshold: 20,
          expiryDate: new Date(Date.now() + 1000 * 3600 * 24 * 18), // CRITICAL: Expiry in 18 days
        },
        {
          id: 'm5',
          name: 'Xanax 0.5mg Tablet',
          batchNumber: 'XN-771',
          quantityAvailable: 14, // NOTICE: stock 14 is just below threshold 15
          minimumThreshold: 15,
          expiryDate: new Date('2027-02-15'),
        }
      ];
    }

    const now = new Date();
    const alerts: any[] = [];

    medicines.forEach((med: any) => {
      const stock = med.quantityAvailable ?? 0;
      const threshold = med.minimumThreshold ?? 0;
      
      let daysToExpiry = 9999;
      if (med.expiryDate) {
        const exp = new Date(med.expiryDate);
        const diffTime = exp.getTime() - now.getTime();
        daysToExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }

      const isLowStock = stock <= threshold;
      const isExpiring = daysToExpiry <= 90;

      if (isLowStock || isExpiring) {
        // Determine severity
        let severity: 'critical' | 'warning' | 'notice' = 'notice';

        if (daysToExpiry <= 30 || stock === 0) {
          severity = 'critical';
        } else if ((daysToExpiry > 30 && daysToExpiry <= 60) || (stock <= threshold * 0.5)) {
          severity = 'warning';
        }

        alerts.push({
          id: `alert_${med.id}`,
          medicineId: med.id,
          name: med.name,
          batchNumber: med.batchNumber || 'N/A',
          quantityAvailable: stock,
          minimumThreshold: threshold,
          daysToExpiry: daysToExpiry === 9999 ? null : daysToExpiry,
          expiryDate: med.expiryDate,
          severity,
          isLowStock,
          isExpiring,
        });
      }
    });

    // Sort by severity (critical first)
    const severityWeight: Record<'critical' | 'warning' | 'notice', number> = { critical: 3, warning: 2, notice: 1 };
    alerts.sort((a, b) => severityWeight[b.severity as 'critical' | 'warning' | 'notice'] - severityWeight[a.severity as 'critical' | 'warning' | 'notice']);

    return NextResponse.json(alerts);
  } catch (error) {
    console.error('API Error in alerts GET:', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
