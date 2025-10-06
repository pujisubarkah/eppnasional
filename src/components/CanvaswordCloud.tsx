
'use client';
import { useRef, useEffect } from 'react';
import WordCloud from 'wordcloud';

type WordItem = [string, number];

type CanvasWordCloudProps = {
  words: WordItem[];
  width?: number;
  height?: number;
};

export default function CanvasWordCloud({ words, width = 900, height = 400 }: CanvasWordCloudProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Batasi jumlah kata maksimal 200
  const limitedWords = words.slice(0, 200);

  useEffect(() => {
    if (canvasRef.current && limitedWords.length > 0) {
      WordCloud(canvasRef.current, {
        list: limitedWords,
        gridSize: 8,
        weightFactor: 25,
        fontFamily: 'Impact',
        color: 'random-dark',
        rotateRatio: 0.5,
        rotationSteps: 2,
        backgroundColor: '#f9f9f9',
      });
    }
  }, [limitedWords, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} />;
}
