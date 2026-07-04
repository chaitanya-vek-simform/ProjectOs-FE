import { useQuery } from "@tanstack/react-query";

import { meetingsApi } from "@/services/meetings/meetingsApi";
import { MEETINGS_QUERY_KEYS } from "@/constants/queryKeys";
import {
  pollWhileAnyStatusPending,
  pollWhileStatusPending,
} from "@/lib/query-polling";

export function useMeetings(projectId?: string) {
  return useQuery({
    queryKey: MEETINGS_QUERY_KEYS.LIST(projectId ?? ""),
    queryFn: () => meetingsApi.getMeetings(projectId!),
    enabled: Boolean(projectId),
    refetchInterval: pollWhileAnyStatusPending,
  });
}

export function useMeeting(meetingId?: string) {
  return useQuery({
    queryKey: MEETINGS_QUERY_KEYS.DETAIL(meetingId ?? ""),
    queryFn: () => meetingsApi.getMeeting(meetingId!),
    enabled: Boolean(meetingId),
    refetchInterval: pollWhileStatusPending,
  });
}
