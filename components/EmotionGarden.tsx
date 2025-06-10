import React, { useEffect, useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import PlantVisual from './PlantVisual';
import { mapEmotionToPlant } from './mapEmotionToPlant';
import { motion } from 'framer-motion';

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
    <motion.div
      className="w-full overflow-x-auto py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex flex-row items-end min-w-max"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {snapshots.map((snap, idx) => {
          const plantConfig = mapEmotionToPlant(snap.dominantEmotion, snap.intensity);
          return (
            <motion.div
              key={snap.date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <PlantVisual
                emotion={snap.dominantEmotion}
                intensity={snap.intensity}
                date={snap.date}
                journalSummary={snap.journalSummary}
                plantConfig={plantConfig}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default EmotionGarden; 