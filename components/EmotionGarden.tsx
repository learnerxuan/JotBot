import React, { useEffect, useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import PlantVisual from './PlantVisual';
import { mapEmotionToPlant } from './mapEmotionToPlant';

interface EmotionSnapshot {
  date: string;
  dominantEmotion: string;
  intensity: number;
  emotionVector: Record<string, number>;
  journalSummary: string;
}

const EmotionGarden: React.FC = () => {
  const { db, userId, isAuthReady } = useFirebase();
  const [snapshots, setSnapshots] = useState<EmotionSnapshot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || !userId || !isAuthReady) return;
    const fetchSnapshots = async () => {
      setLoading(true);
      const colRef = collection(db, `users/${userId}/emotionSnapshots`);
      const q = query(colRef, orderBy('date', 'desc'), limit(7));
      const querySnapshot = await getDocs(q);
      const data: EmotionSnapshot[] = [];
      querySnapshot.forEach(doc => {
        data.push(doc.data() as EmotionSnapshot);
      });
      // Sort by date ascending for timeline
      data.sort((a, b) => a.date.localeCompare(b.date));
      setSnapshots(data);
      setLoading(false);
    };
    fetchSnapshots();
  }, [db, userId, isAuthReady]);

  if (loading) return <div className="text-center py-8">Loading your garden...</div>;
  if (!snapshots.length) return <div className="text-center py-8">No emotion data found for the past week.</div>;

  return (
    <div className="w-full overflow-x-auto py-6">
      <div className="flex flex-row items-end min-w-max">
        {snapshots.map((snap, idx) => {
          const plantConfig = mapEmotionToPlant(snap.dominantEmotion, snap.intensity);
          return (
            <PlantVisual
              key={snap.date}
              emotion={snap.dominantEmotion}
              intensity={snap.intensity}
              date={snap.date}
              journalSummary={snap.journalSummary}
              plantConfig={plantConfig}
            />
          );
        })}
      </div>
    </div>
  );
};

export default EmotionGarden; 