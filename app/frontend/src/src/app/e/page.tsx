'use client'

import React from 'react';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';

/**
 * Renders the Employee component.
 * 
 * @returns JSX element
 */
export default function Employee() {
  const { user } = useAuth();

  /**
   * Renders the component.
   * 
   * @returns JSX element
   */
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>EMPLOYEE</h1>
      {user && (
        <ul>
          {Object.keys(user).map((attribute, index) => (
            <li key={index}>
              <strong>{attribute}:</strong>
              { typeof user[attribute] !== 'object' && <>{user[attribute]}</> }
              { typeof user[attribute] === 'object' && <>{JSON.stringify(user[attribute])}</> }
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
