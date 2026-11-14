import { NextRequest } from 'next/server';
import { supabase } from './supabase';
import prisma from './prisma';
import { Role } from '../types/pharmacy';

export interface AuthenticatedSession {
  userId: string;
  email: string;
  role: Role;
}

export async function verifySession(
  req: NextRequest,
  allowedRoles?: Role[]
): Promise<AuthenticatedSession | null> {
  const authHeader = req.headers.get('Authorization');
  
  // Developer and fallback mock session for local testing
  const isMockEnabled = 
    process.env.NODE_ENV === 'development' || 
    !process.env.NEXT_PUBLIC_SUPABASE_URL || 
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    if (isMockEnabled) {
      return {
        userId: 'mock-owner-uid',
        email: 'owner@pharmaos.com',
        role: 'OWNER',
      };
    }
    return null;
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return null;
    }

    // Lookup user role in local profiles table
    let profile = await prisma.userProfile.findUnique({
      where: { email: user.email },
    });

    // Auto-create default profile for testing if not present
    if (!profile && user.email) {
      profile = await prisma.userProfile.create({
        data: {
          email: user.email,
          role: user.email.includes('owner') ? 'OWNER' : 'ASSISTANT',
        },
      });
    }

    const role = (profile?.role as Role) || 'ASSISTANT';

    // Gate verification
    if (allowedRoles && !allowedRoles.includes(role)) {
      return null;
    }

    return {
      userId: user.id,
      email: user.email || '',
      role,
    };
  } catch (error) {
    console.error('Session validation exception:', error);
    if (isMockEnabled) {
      return {
        userId: 'mock-owner-uid',
        email: 'owner@pharmaos.com',
        role: 'OWNER',
      };
    }
    return null;
  }
}
