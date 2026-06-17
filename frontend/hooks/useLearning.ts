import { useMutation, useQuery } from "@tanstack/react-query";

import { askTutor, getLearningSessions } from "@/services/learning.service";

export function useLearningSessions() {
  return useQuery({ queryKey: ["learning-sessions"], queryFn: getLearningSessions });
}

export function useAskTutor() {
  return useMutation({ mutationFn: askTutor });
}
