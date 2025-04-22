import { useQueryClient } from "@tanstack/react-query";

export const useInvalidateQuery = () => {
  const queryClient = useQueryClient();

  const invalidateQuery = async (queryKey: string) => {
    await queryClient.invalidateQueries({
      queryKey: [queryKey],
    });
  };

  return { invalidateQuery };
};
