
'use client';
import { useRef, useEffect } from 'react';
import WordCloud from 'wordcloud';

type WordItem = [string, number];

export default function CanvasWordCloud({ words }: { words: WordItem[] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current && words.length > 0) {
      WordCloud(canvasRef.current, {
        list: words,
        gridSize: 8,
        weightFactor: 25,
        fontFamily: 'Impact',
        color: 'random-dark',
        rotateRatio: 0.5,
        rotationSteps: 2,
        backgroundColor: '#f9f9f9',
      });
    }
  }, [words]);

  return <canvas ref={canvasRef} width={900} height={400} />;
}
