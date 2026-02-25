import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { OutfitItem } from './OutfitItem';

describe('OutfitItem', () => {
  it('단일 아이템을 표시한다', () => {
    render(<OutfitItem label="Top" items={['긴팔 티셔츠']} />);
    expect(screen.getByText('긴팔 티셔츠')).toBeInTheDocument();
  });

  it('여러 아이템을 쉼표로 구분하여 표시한다', () => {
    render(
      <OutfitItem label="Top" items={['긴팔 티셔츠', '바람막이']} />,
    );
    expect(screen.getByText('긴팔 티셔츠, 바람막이')).toBeInTheDocument();
  });

  it('3개 이상의 아이템도 쉼표로 구분하여 표시한다', () => {
    render(
      <OutfitItem
        label="Accessories"
        items={['모자', '선글라스', '양말']}
      />,
    );
    expect(screen.getByText('모자, 선글라스, 양말')).toBeInTheDocument();
  });

  it('카테고리 라벨을 표시한다', () => {
    render(<OutfitItem label="Bottom" items={['쇼츠']} />);
    expect(screen.getByText('Bottom')).toBeInTheDocument();
  });
});
