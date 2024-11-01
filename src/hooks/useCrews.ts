import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

interface Crew {
  id: number;
  name: string;
  description: string;
  members: {
    id: number;
    name: string;
    rank: {
      id: number;
      name: string;
      level: number;
    };
  }[];
}

export function useCrews() {
  return useQuery<Crew[]>({
    queryKey: ['crews'],
    queryFn: async () => {
      const { data } = await api.get('/crews');
      return data;
    },
  });
} 