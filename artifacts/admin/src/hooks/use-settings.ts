import { useQueryClient } from "@tanstack/react-query";
import { 
  useGetVisualizationSettings as useGeneratedGetVisualizationSettings,
  useUpdateVisualizationSettings as useGeneratedUpdateVisualizationSettings,
  getGetVisualizationSettingsQueryKey
} from "@workspace/api-client-react";

export function useVisualizationSettings() {
  return useGeneratedGetVisualizationSettings();
}

export function useUpdateVisualizationSettings() {
  const queryClient = useQueryClient();
  const mutation = useGeneratedUpdateVisualizationSettings();

  return {
    ...mutation,
    mutate: (data: Parameters<typeof mutation.mutate>[0], options?: Parameters<typeof mutation.mutate>[1]) => {
      mutation.mutate(data, {
        ...options,
        onSuccess: (result, variables, context) => {
          queryClient.invalidateQueries({ queryKey: getGetVisualizationSettingsQueryKey() });
          options?.onSuccess?.(result, variables, context);
        }
      });
    }
  };
}
