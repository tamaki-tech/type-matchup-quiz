import { describe, expect, it } from 'vitest';
import { calcMultiplier } from '../domain/multiplier';

describe('calcMultiplier — 単タイプ', () => {
  it('みずvsほのお = 2倍', () => {
    expect(calcMultiplier('water', { primary: 'fire' })).toBe(2);
  });
  it('ほのおvsみず = 0.5倍', () => {
    expect(calcMultiplier('fire', { primary: 'water' })).toBe(0.5);
  });
  it('ノーマルvsゴースト = 0倍', () => {
    expect(calcMultiplier('normal', { primary: 'ghost' })).toBe(0);
  });
  it('ゴーストvsノーマル = 0倍', () => {
    expect(calcMultiplier('ghost', { primary: 'normal' })).toBe(0);
  });
  it('でんきvsじめん = 0倍', () => {
    expect(calcMultiplier('electric', { primary: 'ground' })).toBe(0);
  });
  it('かくとうvsゴースト = 0倍', () => {
    expect(calcMultiplier('fighting', { primary: 'ghost' })).toBe(0);
  });
  it('じめんvsひこう = 0倍', () => {
    expect(calcMultiplier('ground', { primary: 'flying' })).toBe(0);
  });
  it('どくvsはがね = 0倍', () => {
    expect(calcMultiplier('poison', { primary: 'steel' })).toBe(0);
  });
  it('エスパーvsあく = 0倍', () => {
    expect(calcMultiplier('psychic', { primary: 'dark' })).toBe(0);
  });
  it('ドラゴンvsフェアリー = 0倍', () => {
    expect(calcMultiplier('dragon', { primary: 'fairy' })).toBe(0);
  });
  it('フェアリーvsドラゴン = 2倍', () => {
    expect(calcMultiplier('fairy', { primary: 'dragon' })).toBe(2);
  });
  it('はがねvsフェアリー = 2倍', () => {
    expect(calcMultiplier('steel', { primary: 'fairy' })).toBe(2);
  });
  it('こおりvsドラゴン = 2倍', () => {
    expect(calcMultiplier('ice', { primary: 'dragon' })).toBe(2);
  });
  it('くさvsみず = 2倍', () => {
    expect(calcMultiplier('grass', { primary: 'water' })).toBe(2);
  });
  it('ノーマルvsはがね = 0.5倍', () => {
    expect(calcMultiplier('normal', { primary: 'steel' })).toBe(0.5);
  });
  it('ノーマルvsノーマル = 1倍', () => {
    expect(calcMultiplier('normal', { primary: 'normal' })).toBe(1);
  });
  it('かくとうvsはがね = 2倍', () => {
    expect(calcMultiplier('fighting', { primary: 'steel' })).toBe(2);
  });
  it('かくとうvsフェアリー = 0.5倍', () => {
    expect(calcMultiplier('fighting', { primary: 'fairy' })).toBe(0.5);
  });
});

describe('calcMultiplier — 複合タイプ', () => {
  it('こおりvs ドラゴン/ひこう = 4倍', () => {
    expect(calcMultiplier('ice', { primary: 'dragon', secondary: 'flying' })).toBe(4);
  });
  it('じめんvs ほのお/いわ = 4倍', () => {
    expect(calcMultiplier('ground', { primary: 'fire', secondary: 'rock' })).toBe(4);
  });
  it('みずvs ほのお/いわ = 4倍', () => {
    expect(calcMultiplier('water', { primary: 'fire', secondary: 'rock' })).toBe(4);
  });
  it('むしvs ほのお/はがね = 0.25倍', () => {
    expect(calcMultiplier('bug', { primary: 'fire', secondary: 'steel' })).toBe(0.25);
  });
  it('ノーマルvs はがね/いわ = 0.25倍', () => {
    expect(calcMultiplier('normal', { primary: 'steel', secondary: 'rock' })).toBe(0.25);
  });
  it('でんきvs みず/じめん = 0倍 (じめん側で無効)', () => {
    expect(calcMultiplier('electric', { primary: 'water', secondary: 'ground' })).toBe(0);
  });
  it('じめんvs くさ/ひこう = 0倍 (ひこう側で無効)', () => {
    expect(calcMultiplier('ground', { primary: 'grass', secondary: 'flying' })).toBe(0);
  });
  it('みずvs みず/くさ = 0.25倍', () => {
    expect(calcMultiplier('water', { primary: 'water', secondary: 'grass' })).toBe(0.25);
  });
  it('こおりvs みず/ひこう = 1倍 (みず半減 0.5 × ひこう抜群 2)', () => {
    expect(calcMultiplier('ice', { primary: 'water', secondary: 'flying' })).toBe(1);
  });
});
