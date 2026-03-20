import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Store } from "../backend";
import { useActor } from "./useActor";

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllStores() {
  const { actor, isFetching } = useActor();
  return useQuery<Store[]>({
    queryKey: ["stores"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStores();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddStore() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (store: Store) => {
      if (!actor) throw new Error("Not connected");
      return actor.addStore(store);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
    },
  });
}

export function useDeleteStore() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (storeId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteStore(storeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
    },
  });
}
