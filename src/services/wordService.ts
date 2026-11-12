import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../firebase';
import { WordItem, WordFormData } from '../types';

/**
 * Returns the collection reference for a user's words:
 * Path: users/{userId}/words
 */
export const getUserWordsCollection = (userId: string) => {
  return collection(db, 'users', userId, 'words');
};

/**
 * Subscribes to realtime updates of words for a user.
 */
export const subscribeUserWords = (
  userId: string,
  onUpdate: (words: WordItem[]) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  const wordsRef = getUserWordsCollection(userId);
  const q = query(wordsRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const words: WordItem[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          word: data.word || '',
          meaning: data.meaning || '',
          example: data.example || '',
          memorized: Boolean(data.memorized),
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
      });
      onUpdate(words);
    },
    (error) => {
      console.error('Error fetching words from Firestore:', error);
      if (onError) onError(error);
    }
  );
};

/**
 * Adds a new word to the user's collection.
 */
export const addWord = async (userId: string, data: WordFormData): Promise<string> => {
  const wordsRef = getUserWordsCollection(userId);
  const docRef = await addDoc(wordsRef, {
    word: data.word.trim(),
    meaning: data.meaning.trim(),
    example: data.example.trim(),
    memorized: Boolean(data.memorized),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

/**
 * Updates an existing word.
 */
export const updateWord = async (
  userId: string,
  wordId: string,
  data: Partial<WordFormData>
): Promise<void> => {
  const wordRef = doc(db, 'users', userId, 'words', wordId);
  const updatePayload: Record<string, any> = {
    updatedAt: serverTimestamp(),
  };

  if (data.word !== undefined) updatePayload.word = data.word.trim();
  if (data.meaning !== undefined) updatePayload.meaning = data.meaning.trim();
  if (data.example !== undefined) updatePayload.example = data.example.trim();
  if (data.memorized !== undefined) updatePayload.memorized = Boolean(data.memorized);

  await updateDoc(wordRef, updatePayload);
};

/**
 * Deletes a word.
 */
export const deleteWord = async (userId: string, wordId: string): Promise<void> => {
  const wordRef = doc(db, 'users', userId, 'words', wordId);
  await deleteDoc(wordRef);
};

/**
 * Toggles the memorized status of a word.
 */
export const toggleWordMemorized = async (
  userId: string,
  wordId: string,
  currentStatus: boolean
): Promise<void> => {
  const wordRef = doc(db, 'users', userId, 'words', wordId);
  await updateDoc(wordRef, {
    memorized: !currentStatus,
    updatedAt: serverTimestamp(),
  });
};
