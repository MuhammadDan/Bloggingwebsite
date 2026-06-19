// src/components/AdminStats.js
import StatsCards from './StatsCard';

export default function AdminStats({ stats }) {
  if (!stats) return null;

  return <StatsCards data={stats} />;
}