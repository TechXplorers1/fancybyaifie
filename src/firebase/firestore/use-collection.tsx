'use client';

import { useEffect, useState, useRef } from 'react';
import {
  onSnapshot,
  query,
  collection,
  where,
  orderBy,
  limit,
  startAt,
  startAfter,
  endAt,
  endBefore,
  doc,
  getDoc,
  getDocs,
  Query,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
} from 'firebase/firestore';
import { useAuth } from '../provider';
import { FirestorePermissionError } from '../errors';
import { errorEmitter } from '../error-emitter';

// This is a simplified version of the QueryConstraint type from firebase/firestore
type QueryConstraint = {
  type: 'where' | 'orderBy' | 'limit' | 'startAt' | 'startAfter' | 'endAt' | 'endBefore';
};

const isMemoized = (obj: any): boolean => {
  return obj && obj.hasOwnProperty('__memoized');
}

export function useCollection<T>(query: Query | null, options: any = {}) {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);
  const { initialData, once } = options;

  if (query && !isMemoized(query)) {
    throw new Error(`${query} was not properly memoized using useMemoFirebase`);
  }

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    if (!query) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    if (once) {
      getDocs(query)
        .then((snapshot: QuerySnapshot<DocumentData>) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setData(data as T[]);
          setLoading(false);
        })
        .catch(async (serverError: FirestoreError) => {
          setError(serverError);
          setLoading(false);
          const permissionError = new FirestorePermissionError({
            path: (query as any)._query.path.segments.join('/'),
            operation: 'list',
          });
          errorEmitter.emit('permission-error', permissionError);
        });
      return;
    }

    const unsubscribe = onSnapshot(
      query,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(data as T[]);
        setLoading(false);
        setError(null);
      },
      async (serverError: FirestoreError) => {
        setError(serverError);
        setLoading(false);
        const permissionError = new FirestorePermissionError({
          path: (query as any)._query.path.segments.join('/'),
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
      }
    );

    return () => unsubscribe();
  }, [query, once]);

  return { data, loading, error };
}
