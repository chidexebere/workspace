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

// Get boards
// const useBoards = (isFetching: boolean) => {
//   return useQuery<DocumentData[], Error>('boards', getBoards, {
//     enabled: isFetching,
//   });
// };

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
    // {
    //   onSuccess: () => {
    //     // ✅ refetch boards after mutation is successfull
    //     queryClient.invalidateQueries(['boards']);
    //   },
    // },
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
    ({ title, boardId, listId }: newListObject & { listId: string }) => {
      return editList(title, listId, boardId);
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
    ({ listId, boardId }: newListObject & { listId: string }) => {
      return deleteList(listId, boardId);
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
const useAddCard = () => {
  const queryClient = useQueryClient();
  // Get ID

  return useMutation(
    ({ textContent, listId, boardId }: newCardObject) => {
      return addCard(textContent, listId, boardId);
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
const useEditCard = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({
      cardId,
      textContent,
      listId,
      boardId,
    }: newCardObject & { cardId: number }) => {
      return editCard(cardId, textContent, listId, boardId);
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
const useDeleteCard = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ textContent, listId, boardId }: newCardObject) => {
      return deleteCard(textContent, listId, boardId);
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
const useDragCardsInSameList = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ cards, listId, boardId }: dragCardsObject) => {
      return dragCardsInSameList({ cards, listId, boardId });
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

const useDragCardsBetweenList = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({
      sourceCards,
      destCards,
      sourceListId,
      destListId,
      boardId,
    }: dragCardsBetweenObject) => {
      return dragCardsBetweenList({
        sourceCards,
        destCards,
        sourceListId,
        destListId,
        boardId,
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
  useAddCard,
  useEditCard,
  useDeleteCard,
  useDragCardsInSameList,
  useDragCardsBetweenList,
};
