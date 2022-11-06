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
  getListsPerBoard,
  dragCardsInSameList,
  dragCardsBetweenList,
} from '.';

export const useBoards = (userId: string) => {
  return useQuery<DocumentData[], Error>('boards', () => getBoards(userId));
};

// Use cached board data
export const useCachedBoards = () => {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<DocumentData[]>(['boards']);
};

// Add board
export const useAddBoard = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ userId, title, bgColor }: newBoardObject) => {
      return addBoard(userId, title, bgColor);
    },
    {
      // When mutate is called:
      onMutate: async ({ title, bgColor }) => {
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
      // onError: (err, variables, context) => {
      //   if (context?.previousBoards !== undefined) {
      //     queryClient.setQueryData<DocumentData[]>(
      //       'boards',
      //       context.previousBoards,
      //     );
      //   }
      // },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries('boards');
      },
    },
  );
};

// Edit board
export const useEditBoard = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({
      userId,
      boardId,
      title,
      bgColor,
    }: newBoardObject & { boardId: string }) => {
      return editBoard(userId, boardId, title, bgColor);
    },
    {
      onMutate: async ({ boardId, title, bgColor }) => {
        await queryClient.cancelQueries('boards');

        const previousBoards =
          queryClient.getQueryData<DocumentData[]>('boards');

        const currentBoards = previousBoards?.map((board) => {
          if (board.id === boardId) {
            board.title = title;
            board.bgColor = bgColor;
          }
          return board;
        });

        // Optimistically update to the new value
        if (currentBoards) {
          queryClient.setQueryData<DocumentData[]>('boards', [
            ...currentBoards,
          ]);
        }

        return { currentBoards };
      },

      onSettled: () => {
        queryClient.invalidateQueries('boards');
      },
    },
  );
};

// Delete board
export const useDeleteBoard = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ userId, boardId }: UserId & { boardId: string }) => {
      return deleteBoard(userId, boardId);
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
export const useListsPerBoard = (userId: string, boardId: string) => {
  return useQuery<DocumentData[]>(['lists'], () =>
    getListsPerBoard(userId, boardId),
  );
};

// Add List
export const useAddList = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ title, userId, boardId }: newListObject) => {
      return addList(title, userId, boardId);
    },
    {
      // When mutate is called:
      onMutate: async ({ title, boardId }) => {
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
      // onError: (err, variables, context) => {
      //   if (context?.previousLists) {
      //     queryClient.setQueryData<DocumentData[]>(
      //       'lists',
      //       context.previousLists,
      //     );
      //   }
      // },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries('lists');
      },
    },
  );
};

// Edit List
export const useEditList = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({
      title,
      listId,
      boardId,
      userId,
    }: newListObject & { listId: string }) => {
      return editList(title, listId, boardId, userId);
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
export const useDeleteList = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ listId, boardId, userId }: newListObject & { listId: string }) => {
      return deleteList(listId, boardId, userId);
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

// Add List
export const useAddCard = () => {
  const queryClient = useQueryClient();
  // Get ID

  return useMutation(
    ({ textContent, listId, boardId, userId }: newCardObject) => {
      return addCard(textContent, listId, boardId, userId);
    },
    {
      onMutate: async ({ textContent, listId }) => {
        // const uid = uuidv4();
        await queryClient.cancelQueries('lists');
        const previousLists = queryClient.getQueryData<DocumentData[]>('lists');

        const currentLists = previousLists?.map((list) => {
          if (list.id === listId) {
            list.cards = [...list.cards, textContent];
          }
          return list;
        });

        if (currentLists) {
          queryClient.setQueryData<DocumentData[]>('lists', [...currentLists]);
        }
        return { currentLists };
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries('lists');
      },
    },
  );
};

// Edit List
export const useEditCard = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({
      cardId,
      textContent,
      listId,
      boardId,
      userId,
    }: newCardObject & { cardId: number }) => {
      return editCard(cardId, textContent, listId, boardId, userId);
    },
    {
      onSuccess: () => {
        // ✅ refetch cards after mutation is successfull
        queryClient.invalidateQueries(['lists']);
      },
    },
  );
};

// Delete Card
export const useDeleteCard = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ textContent, listId, boardId, userId }: newCardObject) => {
      return deleteCard(textContent, listId, boardId, userId);
    },
    {
      onSuccess: () => {
        // ✅ refetch cards after mutation is successfull
        queryClient.invalidateQueries(['lists']);
      },
    },
  );
};

// Drag cards in the same list
export const useDragCardsInSameList = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ cards, listId, boardId, userId }: dragCardsObject) => {
      return dragCardsInSameList({ cards, listId, boardId, userId });
    },
    {
      onMutate: async ({ cards, listId }) => {
        await queryClient.cancelQueries('lists');
        const previousLists = queryClient.getQueryData<DocumentData[]>('lists');

        const currentLists = previousLists?.map((list) => {
          if (list.id === listId) {
            list.cards = cards;
          }
          return list;
        });

        if (currentLists) {
          queryClient.setQueryData<DocumentData[]>('lists', [...currentLists]);
        }

        return { currentLists };
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries('lists');
      },

      // onSuccess: () => {
      //   // ✅ refetch cards after mutation is successfull
      //   queryClient.invalidateQueries(['lists']);
      // },
    },
  );
};

export const useDragCardsBetweenList = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({
      sourceCards,
      destCards,
      sourceListId,
      destListId,
      boardId,
      userId,
    }: dragCardsBetweenObject) => {
      return dragCardsBetweenList({
        sourceCards,
        destCards,
        sourceListId,
        destListId,
        boardId,
        userId,
      });
    },
    {
      onMutate: async ({
        sourceCards,
        destCards,
        sourceListId,
        destListId,
      }) => {
        await queryClient.cancelQueries('lists');
        const previousLists = queryClient.getQueryData<DocumentData[]>('lists');

        const currentLists = previousLists?.map((list) => {
          if (list.id === sourceListId) {
            list.cards = sourceCards;
          }

          if (list.id === destListId) {
            list.cards = destCards;
          }
          return list;
        });

        if (currentLists) {
          queryClient.setQueryData<DocumentData[]>('lists', [...currentLists]);
        }

        return { currentLists };
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries('lists');
      },
    },
  );
};
