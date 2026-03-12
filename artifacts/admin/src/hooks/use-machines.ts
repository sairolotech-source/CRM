import { useQueryClient } from "@tanstack/react-query";
import { 
  useListMachines as useGeneratedListMachines,
  useGetMachine as useGeneratedGetMachine,
  useCreateMachine as useGeneratedCreateMachine,
  useUpdateMachine as useGeneratedUpdateMachine,
  useDeleteMachine as useGeneratedDeleteMachine,
  getListMachinesQueryKey,
  getGetMachineQueryKey
} from "@workspace/api-client-react";

export function useMachines() {
  return useGeneratedListMachines();
}

export function useMachine(id: number) {
  return useGeneratedGetMachine(id);
}

export function useCreateMachine() {
  const queryClient = useQueryClient();
  const mutation = useGeneratedCreateMachine();
  
  return {
    ...mutation,
    mutate: (data: Parameters<typeof mutation.mutate>[0], options?: Parameters<typeof mutation.mutate>[1]) => {
      mutation.mutate(data, {
        ...options,
        onSuccess: (data, variables, context) => {
          queryClient.invalidateQueries({ queryKey: getListMachinesQueryKey() });
          options?.onSuccess?.(data, variables, context);
        }
      });
    },
    mutateAsync: async (data: Parameters<typeof mutation.mutateAsync>[0], options?: Parameters<typeof mutation.mutateAsync>[1]) => {
      const result = await mutation.mutateAsync(data, options);
      queryClient.invalidateQueries({ queryKey: getListMachinesQueryKey() });
      return result;
    }
  };
}

export function useUpdateMachine() {
  const queryClient = useQueryClient();
  const mutation = useGeneratedUpdateMachine();

  return {
    ...mutation,
    mutate: (data: Parameters<typeof mutation.mutate>[0], options?: Parameters<typeof mutation.mutate>[1]) => {
      mutation.mutate(data, {
        ...options,
        onSuccess: (result, variables, context) => {
          queryClient.invalidateQueries({ queryKey: getListMachinesQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetMachineQueryKey(variables.id) });
          options?.onSuccess?.(result, variables, context);
        }
      });
    }
  };
}

export function useDeleteMachine() {
  const queryClient = useQueryClient();
  const mutation = useGeneratedDeleteMachine();

  return {
    ...mutation,
    mutate: (data: Parameters<typeof mutation.mutate>[0], options?: Parameters<typeof mutation.mutate>[1]) => {
      mutation.mutate(data, {
        ...options,
        onSuccess: (result, variables, context) => {
          queryClient.invalidateQueries({ queryKey: getListMachinesQueryKey() });
          options?.onSuccess?.(result, variables, context);
        }
      });
    }
  };
}
