'use client'

import { useParams } from 'next/navigation';
import EditAlert from '@/components/EditAlert';

export default function EditPage() {

  const params = useParams();
  const id = params.id as string;

  return <EditAlert id={id}/>;
}