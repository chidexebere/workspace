import { DocumentData } from 'firebase/firestore';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  addBoard,
  addCard,
  addList,
  deleteBoard,
  deleteCard,
  deleteList,
  editBoard,
  editCard,
  editList,
  getBoards,
  getCardsPerBoard,
  getListsPerBoard,
  dragCardsInSameList,
  dragCardsBetweenList,
} from '.';

// Get boards
const useBoards = () => {
  return useQuery<DocumentData[], Error>('boards', getBoards);
};

// Use cached board data
const useCachedBoards = () => {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<DocumentData[]>(['boards']);
};

// Add board
const useAddBoard = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ title, bgColor }: newBoardObject) => {
      return addBoard(title, bgColor);
    },
    {
      // When mutate is called:
      onMutate: async ({ title, bgColor }: newBoardObject) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries('boards');

        // Snapshot the previous value
        const previousBoards =
          queryClient.getQueryData<DocumentData[]>('boards');

        // Optimistically update to the new value
        if (previousBoards) {
          queryClient.setQueryData<DocumentData[]>('boards', [
            ...previousBoards,
            {
              title: title,
              bgColor: bgColor,
            },
          ]);
        }

        return { previousBoards };
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (err, variables, context) => {
        if (context?.previousBoards) {
          queryClient.setQueryData<DocumentData[]>(
            'boards',
            context.previousBoards,
          );
        }
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries('boards');
      },
    },
  );
};

// Edit board
const useEditBoard = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ boardId, title, bgColor }: newBoardObject & { boardId: string }) => {
      return editBoard(boardId, title, bgColor);
    },
    {
      onSuccess: () => {
        // ✅ refetch boards after mutation is successfull
        queryClient.invalidateQueries(['boards']);
      },
    },
  );
};

// Delete board
const useDeleteBoard = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (boardId: string) => {
      return deleteBoard(boardId);
    },
    {
      onMutate: async (boardId) => {
        await queryClient.cancelQueries('boards');

        // Snapshot the previous value
        const previousBoards =
          queryClient.getQueryData<DocumentData[]>('boards');

        // Optimistically update to the new value
        if (previousBoards) {
          const filteredBoards = previousBoards.filter(
            (board) => board.id !== boardId,
          );
          queryClient.setQueryData<DocumentData[]>('boards', [
            ...filteredBoards,
          ]);
        }

        return { previousBoards };
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries('boards');
      },
    },
  );
};

// Get Lists per board
const useListsPerBoard = (boardId: string) => {
  return useQuery<DocumentData[]>(['lists'], () => getListsPerBoard(boardId));
};

// Add List
const useAddList = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ title, boardId }: newListObject) => {
      return addList(title, boardId);
    },
    {
      // When mutate is called:
      onMutate: async ({ title, boardId }: newListObject) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries('lists');

        // Snapshot the previous value
        const previousLists = queryClient.getQueryData<DocumentData[]>('lists');

        // Optimistically update to the new value
        if (previousLists) {
          queryClient.setQueryData<DocumentData[]>('lists', [
            ...previousLists,
            { title: title, boardId: boardId },
          ]);
        }

        return { previousLists };
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (err, variables, context) => {
        if (context?.previousLists) {
          queryClient.setQueryData<DocumentData[]>(
            'lists',
            context.previousLists,
          );
        }
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries('lists');
      },
    },
  );
};

// Edit List
const useEditList = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ title, listId }: existingListObject) => {
      return editList(title, listId);
    },
    {
      onSuccess: () => {
        // ✅ refetch lists after mutation is successfull
        queryClient.invalidateQueries(['lists']);
      },
    },
  );
};

// Delete List
const useDeleteList = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (listId: string) => {
      return deleteList(listId);
    },
    {
      onMutate: async (listId) => {
        await queryClient.cancelQueries('lists');

        // Snapshot the previous value
        const previousLists = queryClient.getQueryData<DocumentData[]>('lists');

        // Optimistically update to the new value
        if (previousLists) {
          const filteredLists = previousLists.filter(
            (list) => list.id !== listId,
          );
          queryClient.setQueryData<DocumentData[]>('lists', [...filteredLists]);
        }

        return { previousLists };
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries('lists');
      },
    },
  );
};

// Get cards per board
const useCardsPerBoard = (boardId: string) => {
  return useQuery<DocumentData[]>(['cards'], () => getCardsPerBoard(boardId));
};

// Add List
const useAddCard = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ textContent, listId, boardId }: newCardObject) => {
      return addCard(textContent, listId, boardId);
    },
    {
      onMutate: async ({ textContent, listId, boardId }: newCardObject) => {
        await queryClient.cancelQueries('cards');

        const previousCards = queryClient.getQueryData<DocumentData[]>('cards');

        if (previousCards) {
          queryClient.setQueryData<DocumentData[]>('cards', [
            ...previousCards,
            { textContent, listId, boardId },
          ]);
        }

        return { previousCards };
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (err, variables, context) => {
        if (context?.previousCards) {
          queryClient.setQueryData<DocumentData[]>(
            'cards',
            context.previousCards,
          );
        }
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries('cards');
      },
    },
  );
};

// Edit List
const useEditCard = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({
      cardId,
      textContent,
      listId,
      boardId,
    }: newCardObject & { cardId: string }) => {
      return editCard(cardId, textContent, listId, boardId);
    },
    {
      onSuccess: () => {
        // ✅ refetch cards after mutation is successfull
        queryClient.invalidateQueries(['cards']);
      },
    },
  );
};

// Delete Card
const useDeleteCard = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (cardId: string) => {
      return deleteCard(cardId);
    },
    {
      onMutate: async (cardId) => {
        await queryClient.cancelQueries('cards');

        // Snapshot the previous value
        const previousCards = queryClient.getQueryData<DocumentData[]>('cards');

        // Optimistically update to the new value
        if (previousCards) {
          const filteredCards = previousCards.filter(
            (card) => card.id !== cardId,
          );
          queryClient.setQueryData<DocumentData[]>('cards', [...filteredCards]);
        }

        return { previousCards };
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries('cards');
      },
    },
  );
};

// Drag cards in the same list
const useDragCardsInSameList = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (cardsCopy: DocumentData[]) => {
      return dragCardsInSameList(cardsCopy);
    },
    {
      onMutate: async (cardsCopy) => {
        await queryClient.cancelQueries('cards');

        // Snapshot the previous value
        const previousCards = queryClient.getQueryData<DocumentData[]>('cards');

        // Optimistically update to the new value
        if (previousCards) {
          queryClient.setQueryData<DocumentData[]>('cards', [...cardsCopy]);
        }
        return { previousCards };
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries('cards');
      },
    },
  );
};

const useDragCardsBetweenList = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ cardsCopy, cardId, listId }: dragBetweenObject) => {
      return dragCardsBetweenList(cardsCopy, cardId, listId);
    },
    {
      onMutate: async ({ cardsCopy, cardId, listId }: dragBetweenObject) => {
        await queryClient.cancelQueries('cards');

        // Snapshot the previous value
        const previousCards = queryClient.getQueryData<DocumentData[]>('cards');
        const cardCopyIndex = cardsCopy.findIndex((card) => card.id === cardId);
        cardsCopy[cardCopyIndex].listId = listId;

        // Optimistically update to the new value
        if (previousCards) {
          queryClient.setQueryData<DocumentData[]>('cards', [...cardsCopy]);
        }
        return { previousCards };
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries('cards');
      },
    },
  );
};

export {
  useBoards,
  useCachedBoards,
  useAddBoard,
  useEditBoard,
  useDeleteBoard,
  useListsPerBoard,
  useAddList,
  useEditList,
  useDeleteList,
  useCardsPerBoard,
  useAddCard,
  useEditCard,
  useDeleteCard,
  useDragCardsInSameList,
  useDragCardsBetweenList,
};
