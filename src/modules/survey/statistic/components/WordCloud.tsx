import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import 'd3-array';

interface WordCloudProps {
  wordCloud: { text: string; size: number }[];
}
// 무작위 색상을 생성하는 함수
function getRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';

  Array.from({ length: 6 }).forEach(() => {
    color += letters[Math.floor(Math.random() * 16)];
  });

  return color;
}

function WordCloud({ wordCloud }: WordCloudProps): JSX.Element | null {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const extractedWords = wordCloud.map((item) => item.text);
    const wordCloudDataString = JSON.stringify(extractedWords);

    const words = wordCloudDataString
      .trim()
      .split(/,/g)
      .map((w) => w.replace(/\[/g, ''))
      .map((w) => w.replace(/\]/g, ''))
      .map((w) => w.replace(/"/g, ''))
      .map((w) => w.substring(0, 15))
      .map((w) => w.toLowerCase());

    // D3 코드 시작
    const fontFamily = 'GmarketSansMedium';
    const WebFontScale = 20;
    const mobileFontScale = 3.5;
    const padding = 2;
    const height = window.innerWidth < 600 ? 190 : 600;
    const width = window.innerWidth < 600 ? 330 : 800;
    const rotate = () => 0;

    const mobileSizeMediaQuery: (size: number) => number = (size) =>
      window.innerWidth <= 600
        ? size * mobileFontScale
        : Math.sqrt(size) * WebFontScale;

    const data = d3
      .rollups(
        words,
        (group) => group.length,
        (w) => w
      )
      .sort(([, a], [, b]) => d3.descending(a, b))
      .slice(0, 250)
      .map(([text, size]) => ({ text, size }));

    const svg = d3
      .select(containerRef.current)
      .append('svg')
      .attr('height', height)
      .attr('width', width)
      .attr('font-family', fontFamily)
      .attr('text-anchor', 'middle');

    const wordCloudLayout = cloud()
      .size([width, height])
      .words(data)
      .padding(padding)
      .rotate(rotate)
      .font(fontFamily)
      .fontSize((d) =>
        typeof d.size === 'number' ? mobileSizeMediaQuery(d.size) : 1
      )
      .on('word', ({ size, x, y, rotate: wordRotate, text }) => {
        svg
          .append('text')
          .attr('font-size', size as number)
          .attr('transform', `translate(${x},${y}) rotate(${wordRotate})`)
          .attr('fill', getRandomColor())
          .text(text as string);
      });

    wordCloudLayout.start();

    // return () => {
    //   if (containerRef.current) {
    //     d3.select(containerRef.current).selectAll('*').remove();
    //   }
    // };
  }, [wordCloud]);

  return <div ref={containerRef} />;
}

export default WordCloud;
