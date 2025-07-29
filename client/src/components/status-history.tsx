import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { getStatusIcon } from "@/lib/status-icons";

interface StatusHistoryProps {
  userId: string;
}

export default function StatusHistory({ userId }: StatusHistoryProps) {
  const { data: activity = [] } = useQuery({
    queryKey: ["/api/users", userId, "activity"],
    enabled: !!userId,
  });

  const todayActivity = activity.slice(0, 5); // Show only recent 5 activities

  return (
    <section className="px-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Today's Activity</h3>
        <Button variant="ghost" size="sm" className="text-primary hover:text-purple">
          View All
        </Button>
      </div>

      <div className="space-y-3">
        {todayActivity.length === 0 ? (
          <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm text-center">
            <p className="text-neutral-500">No activity yet today</p>
          </div>
        ) : (
          todayActivity.map((activity: any) => {
            const Icon = getStatusIcon(activity.icon || activity.type);
            const timeAgo = activity.createdAt 
              ? formatDistanceToNow(new Date(activity.createdAt))
              : 'Just now';

            return (
              <div key={activity.id} className="bg-white rounded-xl p-4 border border-neutral-200 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 bg-${activity.color}/10 rounded-full flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`text-${activity.color} text-sm`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">
                        {activity.isOwnStatus ? 'You' : 'Partner'}
                      </p>
                      <span className="text-xs text-neutral-500">{timeAgo} ago</span>
                    </div>
                    <p className="text-sm text-neutral-600">
                      {activity.isOwnStatus ? 'Set status to' : 'Changed status to'} {activity.title.toLowerCase()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
