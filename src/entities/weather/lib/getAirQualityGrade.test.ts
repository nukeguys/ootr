import { describe, it, expect } from 'vitest';
import { getAirQualityGrade } from './getAirQualityGrade';

describe('getAirQualityGrade', () => {
  describe('PM2.5 등급 경계값', () => {
    it('0–15 → good', () => {
      expect(getAirQualityGrade(0, 0)).toBe('good');
      expect(getAirQualityGrade(0, 15)).toBe('good');
    });

    it('16–50 → fair', () => {
      expect(getAirQualityGrade(0, 16)).toBe('fair');
      expect(getAirQualityGrade(0, 50)).toBe('fair');
    });

    it('51–100 → poor', () => {
      expect(getAirQualityGrade(0, 51)).toBe('poor');
      expect(getAirQualityGrade(0, 100)).toBe('poor');
    });

    it('101+ → bad', () => {
      expect(getAirQualityGrade(0, 101)).toBe('bad');
      expect(getAirQualityGrade(0, 200)).toBe('bad');
    });
  });

  describe('PM10 등급 경계값', () => {
    it('0–30 → good', () => {
      expect(getAirQualityGrade(0, 0)).toBe('good');
      expect(getAirQualityGrade(30, 0)).toBe('good');
    });

    it('31–80 → fair', () => {
      expect(getAirQualityGrade(31, 0)).toBe('fair');
      expect(getAirQualityGrade(80, 0)).toBe('fair');
    });

    it('81–150 → poor', () => {
      expect(getAirQualityGrade(81, 0)).toBe('poor');
      expect(getAirQualityGrade(150, 0)).toBe('poor');
    });

    it('151+ → bad', () => {
      expect(getAirQualityGrade(151, 0)).toBe('bad');
      expect(getAirQualityGrade(300, 0)).toBe('bad');
    });
  });

  describe('PM10/PM2.5 중 나쁜 쪽 선택', () => {
    it('PM10 good + PM2.5 poor → poor', () => {
      expect(getAirQualityGrade(20, 80)).toBe('poor');
    });

    it('PM10 bad + PM2.5 fair → bad', () => {
      expect(getAirQualityGrade(200, 30)).toBe('bad');
    });

    it('PM10 fair + PM2.5 fair → fair', () => {
      expect(getAirQualityGrade(50, 30)).toBe('fair');
    });
  });
});
