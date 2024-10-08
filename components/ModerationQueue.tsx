'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export default function ModerationQueue({ tutorials }) {
  const [pendingTutorials, setPendingTutorials] = useState(tutorials);
  const { toast } = useToast();

  async function handleModeration(tutorialId: string, decision: 'APPROVED' | 'REJECTED') {
    try {
      const response = await fetch(`/api/tutorials/${tutorialId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: decision }),
      });

      if (!response.ok) {
        throw new Error('Failed to update tutorial status');
      }

      setPendingTutorials(pendingTutorials.filter(tutorial => tutorial.id !== tutorialId));
      toast({
        title: 'Tutorial moderated',
        description: `The tutorial has been ${decision.toLowerCase()}.`,
      });
    } catch (error) {
      console.error('Error moderating tutorial:', error);
      toast({
        title: 'Error',
        description: 'Failed to moderate the tutorial. Please try again.',
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="space-y-6">
      {pendingTutorials.length === 0 ? (
        <p>No tutorials pending moderation.</p>
      ) : (
        pendingTutorials.map((tutorial) => (
          <div key={tutorial.id} className="border p-4 rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">{tutorial.title}</h2>
            <p className="text-sm text-gray-500 mb-2">
              By {tutorial.author.name} on {new Date(tutorial.createdAt).toLocaleDateString()}
            </p>
            <p className="mb-4">{tutorial.content.substring(0, 150)}...</p>
            <div className="space-x-2">
              <Button onClick={() => handleModeration(tutorial.id, 'APPROVED')} variant="default">
                Approve
              </Button>
              <Button onClick={() => handleModeration(tutorial.id, 'REJECTED')} variant="destructive">
                Reject
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}